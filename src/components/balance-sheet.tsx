import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { NewAssetDialog } from "./new-asset-dialog";
import { NewLiabilityDialog } from "./new-liability-dialog";
import { AssetsTable } from "./assets-table";
import { LiabilitiesTable } from "./liabilities-table";
import { NetWorthTable } from "./net-worth-table";

export function BalanceSheet() {
  return (
    <div className="flex flex-col gap-2">
      <Card className="py-4">
        <CardHeader>
          <CardTitle className="text-center">
            <NetWorthTable />
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="gap-0 flex-1">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row gap-2 items-center justify-between">
              Assets
              <NewAssetDialog />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AssetsTable />
        </CardContent>
      </Card>
      <Card className="gap-0 flex-1">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row gap-2 items-center justify-between">
              Liabilities
              <NewLiabilityDialog />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LiabilitiesTable />
        </CardContent>
      </Card>
    </div>
  );
}
