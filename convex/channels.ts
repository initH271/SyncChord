import {getAuthUserId} from "@convex-dev/auth/server";
import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

// API: 获取workspace下channel
export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return [];
        const member = await ctx.db.query("members").withIndex("by_workspace_id_user_id",
            (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if (!member) return [];

        const channels = await ctx.db.query("channels").withIndex("by_workspace_id",
            (q) => q.eq("workspaceId", args.workspaceId)).collect();
        return channels;
    }
})

// API: 创建一个channel
export const create = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await ctx.db.query("members").withIndex("by_workspace_id_user_id",
            (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if (!member || "admin" !== member.role) throw new Error("未授权行为.");

        const chId = await ctx.db.insert("channels", {
            workspaceId: args.workspaceId,
            name: args.name.replace(/\s+/g, "-")
        })

        return chId
    }
})

