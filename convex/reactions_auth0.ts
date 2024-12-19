import {mutation} from "./_generated/server";
import {v} from "convex/values";
import {getAuth0UserId, getNotDeletedMember} from "./common";


// 切换reaction值, 返回删除或添加的reactionId
export const toggle = mutation({
    args: {
        messageId: v.id("messages"),
        value: v.string()
    },
    handler: async (ctx, {messageId, value}) => {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为");

        const message = await ctx.db.get(messageId)
        if (!message || message.isDeleted) throw new Error("消息不存在");

        const member = await getNotDeletedMember(ctx, userId, message.workspaceId)
        // 不存在的成员
        if (!member) throw new Error("未授权行为");
        // 对该条消息用户是否已存在reaction
        const existedReactionFromUser = await ctx.db.query("reactions").filter(q =>
            q.and(
                q.eq(q.field("messageId"), messageId),
                q.eq(q.field("memberId"), member._id),
                q.eq(q.field("value"), value),
            )
        ).first()
        // 已存在则删除
        if (existedReactionFromUser) {
            await ctx.db.delete(existedReactionFromUser._id)
            return existedReactionFromUser._id
        } else {// 否则添加
            return await ctx.db.insert("reactions", {
                workspaceId: message.workspaceId,
                memberId: member._id,
                messageId: messageId,
                value
            })
        }

    }
})
