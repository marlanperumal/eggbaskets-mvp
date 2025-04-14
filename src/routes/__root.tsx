import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { z } from "zod";

export const Route = createRootRoute({
  validateSearch: z.object({
    npv: z.enum(["true", "false"]).optional().default("false"),
  }),
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
