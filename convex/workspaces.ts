import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// API: 获取所有workspace
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return [];

        const members = await ctx.db.query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();
        const workspaces = []
        const workspaceIds = members.map(m => m.workspaceId);
        for (const wsId of workspaceIds) {
            const workspace = await ctx.db.get(wsId);
            if (workspace) workspaces.push(workspace)
        }
        return workspaces
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

        await ctx.db.insert("members", {
            userId,
            workspaceId: wsId,
            role: "admin"
        })

        return wsId
    }
})