import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .filter(q => 
        q.or(
          q.eq(q.field("isArchived"), false),
          q.eq(q.field("isArchived"), undefined)
        )
      )
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
      completedAt: null,
      isArchived: false,
    });
    return task;
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("tasks"), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      isCompleted: args.isCompleted,
      completedAt: args.isCompleted ? Date.now() : null 
    });
  },
});

export const archiveCompletedTasks = mutation({
  args: { olderThanHours: v.number() },
  handler: async (ctx, args) => {
    const cutoffTime = Date.now() - (args.olderThanHours * 60 * 60 * 1000);
    
    const tasksToArchive = await ctx.db
      .query("tasks")
      .filter(q => 
        q.and(
          q.eq(q.field("isCompleted"), true),
          q.lt(q.field("completedAt"), cutoffTime),
          q.or(
            q.eq(q.field("isArchived"), false),
            q.eq(q.field("isArchived"), undefined)
          )
        )
      )
      .collect();

    for (const task of tasksToArchive) {
      await ctx.db.patch(task._id, { 
        isArchived: true 
      });
    }
    
    return tasksToArchive.length;
  },
}); 