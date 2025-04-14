import { query } from "./_generated/server";

export const getNetWorth = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("netWorth").collect();
  },
});

export const getCalculatedNetWorth = query({
  args: {},
  handler: async (ctx) => {
    const assets = await ctx.db.query("asset").collect();
    const liabilities = await ctx.db.query("liability").collect();
    const netWorth =
      assets.reduce((acc, asset) => acc + asset.principalAmount, 0) -
      liabilities.reduce(
        (acc, liability) => acc + liability.principalAmount,
        0
      );
    return netWorth;
  },
});
