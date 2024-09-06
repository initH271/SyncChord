import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// API: 获取用户所有workspace
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

// API: 获取workspace by id, 仅限用户作为成员所在的
export const getById = query({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
            .unique();
        if (!member) return null;
        return await ctx.db.get(args.id)
    }
})

// JoinCode生成 xxxx-xxxx-xxxx-xxxx
const generateJoinCode = (segLength: number, segCount: number) => {
    const codes: string[] = []
    Array.from({ length: segCount }).forEach(() => {
        codes.push(Array.from({ length: 4 }, () => "0987654321qwertyuioplkjhgfdsazxcvbnm"[Math.floor(Math.random() * 36)]).join(""))
    })
    console.log("codes:", codes);
    return codes.join("-")
}

// API: 创建workspace
export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为.");

        const joinCode = generateJoinCode(4, 4)
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