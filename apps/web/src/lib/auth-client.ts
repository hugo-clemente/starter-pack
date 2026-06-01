import { polarClient } from "@polar-sh/better-auth/client";
import { env } from "@starter-pack/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  plugins: [polarClient()],
});
