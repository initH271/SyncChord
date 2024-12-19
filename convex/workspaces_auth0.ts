import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {getAuth0UserId, getMember, getNotDeletedMember} from "./common";

// JoinCode生成 xxxx-xxxx-xxxx-xxxx
const generateJoinCode = (segLength: number = 4, segCount: number = 2) => {
    const codes: string[] = []
    Array.from({length: segCount}).forEach(() => {
        codes.push(Array.from({length: segLength}, () => "0987654321qwertyuioplkjhgfdsazxcvbnm"[Math.floor(Math.random() * 36)]).join(""))
    })
    return codes.join("")
}
/*
*   Auth0接口
*
*/

// API: 创建workspace
export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为.");

        const joinCode = generateJoinCode()
        const wsId = await ctx.db.insert("workspaces", {
            name: args.name,
            userId,
            joinCode
        })
        await ctx.db.insert("channels", {
            name: "general",
            workspaceId: wsId,
        })
        await ctx.db.insert("members", {
            userId,
            workspaceId: wsId,
            role: "admin"
        })

        return wsId
    }
})


// API: 修改workspace信息
export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.string(),
    },
    async handler(ctx, args) {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await getNotDeletedMember(ctx, userId, args.id);
        if (!member || member.role !== "admin") throw new Error("未授权行为");

        await ctx.db.patch(args.id, {
            name: args.name
        })
        return args.id
    },
})

// API: 删除workspace
export const remove = mutation({
    args: {
        id: v.id("workspaces"),
    },
    async handler(ctx, args) {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await getNotDeletedMember(ctx, userId, args.id);
        if (!member || member.role !== "admin") throw new Error("未授权行为");
        // 物理删除 成员, 再删除空间
        const [members, channels, reactions, conversations, messages] = await Promise.all([
            ctx.db.query("members").withIndex("by_workspace_id", q => q.eq("workspaceId", args.id)).collect(),
            ctx.db.query("channels").withIndex("by_workspace_id", q => q.eq("workspaceId", args.id)).collect(),
            ctx.db.query("reactions").withIndex("by_workspace_id", q => q.eq("workspaceId", args.id)).collect(),
            ctx.db.query("conversations").withIndex("by_workspace_id", q => q.eq("workspaceId", args.id)).collect(),
            ctx.db.query("messages").withIndex("by_workspace_id", q => q.eq("workspaceId", args.id)).collect(),
        ])
        for (const m of [...members, ...channels, ...reactions, ...conversations, ...messages]) {
            await ctx.db.delete(m._id)
        }

        await ctx.db.delete(args.id)
        return args.id
    },
})


// API: 生成新的joinCode
export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const member = await getNotDeletedMember(ctx, userId, args.workspaceId);
        if (!member || member.role !== "admin") throw new Error("未授权行为");
        const newCode = generateJoinCode()
        await ctx.db.patch(args.workspaceId, {
            joinCode: newCode
        })
        return args.workspaceId
    }
})


// API: 获取用户所有workspace
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuth0UserId(ctx)
        if (!userId) return [];

        const members = await ctx.db.query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .filter(q => q.neq(q.field("isDeleted"), true))
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

// API: 获取workspace Info by id, 仅限用户作为成员所在的
export const getInfoById = query({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为.");
        const workspace = await ctx.db.get(args.id)
        if (!workspace) throw new Error("不存在的工作空间")
        const member = await getNotDeletedMember(ctx, userId, workspace._id);
        return {
            name: workspace.name,
            isMember: !!member,
        }
    }
})

// API: 获取workspace by id, 仅限用户作为成员所在的
export const getById = query({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await getAuth0UserId(ctx)

        // if (!userId) throw new Error("未授权行为.");
        if (!userId) return null;
        const member = await getNotDeletedMember(ctx, userId, args.id);
        if (!member) return null;
        return await ctx.db.get(args.id)
    }
})

// API: 加入普通成员
export const join = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        joinCode: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuth0UserId(ctx)
        if (!userId) throw new Error("未授权行为.");

        const workspace = await ctx.db.get(args.workspaceId)
        if (!workspace) throw new Error("不存在的工作空间")
        if (args.joinCode.toLowerCase() !== workspace.joinCode) throw new Error("不存在的邀请码.")
        const member = await getMember(ctx, userId, args.workspaceId);
        if (!member) {
            await ctx.db.insert("members", {
                userId,
                workspaceId: args.workspaceId,
                role: "member"
            })
        } else if (member.isDeleted) {
            await ctx.db.patch(member._id, {
                isDeleted: false,
            })
        }
        return args.workspaceId
    }
})
