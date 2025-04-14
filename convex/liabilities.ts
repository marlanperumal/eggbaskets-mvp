import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getLiabilities = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("liability").collect();
  },
});

export const addLiability = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    principalAmount: v.number(),
    interestRate: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("liability", args);
    return id;
  },
});

export const deleteLiability = mutation({
  args: {
    id: v.id("liability"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
