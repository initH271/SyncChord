import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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