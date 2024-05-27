"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";

import { showErrorToast } from "@/lib/handle-error";
import { Button, SpinnerCopy } from "@/components/ui";
import Icon from "@/components/icons";

type OAuthProvider = {
  name: string;
  icon: keyof typeof Icon;
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
    <div className="flex w-full items-center gap-2">
      {oauthProviders.map((provider) => {
        const CurrentIcon = Icon[provider.icon];

        return (
          <Button
            key={provider.strategy}
            onClick={() => void oauthSignIn(provider.strategy)}
            disabled={loading !== null}
            variant="appear"
            size="lg"
            className="flex h-10 w-full items-center justify-center rounded-lg border text-sm shadow-sm hover:bg-gray-100"
          >
            {loading === provider.strategy ? <SpinnerCopy.default /> : <CurrentIcon className="mr-2.5 h-3.5 scale-100 overflow-visible" />}
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
}
