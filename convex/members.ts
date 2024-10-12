import {v} from "convex/values";
import {mutation, query, QueryCtx} from "./_generated/server";
import {getAuthUserId} from "@convex-dev/auth/server";
import {Doc, Id} from "./_generated/dataModel";
import {getNotDeletedMember} from "./common";

// API: 获取用户
const populateUser = (ctx: QueryCtx, id: Id<"users">): Promise<Doc<"users"> | null> => {
    return ctx.db.get(id)
}


// API: 获取workspace所有members
export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, {workspaceId}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return [];
        const member = await getNotDeletedMember(ctx, userId, workspaceId);
        if (!member) return [];

        const data = await ctx.db.query("members")
            .withIndex("by_workspace_id", q => q.eq("workspaceId", workspaceId))
            .filter(q => q.neq(q.field("isDeleted"), true))
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

        const member = await ctx.db.query("members")
            .withIndex("by_workspace_id_user_id", q => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
            .filter(q => q.neq(q.field("isDeleted"), true))
            .unique();
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
        if (!member || member.isDeleted) return null;
        // 不在同一workspace
        const currentMember = await getNotDeletedMember(ctx, userId, member.workspaceId)
        if (!currentMember) return null
        const user = await populateUser(ctx, member.userId)
        if (!user) return null;
        return {...member, user}
    },
})

// API: 修改member role信息
export const update = mutation({
    args: {
        id: v.id("members"),
        role: v.union(v.literal("admin"), v.literal("member"))
    },
    handler: async (ctx, {id, role}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");
        const member = await ctx.db.get(id);
        if (!member || member.isDeleted) throw new Error("成员不存在");
        const currentMember = await getNotDeletedMember(ctx, userId, member.workspaceId)
        if (!currentMember || currentMember.role !== "admin") throw new Error("未授权行为");
        await ctx.db.patch(member._id, {
            role
        })
        return id

    }
})
// API: 删除member
export const remove = mutation({
    args: {
        id: v.id("members"),
    },
    handler: async (ctx, {id}) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("未授权行为");
        const member = await ctx.db.get(id);
        if (!member || member.isDeleted || member.role === "admin") throw new Error("未授权行为");
        const currentMember = await getNotDeletedMember(ctx, userId, member.workspaceId)
        if (!currentMember || currentMember.role !== "admin") throw new Error("未授权行为");
        if (currentMember._id === id && currentMember.role === "admin") throw new Error("身为管理员 不能删除自己");
        // 先删除所有消息, reaction和对话
        const [messages, reactions, conversations] = await Promise.all([
            await ctx.db.query("messages").withIndex("by_member_id", q => q.eq("memberId", member._id)).collect(),
            await ctx.db.query("reactions").withIndex("by_member_id", q => q.eq("memberId", member._id)).collect(),
            await ctx.db.query("conversations").filter(q =>
                q.and(q.eq(q.field("workspaceId"), member.workspaceId),
                    q.or(q.eq(q.field("memberOneId"), member._id),
                        q.eq(q.field("memberTwoId"), member._id))))
                .collect(),
        ])
        for (const message of messages) { // 消息软删除
            await ctx.db.patch(message._id, {
                isDeleted: true,
                deletedAt: Date.now(),
            })
        }
        for (const reaction of reactions) {
            await ctx.db.delete(reaction._id)
        }
        for (const conversation of conversations) {
            await ctx.db.delete(conversation._id)
        }
        // await ctx.db.delete(member._id)
        await ctx.db.patch(member._id, {
            isDeleted: true,
            deletedAt: Date.now(),
        })
        const existed = await ctx.db.get(id);
        if (existed) throw new Error("删除失败");
    }
})