import "./index.css";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import Loader from "./components/loader";
import { buildAuthClient } from "./lib/auth-client";
import { createQueryClient } from "./lib/query-client";
import { routeTree } from "./routeTree.gen";
import { TRPCProvider } from "./utils/trpc";

export const getRouter = () => {
  const authClient = buildAuthClient();
  const { queryClient, trpcClient, trpc } = createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { trpc, queryClient, authClient },
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>Not Found</div>,
    Wrap: ({ children }) => (
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
      </TRPCProvider>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
