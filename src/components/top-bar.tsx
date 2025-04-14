import { ShoppingBasket } from "lucide-react";
import { AvatarFallback } from "./ui/avatar";

import { Avatar } from "./ui/avatar";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export function TopBar() {
  return (
    <header className="p-2 flex flex-row justify-between items-center bg-slate-300">
      <div className="flex flex-row gap-2 items-center">
        <ShoppingBasket className="w-8 h-8" />
        <h1 className="text-2xl font-bold">egg baskets</h1>
        <h2 className="text-md mt-2">financial planning</h2>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Label htmlFor="npv-switch">NPV</Label>
        <Switch id="npv-switch" checked={true} />
        <Avatar>
          <AvatarFallback>MP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
