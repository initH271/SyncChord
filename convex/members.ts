import {v} from "convex/values";
import {query, QueryCtx} from "./_generated/server";
import {getAuthUserId} from "@convex-dev/auth/server";
import {Doc, Id} from "./_generated/dataModel";
import {getMember} from "./common";

// API: 获取用户
const populateUser = (ctx: QueryCtx, id: Id<"users">): Promise<Doc<"users"> | null> => {
    return ctx.db.get(id)
}


// API: 获取workspace所有members
export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return [];
        const member = await ctx.db.query("members").withIndex("by_workspace_id_user_id",
            (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)
        ).unique();
        if (!member) return [];

        const data = await ctx.db.query("members")
            .withIndex("by_workspace_id",
                (q) => q.eq("workspaceId", args.workspaceId))
            .collect()
        const members = []
        // 联系user数据
        for (const m of data) {
            const user = await populateUser(ctx, m.userId)
            if (user) members.push({...m, user})
        }
        return members
    }
})


// API: 获取用户在workspace的member
export const current = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    async handler(ctx, args) {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null;

        const member = await ctx.db.query("members").withIndex("by_workspace_id_user_id",
            (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)
        ).unique();
        return member
    },
})
// API: 获取用户在workspace的member
export const getById = query({
    args: {
        memberId: v.id("members")
    },
    async handler(ctx, {memberId}) {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null;
        const member = await ctx.db.get(memberId);
        if (!member) return null;
        // 不在同一workspace
        const currentMember = await getMember(ctx, userId, member.workspaceId)
        if (!currentMember) return null
        const user = await populateUser(ctx, member.userId)
        if (!user) return null;
        return {...member, user}
    },
})