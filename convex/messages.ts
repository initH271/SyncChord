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
        conversationId: v.optional(v.id("conversations")),
        body: v.string(),
        image: v.optional(v.id("_storage"))
    },
    handler: async (ctx, {
        workspaceId,
        parentMessageId,
        channelId,
        conversationId,
        body,
        image,
    }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");

        const member = await populateMember(ctx, userId, workspaceId);
        if (!member) throw new Error("未授权行为")
        let _conversationId = conversationId
        // thread回复处理, 仅有parentMessageId的情况
        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId)
            if (!parentMessage) throw new Error("回复的消息不存在");
            _conversationId = parentMessage.conversationId
        }
        // TODO: 私聊对话处理
        return await ctx.db.insert("messages", {
            parentMessageId,
            workspaceId,
            channelId,
            body,
            image,
            conversationId: _conversationId,
            updateAt: Date.now(),
            memberId: member._id,
        })

    }
})