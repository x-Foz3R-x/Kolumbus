import { useSignIn, SignIn } from "@clerk/nextjs";

import Icon from "./icons";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function AuthProviders() {
  const { signIn, isLoaded } = useSignIn();

  const signInWithGoogle = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso_callback",
      redirectUrlComplete: "/library",
    });
  };

  return (
    <section className="relative flex flex-col items-center gap-2 text-sm">
      <p className="absolute -top-9 z-10 w-14 cursor-default select-none bg-white text-center text-gray-500">or</p>

      <span className="h-10">
        <Button
          onClick={signInWithGoogle}
          variant="button"
          className="pointer-events-none flex w-80 items-center justify-center gap-2 border-gray-200 bg-gray-50 py-2 opacity-40"
        >
          <Icon.user className="h-3 w-3" />
          Try kolumbus as a Guest
        </Button>
      </span>

      <span className="h-10">
        <Button
          onClick={signInWithGoogle}
          variant="button"
          className={cn(
            "flex w-80 items-center justify-center gap-2 border-gray-200 bg-gray-50 py-2",
            !isLoaded && "pointer-events-none opacity-40",
          )}
        >
          <Icon.google className="h-3 w-3" />
          Continue with Google
        </Button>
      </span>
    </section>
  );
}
