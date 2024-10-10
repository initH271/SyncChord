import {getAuthUserId} from "@convex-dev/auth/server";
import {mutation, query, QueryCtx} from "./_generated/server";
import {v} from "convex/values";
import {Doc, Id} from "./_generated/dataModel";
import {paginationOptsValidator} from "convex/server";
import {getMember, populateMember, populateUser} from "./common";

/**
 * 导出messages API相关参数类型
 */

/**
 * reactions的扩展类型
 */
export type ReactionsWithCount = Doc<"reactions"> & {
    count: number;
    memberIds: Id<"members">[];
}

/**
 * API辅助函数
 */

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
        if (message._creationTime > lastMessage._creationTime) {
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
        timestamp: lastMessage._creationTime,
    }

}

// 创建消息API
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
        if (image) {console.log("uploaded image id:", image)}
        return await ctx.db.insert("messages", {
            parentMessageId,
            workspaceId,
            channelId,
            body,
            image,
            conversationId: _conversationId,
            isDeleted: false,
            // updateAt: Date.now(),
            memberId: member._id,
        })

    }
})

// 查询消息API
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
        const results = await ctx.db.query("messages").withIndex("by_channel_id_parent_message_id_conversation_id", q => q
            .eq("channelId", channelId)
            .eq("parentMessageId", parentMessageId)
            .eq("conversationId", _conversationId)
        ).filter(q => q.eq(q.field("isDeleted"), false)).order("desc").paginate(paginationOpts);
        return {
            ...results,
            page: ( // 对message填充更详细的内容
                await Promise.all(results.page.map(async (message) => {
                    const member = await populateMember(ctx, message.memberId);
                    const user = member ? await populateUser(ctx, member.userId) : null;
                    if (!member || !user) return null;

                    const reactions = await populateReaction(ctx, message._id);
                    const thread = await populateThread(ctx, message._id);
                    const image = message.image ? await ctx.storage.getUrl(message.image) || undefined : undefined;

                    // a: message
                    //      😔(10) 🙂(99)
                    // reactions计数
                    const reactionsWithCounts = reactions.reduce((accumulator, reaction) => {
                        const existingReaction = accumulator.find(r => r.value === reaction.value); // 累加器里面找到已经存在的reaction
                        if (existingReaction) {
                            // 去重
                            existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]));
                            existingReaction.count = existingReaction.memberIds.length
                        } else {
                            accumulator.push({...reaction, memberIds: [reaction.memberId], count: 1})
                        }
                        return accumulator;
                    }, [] as ReactionsWithCount[]).map(({memberId, ...rest}) => rest);
                    return {
                        ...message,
                        image,
                        member,
                        user,
                        reactions: reactionsWithCounts,
                        thread,
                    }
                }))
            ).filter(message => message !== null)
        };
    }
})
// 查询单条消息包含reactions API
export const getById = query({
    args: {
        id: v.id("messages")
    },
    handler: async (ctx, {id}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null;
        const message = await ctx.db.get(id)
        if (!message) return null;
        const currentMember = await getMember(ctx, userId, message.workspaceId)
        if (!currentMember) return null;
        const member = await populateMember(ctx, message.memberId)
        if (!member) return null;
        const user = await populateUser(ctx, member.userId)
        if (!user) return null;
        const reactions = await populateReaction(ctx, id)
        const reactionsWithCounts = reactions.reduce((accumulator, reaction) => {
            const existingReaction = accumulator.find(r => r.value === reaction.value); // 累加器里面找到已经存在的reaction
            if (existingReaction) {
                // 去重
                existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]));
                existingReaction.count = existingReaction.memberIds.length
            } else {
                accumulator.push({...reaction, memberIds: [reaction.memberId], count: 1})
            }
            return accumulator;
        }, [] as ReactionsWithCount[]).map(({memberId, ...rest}) => rest);

        return {
            ...message,
            image: message.image ? await ctx.storage.getUrl(message.image) : undefined,
            user,
            member,
            reactions: reactionsWithCounts
        }
    }
})
// 修改消息API
export const update = mutation({
    args: {
        id: v.id("messages"),
        body: v.string(),
    },
    handler: async (ctx, {id, body}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");
        const message = await ctx.db.get(id)
        if (!message || message.isDeleted) throw new Error("消息不存在");

        const member = await ctx.db.get(message.memberId)
        if (!member || member._id !== message.memberId) throw new Error("未授权行为")
        await ctx.db.patch(id, {
            body,
            updateAt: Date.now()
        })
        return id;
    }
})
// 删除消息API
export const remove = mutation({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, {id}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");
        const message = await ctx.db.get(id)
        if (!message) throw new Error("消息不存在");

        const member = await ctx.db.get(message.memberId)
        if (!member || member._id !== message.memberId) throw new Error("未授权行为")
        // await ctx.db.delete(id)
        // 更换软删除策略
        await ctx.db.patch(id, {
            isDeleted: true,
            deletedAt: Date.now(),
        })
        return id;
    }
})