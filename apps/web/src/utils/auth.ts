import { queryOptions } from "@tanstack/react-query";

import type { AuthClient } from "@/lib/auth-client";

export const sessionQueryOptions = (authClient: AuthClient) =>
  queryOptions({
    queryKey: ["auth", "session"],
    queryFn: async () =>
      authClient.getSession({
        fetchOptions: {
          throw: true,
        },
      }),
  });

export const organizationsQueryOptions = (authClient: AuthClient) =>
  queryOptions({
    queryKey: ["auth", "organizations"],
    queryFn: async () =>
      authClient.organization.list({
        fetchOptions: {
          throw: true,
        },
      }),
  });

export const customerStateQueryOptions = (authClient: AuthClient) =>
  queryOptions({
    queryKey: ["auth", "customerState"],
    queryFn: async () =>
      authClient.customer.state({
        fetchOptions: {
          throw: true,
        },
      }),
  });
