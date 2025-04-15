import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

export function NetWorthTable() {
  const netWorth = useQuery(api.netWorth.getCalculatedNetWorth);
  return (
    <div>
      Net Worth:{" "}
      {netWorth &&
        new Intl.NumberFormat("en-ZA", {
          style: "currency",
          currency: "ZAR",
          maximumFractionDigits: 0,
        }).format(netWorth)}
    </div>
  );
}
