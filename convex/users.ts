import {query} from "./_generated/server";
import {getAuthUserId} from "@convex-dev/auth/server";
import {v} from "convex/values";

// 获取当前登录用户
export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null) {
            return null
        }
        return await ctx.db.get(userId)
    }
})

// API: 获取用户信息
export const getById = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, {userId}) => {
        return await ctx.db.get(userId)
    }
})
