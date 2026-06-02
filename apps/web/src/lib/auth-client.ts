import type { auth } from "@starter-pack/auth";
import { env } from "@starter-pack/env/web";

import { polarClient } from "@polar-sh/better-auth";
import { useRouteContext } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { BetterAuthClientOptions } from "better-auth";
import {
  customSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClientOptions = {
  baseURL: env.VITE_SERVER_URL,
  plugins: [
    organizationClient(),
    polarClient(),
    customSessionClient<typeof auth>(),
  ],
} satisfies BetterAuthClientOptions;

export const buildAuthClient = createIsomorphicFn()
  .server(() =>
    createAuthClient({
      ...authClientOptions,
      fetchOptions: {
        headers: getRequestHeaders(),
      },
    })
  )
  .client(() => createAuthClient(authClientOptions));

export type AuthClient = ReturnType<typeof buildAuthClient>;

export function useAuthClient() {
  return useRouteContext({ from: "__root__" }).authClient;
}
