import {convexAuth} from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google"
import {Password} from "@convex-dev/auth/providers/Password"


// 自定义附加字段 https://labs.convex.dev/auth/config/passwords#customize-user-information
import {DataModel, Id} from "./_generated/dataModel";
import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {addHours, addMonths, isBefore} from "date-fns";

const CustomPassword = Password<DataModel>({
    profile(params) {
        return {
            email: params.email as string,
            name: params.name as string,
            image: params.role as string,
        };
    },
});


export const {auth, signIn, signOut, store} = convexAuth({
    // providers: [GitHub, Google, Password],
    providers: [GitHub, Google, CustomPassword],
});


// API: 把store的部分能力暴露出来
export const auth0RefreshSession = mutation({
    args: {
        type: v.literal("refreshSession"),
        refreshToken: v.string(),

    },
    handler: async (ctx, args) => {
        return store(ctx, {
            args
        })
    }
})

// API: 获取用户信息, token暂时为userId | sessionId
export const auth0RetrieveUserInfo = mutation({
    args: {
        type: v.literal("retrieveAccountWithCredentials"),
        token: v.string(),
    },
    handler: async (ctx, {token}) => {
        // 此处解码token, 获取用户信息, token为jwt字符串, 使用jwt库进行处理
        const [userIdStr, sessionIdStr] = token.split("|")
        const [userId, sessionId] = [userIdStr as Id<"users">, sessionIdStr as Id<"authSessions">]
        if (!userId || !sessionId) return null

        const user = await ctx.db.get(userId)
        if (!user) return null;
        const session = await ctx.db.query("authSessions")
            .withIndex("userId", q => q.eq("userId", userId))
            .filter(q => q.eq(q.field("_id"), sessionId))
            .unique()
        if (!session) return null
        if (!!(session && isBefore(Date.now(), new Date(session.expirationTime))))
            return user
        return null
    }
})


// API: 查看session是否有效, token = userId | sessionId
// Return: true | false
export const validateSession = query({
    args: {
        token: v.string()
    },
    handler: async (ctx, {token}) => {
        const [userIdStr, sessionIdStr] = token.split("|")
        const [userId, sessionId] = [userIdStr as Id<"users">, sessionIdStr as Id<"authSessions">]
        const user = await ctx.db.get(userId)
        if (!user) return false;
        const session = await ctx.db.query("authSessions")
            .withIndex("userId", q => q.eq("userId", userId))
            .filter(q => q.eq(q.field("_id"), sessionId))
            .unique()
        return !!(session && isBefore(Date.now(), new Date(session.expirationTime))); // session过期则失效
    }
})

// API: 退出登录, token = token = userId | sessionId
export const signOutAuth0 = mutation({
    args: {
        token: v.string()
    },
    handler: async (ctx, {token}) => {
        const [userIdStr, sessionIdStr] = token.split("|")
        const [userId, sessionId] = [userIdStr as Id<"users">, sessionIdStr as Id<"authSessions">]
        const user = await ctx.db.get(userId)
        if (!user) return false;
        const session = await ctx.db.query("authSessions")
            .withIndex("userId", q => q.eq("userId", userId))
            .filter(q => q.eq(q.field("_id"), sessionId))
            .unique()
        if (!session) return false
        const refreshToken = await ctx.db.query("authRefreshTokens")
            .withIndex("sessionId", q => q.eq("sessionId", session._id))
            .first()
        if (refreshToken) await ctx.db.delete(refreshToken?._id);
        await ctx.db.delete(session._id)
        return true
    }
})

// API: 添加account
export const signInAuth0 = mutation({
    args: {
        provider: v.string(),
        providerAccountId: v.string(),
        params: v.object({
            email: v.string(),
            name: v.string(),
            image: v.string(),
        })
    },
    handler: async (ctx, {provider, providerAccountId, params}) => {
        let existed = await ctx.db.query("authAccounts")
            .withIndex("providerAndAccountId", q => q.eq("provider", provider).eq("providerAccountId", providerAccountId))
            .unique()
        if (!existed) {
            // 注册用户
            const newUserId = await ctx.db.insert("users", {
                name: params.name,
                email: params.email,
                image: params.image
            })
            const accountId = await ctx.db.insert("authAccounts", {
                provider,
                providerAccountId,
                userId: newUserId
            })
            existed = await ctx.db.get(accountId)
            if (!existed) {
                await ctx.db.delete(accountId)
                await ctx.db.delete(newUserId)
                throw new Error("发生错误,请重试");
            }
        }
        const existedSession = await ctx.db.query("authSessions")
            .withIndex("userId", q => q.eq("userId", existed.userId))
            .first()
        if (!existedSession) {
            const sessionId = await ctx.db.insert("authSessions", {
                userId: existed.userId,
                expirationTime: addMonths(Date.now(), 1).getTime(), // 会话有效期一个月
            })
            const refreshTokenId = await ctx.db.insert("authRefreshTokens", {
                sessionId,
                expirationTime: addMonths(addHours(Date.now(), 1), 1).getTime(), // refreshToken有效期1小时
            })
            return {
                refreshToken: refreshTokenId + "|" + sessionId,
            }
        }

        if (isBefore(new Date(existedSession.expirationTime), Date.now())) { // session过期
            const exitedToken = await ctx.db.query("authRefreshTokens")
                .withIndex("sessionId", q => q.eq("sessionId", existedSession._id))
                .first()
            if (exitedToken && isBefore(Date.now(), new Date(exitedToken.expirationTime))) { // token没过期
                await ctx.db.patch(existedSession._id, {
                    expirationTime: addMonths(new Date(existedSession.expirationTime), 1).getTime(), // 续上一个月
                })
                await ctx.db.patch(exitedToken._id, {
                    expirationTime: addMonths(new Date(exitedToken.expirationTime), 1).getTime(), // 续上一个月
                })
                return {
                    refreshToken: exitedToken._id + "|" + existedSession._id,
                }
            }
        }
        const exitedToken = await ctx.db.query("authRefreshTokens")
            .withIndex("sessionId", q => q.eq("sessionId", existedSession._id))
            .first()
        if (!exitedToken) {
            await ctx.db.delete(existedSession._id)
            throw new Error("发生错误, 请重试")
        }
        return {
            refreshToken: exitedToken._id + "|" + existedSession._id,
        }


    }
})
