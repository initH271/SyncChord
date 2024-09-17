import {getAuthUserId} from "@convex-dev/auth/server";
import {mutation, QueryCtx} from "./_generated/server";
import {v} from "convex/values";
import {Doc, Id} from "./_generated/dataModel";

const populateMember = (ctx: QueryCtx, userId: Id<"users">, workspaceId: Id<"workspaces">): Promise<Doc<"members"> | null> => {
    return ctx.db.query("members").withIndex("by_workspace_id_user_id",
        (q) => q.eq("workspaceId", workspaceId).eq("userId", userId)
    ).unique()
}

export const create = mutation({
    args: {
        parentMessageId: v.optional(v.id("messages")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        body: v.string(),
        image: v.optional(v.id("_storage"))
    },
    handler: async (ctx, {
        workspaceId,
        parentMessageId,
        channelId,
        body,
        image,
    }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");

        const member = await populateMember(ctx, userId, workspaceId);
        if (!member) throw new Error("未授权行为")

        // TODO: 私聊对话处理

        return await ctx.db.insert("messages", {
            parentMessageId,
            workspaceId,
            channelId,
            body,
            image,
            updateAt: Date.now(),
            memberId: member._id,
        })

    }
})

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});