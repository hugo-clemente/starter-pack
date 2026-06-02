import { env } from "@starter-pack/env/web";
import type { AppRouter } from "@starter-pack/api/routers/index";

import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { toast } from "sonner";
import { activeOrgSlug } from "./active-org";

const onQueryError = createIsomorphicFn().client(
  (error: Error, query: { invalidate: () => void }) => {
    toast.error(error.message, {
      action: {
        label: "retry",
        onClick: query.invalidate,
      },
    });
  }
);

const getServerRequestHeaders = createIsomorphicFn()
  .server(() => getRequestHeaders())
  .client(() => undefined);

export const createQueryClient = () => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: onQueryError }),
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${env.VITE_SERVER_URL}/trpc`,
        fetch(url, options) {
          const baseHeaders = getServerRequestHeaders() ?? options?.headers;
          const orgSlug = activeOrgSlug.get();

          const headers = orgSlug
            ? { ...baseHeaders, "x-organization-slug": orgSlug }
            : baseHeaders;

          return fetch(url, {
            ...options,
            credentials: "include",
            headers,
          });
        },
      }),
    ],
  });

  const trpc = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient,
  });

  return { queryClient, trpc, trpcClient };
};
