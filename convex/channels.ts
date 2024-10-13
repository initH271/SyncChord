import {getAuthUserId} from "@convex-dev/auth/server";
import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {getNotDeletedMember} from "./common";

// API: 获取workspace下channels
export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return [];
        const member = await getNotDeletedMember(ctx, userId, args.workspaceId);
        if (!member) return [];

        return await ctx.db.query("channels").withIndex("by_workspace_id",
            (q) => q.eq("workspaceId", args.workspaceId)).collect();
    }
})
// API: 获取channel
export const getById = query({
    args: {
        channelId: v.id("channels"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null;
        const channel = await ctx.db.get(args.channelId)
        if (!channel) return null;
        const member = await getNotDeletedMember(ctx, userId, channel.workspaceId);
        if (!member) return null;
        return channel
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
        const member = await getNotDeletedMember(ctx, userId, args.workspaceId);
        if (!member || "admin" !== member.role) throw new Error("未授权行为.");

        return await ctx.db.insert("channels", {
            workspaceId: args.workspaceId,
            name: args.name.replace(/\s+/g, "-")
        })
    }
})
// API: 修改一个channel
export const update = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        channelId: v.id("channels"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await getNotDeletedMember(ctx, userId, args.workspaceId);
        if (!member || "admin" !== member.role) throw new Error("未授权行为.");

        await ctx.db.patch(args.channelId, {
            name: args.name
        })

        return args.channelId
    }
})
// API: 删除一个channel
export const remove = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        channelId: v.id("channels"),
    },
    handler: async (ctx, {workspaceId, channelId}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await getNotDeletedMember(ctx, userId, workspaceId);
        if (!member || "admin" !== member.role) throw new Error("未授权行为.");
        const [messages] = await Promise.all([
            ctx.db.query("messages").withIndex("by_channel_id", q => q.eq("channelId", channelId)).collect(),
        ])
        for (const m of messages) {
            await ctx.db.delete(m._id)
        }
        await ctx.db.delete(channelId)
        return channelId
    }
})

