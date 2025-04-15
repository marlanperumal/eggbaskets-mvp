import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  netWorth: defineTable({
    date: v.string(),
    assets: v.number(),
    liabilities: v.number(),
  }),
  asset: defineTable({
    name: v.string(),
    type: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    principalAmount: v.number(),
    interestRate: v.number(),
    annualContribution: v.optional(v.number()),
    fromAccount: v.optional(v.id("asset")),
  }),
  liability: defineTable({
    name: v.string(),
    type: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    principalAmount: v.number(),
    interestRate: v.number(),
    annualRepayment: v.optional(v.number()),
    fromAccount: v.optional(v.id("asset")),
  }),
});
