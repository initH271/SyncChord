import {QueryCtx} from "./_generated/server";
import {Id} from "./_generated/dataModel";


// 获取当前登录用户，使用auth0
/**
 * {
 *     "issuer": "https://dev-lo7asc24b6fp5jb3.us.auth0.com/",
 *     "name": "阿凯ak",
 *     "nickname": "ak-ing",
 *     "pictureUrl": "https://avatars.githubusercontent.com/u/65901383?v=4",
 *     "sid": "Ie8HpJXwKAm09ZCXQR4UmyqsWFWSHY8M",
 *     "subject": "github|65901383",
 *     "tokenIdentifier": "https://dev-lo7asc24b6fp5jb3.us.auth0.com/|github|65901383",
 *     "updatedAt": "2024-12-19T11:32:53.232+00:00"
 * }
 */
export const currentAuth0 = async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        return null
    }
    const {subject} = identity
    const [provider, providerAccountId] = subject?.split("|")
    const accountEx = await ctx.db.query("authAccounts")
        .withIndex("providerAndAccountId",
            q =>
                q.eq("provider", provider).eq("providerAccountId", providerAccountId))
        .unique()
    if (!accountEx) {
        return {
            ...identity
        }
    }
    const userId = accountEx.userId
    const userEx = await ctx.db.get(userId)
    return {
        userEx,
        accountEx,
        ...identity
    }
}


// 获取用户所在当前workspace的member身份信息
export const getNotDeletedMember = (ctx: QueryCtx, userId: Id<"users">, workspaceId: Id<"workspaces">) => {
    return ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", q => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .filter(q => q.neq(q.field("isDeleted"), true))
        .unique()
}

// 获取用户所在当前workspace的member身份信息
export const getMember = (ctx: QueryCtx, userId: Id<"users">, workspaceId: Id<"workspaces">) => {
    return ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", q => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .unique()
}

// 获取用户信息
export const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId)
}

// 获取member信息
export const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId)
}
