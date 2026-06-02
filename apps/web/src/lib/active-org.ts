import { createCookie } from "start-cookie";

export const activeOrgSlug = createCookie("org", {
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 300, // 300 days
});
