import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";

import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Route as HomeRoute } from "@/routes/index";
import { Route as BalanceSheetRoute } from "@/routes/balance-sheet";
import { Route as IncomeStatementRoute } from "@/routes/income-statement";
import { Route as CashFlowRoute } from "@/routes/cash-flow";
import { Route as GoalsRoute } from "@/routes/goals";
import { Route as RetirementRoute } from "@/routes/retirement";

export function TopBar({ npv }: { npv: boolean }) {
  const navigate = useNavigate();

  const handleNpvChange = (checked: boolean) => {
    navigate({
      to: ".",
      search: {
        npv: checked,
      },
    });
  };

  return (
    <header className="bg-slate-300">
      <div className="p-2 flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <ShoppingBasket className="w-8 h-8" />
          <h1 className="text-2xl font-bold">egg baskets</h1>
          <h2 className="text-md mt-2">financial planning</h2>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Label htmlFor="npv-switch">Show NPV</Label>
          <Switch
            id="npv-switch"
            checked={npv}
            onCheckedChange={handleNpvChange}
          />
          <Avatar>
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <NavigationMenu className="p-1" defaultValue={HomeRoute.to}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to={HomeRoute.to}>Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to={BalanceSheetRoute.to}>Balance Sheet</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to={IncomeStatementRoute.to}>Income Statement</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to={CashFlowRoute.to}>Cash Flow</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to={GoalsRoute.to}>Goals</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to={RetirementRoute.to}>Retirement</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
