"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { type HandleOAuthCallbackParams } from "@clerk/types";

export function SSOCallback(props: { searchParams: HandleOAuthCallbackParams }) {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(props.searchParams);
  }, [props.searchParams, handleRedirectCallback]);

  return null;
}
