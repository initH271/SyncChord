import {getAuthUserId} from "@convex-dev/auth/server";
import {mutation} from "./_generated/server";
import {v} from "convex/values";
import {getNotDeletedMember} from "./common";

// 创建或获取私聊对话API
export const createOrGet = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        toMemberId: v.id("members"), // 对话的member
    },
    handler: async (ctx, {
        workspaceId, toMemberId
    }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");
        const currentMember = await getNotDeletedMember(ctx, userId, workspaceId);
        if (!currentMember) throw new Error("未授权行为")
        const toMember = await ctx.db.get(toMemberId)
        if (!toMember) throw new Error("成员不存在")
        // 检测是否存在私聊对话
        const existingConversation = await ctx.db.query("conversations")
            .withIndex("by_workspace_id", q => q.eq("workspaceId", workspaceId))
            .filter(q => q.or(
                q.and(
                    q.eq(q.field("memberOneId"), currentMember._id),
                    q.eq(q.field("memberTwoId"), toMember._id)
                ),
                q.and(
                    q.eq(q.field("memberOneId"), toMember._id),
                    q.eq(q.field("memberTwoId"), currentMember._id)
                ),
            ))
            .unique()
        if (existingConversation) {
            return existingConversation._id
        }
        // 创建新的对话
        const conversationId = await ctx.db.insert("conversations", {
            workspaceId,
            memberOneId: currentMember._id,
            memberTwoId: toMember._id
        })
        const conversation = await ctx.db.get(conversationId)
        if (!conversation) {
            throw new Error("对话不存在")
        }
        return conversation._id
    }
})