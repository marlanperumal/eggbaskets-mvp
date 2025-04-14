import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getLiabilities = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("liability").collect();
  },
});

export const getLiability = query({
  args: {
    id: v.id("liability"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addLiability = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    principalAmount: v.number(),
    interestRate: v.number(),
    annualRepayment: v.optional(v.number()),
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

export const updateLiability = mutation({
  args: {
    id: v.id("liability"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    startYear: v.optional(v.number()),
    endYear: v.optional(v.number()),
    principalAmount: v.optional(v.number()),
    interestRate: v.optional(v.number()),
    annualRepayment: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      type: args.type,
      startYear: args.startYear,
      endYear: args.endYear,
      principalAmount: args.principalAmount,
      interestRate: args.interestRate,
      annualRepayment: args.annualRepayment,
    });
  },
});
