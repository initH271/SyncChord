import { defineSchema, defineTable, } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
    ...authTables,
    // Your other tables...
    workspaces: defineTable({
        name: v.string(),
        joinCode: v.string(),
        userId: v.id("users"), // 外键users表_id
    }),
});

export default schema;