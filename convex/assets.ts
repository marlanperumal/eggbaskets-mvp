import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAssets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("asset").collect();
  },
});

export const getAsset = query({
  args: {
    id: v.id("asset"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addAsset = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    principalAmount: v.number(),
    interestRate: v.number(),
    annualContribution: v.optional(v.number()),
    fromAccount: v.optional(v.id("asset")),
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

export const updateAsset = mutation({
  args: {
    id: v.id("asset"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    startYear: v.optional(v.number()),
    endYear: v.optional(v.number()),
    principalAmount: v.optional(v.number()),
    interestRate: v.optional(v.number()),
    annualContribution: v.optional(v.number()),
    fromAccount: v.optional(v.id("asset")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      type: args.type,
      startYear: args.startYear,
      endYear: args.endYear,
      principalAmount: args.principalAmount,
      interestRate: args.interestRate,
      annualContribution: args.annualContribution,
      fromAccount: args.fromAccount,
    });
  },
});
