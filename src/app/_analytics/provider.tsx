"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useUser } from "@clerk/nextjs";
import { env } from "~/env";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
    </PostHogProvider>
  );
}

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  const userInfo = useUser();

  useEffect(() => {
    if (userInfo.user) {
      posthog.identify(userInfo.user.id, {
        name: userInfo.user.fullName,
        email: userInfo.user.emailAddresses[0]?.emailAddress,
      });
    } else if (!userInfo.isSignedIn) posthog.reset();
  }, [userInfo]);

  return children;
}
