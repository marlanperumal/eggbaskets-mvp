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
    startDate: v.string(),
    endDate: v.optional(v.string()),
    principalAmount: v.number(),
    interestRate: v.number(),
  }),
  liability: defineTable({
    name: v.string(),
    type: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    principalAmount: v.number(),
    interestRate: v.number(),
  }),
});
