import { defineSchema, defineTable, } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const schema = defineSchema({
    ...authTables,
    // Your other tables...
    tasks: defineTable({
        isCompleted: v.boolean(),
        text: v.string(),
    }),
});

export default schema;