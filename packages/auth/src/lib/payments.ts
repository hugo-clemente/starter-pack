import { Polar } from "@polar-sh/sdk";
import { env } from "@starter-pack/env/server";

export const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
