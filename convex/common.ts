import {QueryCtx} from "./_generated/server";
import {Id} from "./_generated/dataModel";


// 获取用户所在当前workspace的member身份信息
export const getNotDeletedMember = (ctx: QueryCtx, userId: Id<"users">, workspaceId: Id<"workspaces">) => {
    return ctx.db.query("members")
        .withIndex("by_workspace_id_user_id", q => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .filter(q => q.neq(q.field("isDeleted"), true))
        .unique()
}

// 获取用户信息
export const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId)
}

// 获取member信息
export const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId)
}