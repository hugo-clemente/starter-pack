import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv: {
    ...(import.meta as any).env,
    // allowing to specify an internal server URL for the web app on railway
    VITE_SERVER_URL: process.env.SERVER_INTERNAL_URL ?? (import.meta as any).env.VITE_SERVER_URL,
  },
  emptyStringAsUndefined: true,
});
