import { query } from "./_generated/server";

export const getNetWorth = query({
  args: {},
  handler: async (ctx) => {
    const netWorth = await ctx.db.query("netWorth").collect();
    return netWorth;
  },
});
