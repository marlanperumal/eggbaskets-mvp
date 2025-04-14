import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAssets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("asset").collect();
  },
});

export const addAsset = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    principalAmount: v.number(),
    interestRate: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("asset", args);
    return id;
  },
});

export const deleteAsset = mutation({
  args: {
    id: v.id("asset"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
