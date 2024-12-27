import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
    completedAt: v.union(v.number(), v.null()),
    isArchived: v.optional(v.boolean()),
  }),
}); 