import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// API: 获取所有workspace
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        return await ctx.db.query("workspaces").collect();
    },
});

// API: 获取workspace by id
export const getById = query({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");

        return await ctx.db.get(args.id)
    }
})

// API: 创建workspace
export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");

        const joinCode = "123456"
        const wsId = await ctx.db.insert("workspaces", {
            name: args.name,
            userId,
            joinCode
        })
        return wsId
    }
})