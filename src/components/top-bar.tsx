import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBasket, Trash2 } from "lucide-react";

import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Route as HomeRoute } from "@/routes/index";
import { Route as FinancialPlanRoute } from "@/routes/financial-plan";
import { Route as MoneyMapRoute } from "@/routes/money-map";
import { Route as GoalsRoute } from "@/routes/goals";
import { Route as RetirementRoute } from "@/routes/retirement";
import { useStore } from "@/store";

export function TopBar({ npv }: { npv: boolean }) {
  const navigate = useNavigate();
  const resetStore = useStore((state) => state.resetStore);

  const handleNpvChange = (checked: boolean) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        npv: checked,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const handleClearAll = () => {
    resetStore();
  };

  const NavigationItems = () => (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to={HomeRoute.to}>🏠 Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to={RetirementRoute.to}>👵 Retirement</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to={GoalsRoute.to}>🎯 Goals</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to={MoneyMapRoute.to}>💸 Money Map</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link to={FinancialPlanRoute.to}>💰 Financial Plan</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );

  return (
    <header className="bg-slate-300 sticky top-0 z-50">
      <div className="p-2 flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <ShoppingBasket className="w-8 h-8" />
          <h1 className="text-2xl font-bold">egg baskets</h1>
          <h2 className="text-md mt-2 hidden sm:block">financial planning</h2>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Label htmlFor="npv-switch" className="hidden sm:block">
            Show NPV
          </Label>
          <Switch
            id="npv-switch"
            checked={npv}
            onCheckedChange={handleNpvChange}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your financial data to default values.
                  This action cannot be undone. The Current Account will be
                  preserved but reset to $0.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Avatar>
            <AvatarFallback>MP</AvatarFallback>
          </Avatar>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[360px]">
              <nav className="flex flex-col gap-4">
                <SheetClose asChild>
                  <Link
                    to={HomeRoute.to}
                    className="block px-2 py-1 hover:bg-slate-200 rounded"
                  >
                    🏠 Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to={RetirementRoute.to}
                    className="block px-2 py-1 hover:bg-slate-200 rounded"
                  >
                    👵 Retirement
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to={GoalsRoute.to}
                    className="block px-2 py-1 hover:bg-slate-200 rounded"
                  >
                    🎯 Goals
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to={MoneyMapRoute.to}
                    className="block px-2 py-1 hover:bg-slate-200 rounded"
                  >
                    💸 Money Map
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to={FinancialPlanRoute.to}
                    className="block px-2 py-1 hover:bg-slate-200 rounded"
                  >
                    💰 Financial Plan
                  </Link>
                </SheetClose>
                <div className="border-t pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset all your financial data to default
                          values. This action cannot be undone. The Current
                          Account will be preserved but reset to $0.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll}>
                          Clear All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <NavigationMenu
        className="p-1 hidden md:block"
        defaultValue={HomeRoute.to}
      >
        <NavigationMenuList>
          <NavigationItems />
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
