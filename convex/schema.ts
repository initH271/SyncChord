import { defineSchema, defineTable, } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
    ...authTables,
    // Your other tables...
    workspaces: defineTable({ // workspaces table
        name: v.string(),
        joinCode: v.string(),
        userId: v.id("users"), // 外键users表_id
    })
        .index("by_join_code", ["joinCode"])
        .index("by_user_id", ["userId"]),
    members: defineTable({ // members table
        userId: v.id("users"),
        workspaceId: v.id("workspaces"),
        role: v.union(v.literal("admin"), v.literal("member"))
    })
        .index("by_user_id", ["userId"])
        .index("by_workspace_id", ["workspaceId"])
        .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
});

export default schema;