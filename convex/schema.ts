import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  netWorth: defineTable({
    date: v.string(),
    assets: v.number(),
    liabilities: v.number(),
  }),
});
