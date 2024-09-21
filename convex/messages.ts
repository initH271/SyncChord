import {getAuthUserId} from "@convex-dev/auth/server";
import {mutation, query, QueryCtx} from "./_generated/server";
import {v} from "convex/values";
import {Id} from "./_generated/dataModel";
import {paginationOptsValidator} from "convex/server";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId)
}
const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId)
}
// 填充回应
const populateReaction = (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db.query("reactions").withIndex("by_message_id",
        (q) => q.eq("messageId", messageId))
        .collect();
}
// 填充thread
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    const messages = await ctx.db.query("messages").withIndex("by_parent_message_id",
        (q) => q.eq("parentMessageId", messageId))
        .collect();
    if (messages.length === 0) {
        return {
            count: 0,
            image: undefined, // 最后一个回复用户的头像
            timestamp: 0, // 最后一个回复的时间
        };
    }
    let lastMessage = messages[0]
    messages.forEach((message, i) => {
        if (message.updateAt > lastMessage.updateAt) {
            lastMessage = message
        }
    })
    const lastMember = await populateMember(ctx, lastMessage.memberId)
    if (!lastMember) {
        return {
            count: messages.length,
            image: undefined, // 最后一个回复用户的头像
            timestamp: 0, // 最后一个回复的时间
        };
    }
    const lastReplier = await populateUser(ctx, lastMember.userId)
    if (!lastReplier) {
        return {
            count: messages.length,
            image: undefined, // 最后一个回复用户的头像
            timestamp: 0, // 最后一个回复的时间
        };
    }
    return {
        count: messages.length,
        image: lastReplier.image,
        timestamp: lastMessage.updateAt,
    }

}


const getMember = (ctx: QueryCtx, userId: Id<"users">, workspaceId: Id<"workspaces">) => {
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

        const member = await getMember(ctx, userId, workspaceId);
        if (!member) throw new Error("未授权行为")
        let _conversationId = conversationId
        // thread回复处理, 仅有parentMessageId的情况
        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId)
            if (!parentMessage) throw new Error("回复的消息不存在");
            _conversationId = parentMessage.conversationId
        }
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


export const get = query({
    args: {
        parentMessageId: v.optional(v.id("messages")),
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, {
        parentMessageId,
        channelId,
        conversationId,
        paginationOpts
    }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");

        let _conversationId = conversationId
        // thread回复处理, 仅有parentMessageId的情况
        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId)
            if (!parentMessage) throw new Error("回复的消息不存在");
            _conversationId = parentMessage.conversationId
        }
        const results = ctx.db.query("messages").withIndex("by_channel_id_parent_message_id_conversation_id", q => q
            .eq("channelId", channelId)
            .eq("parentMessageId", parentMessageId)
            .eq("conversationId", _conversationId)
        ).order("desc").paginate(paginationOpts);

        return results;
    }
})