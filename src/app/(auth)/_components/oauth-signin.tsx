"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";

import { showErrorToast } from "~/lib/handle-error";
import { Button, Icons, Spinner } from "~/components/ui";

type OAuthProvider = {
  name: string;
  icon: keyof typeof Icons;
  strategy: OAuthStrategy;
};

const oauthProviders = [
  { name: "Google", strategy: "oauth_google", icon: "google" },
  { name: "Discord", strategy: "oauth_discord", icon: "discord" },
] satisfies OAuthProvider[];

export default function OAuthSignIn() {
  const [loading, setLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  async function oauthSignIn(provider: OAuthStrategy) {
    if (!signInLoaded) return null;

    try {
      setLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {oauthProviders.map((provider) => {
        const Icon = Icons[provider.icon];

        return (
          <Button
            key={provider.strategy}
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={loading !== null}
            variant="appear"
            size="lg"
            className="flex h-10 w-full items-center justify-center rounded-lg border text-sm shadow-sm hover:bg-gray-100"
          >
            {loading === provider.strategy ? (
              <Spinner.default />
            ) : (
              <Icon className="mr-2.5 h-3.5 scale-100 overflow-visible" />
            )}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
