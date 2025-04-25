import {
  Outlet,
  createRootRoute,
  retainSearchParams,
  useSearch,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

import { TopBar } from "@/components/top-bar";

const searchSchema = z.object({
  npv: z.boolean().optional(),
});

const RootComponent = () => {
  const { npv = true } = useSearch({ from: "__root__" });
  return (
    <>
      <TopBar npv={npv} />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [retainSearchParams(["npv"])],
  },
  component: RootComponent,
});
