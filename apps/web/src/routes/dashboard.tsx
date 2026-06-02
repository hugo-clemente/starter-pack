import { Button } from "@starter-pack/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { useTRPC } from "@/utils/trpc";
import { customerStateQueryOptions, sessionQueryOptions } from "@/utils/auth";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient, authClient } }) => {
    const [session, customerState] = await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions(authClient)),
      queryClient.ensureQueryData(customerStateQueryOptions(authClient)),
    ]);

    return { session, customerState };
  },
  loader: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const { session, customerState, authClient } = Route.useRouteContext();

  const trpc = useTRPC();
  const privateData = useQuery(trpc.privateData.queryOptions());

  const hasProSubscription = (customerState?.activeSubscriptions?.length ?? 0) > 0;
  // For debugging: console.log("Active subscriptions:", customerState?.activeSubscriptions);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <p>API: {privateData.data?.message}</p>
      <p>Plan: {hasProSubscription ? "Pro" : "Free"}</p>
      {hasProSubscription ? (
        <Button
          onClick={async function handlePortal() {
            await authClient.customer.portal();
          }}
        >
          Manage Subscription
        </Button>
      ) : (
        <Button
          onClick={async function handleUpgrade() {
            await authClient.checkout({ slug: "pro" });
          }}
        >
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
}
