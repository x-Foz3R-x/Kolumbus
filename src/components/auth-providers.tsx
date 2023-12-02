import { useSignIn } from "@clerk/nextjs";

import Icon from "./icons";
import Button from "./ui/button";

export default function AuthProviders() {
  const { signIn, isLoaded } = useSignIn();

  const signInWithGoogle = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/oauth_callback",
      redirectUrlComplete: "/library",
    });
  };

  return (
    <section className="relative flex flex-col items-center gap-2 text-sm">
      <p className="absolute -top-9 z-10 w-14 cursor-default select-none bg-white text-center">or</p>

      <Button
        variant="unstyled"
        className="flex h-9 w-80 items-center justify-center gap-2 border border-gray-200 shadow-softSm duration-200 ease-kolumb-flow hover:bg-gray-100"
        disabled
      >
        <Icon.user className="h-3 w-3" />
        Try kolumbus as a Guest
      </Button>

      <Button
        onClick={signInWithGoogle}
        variant="unstyled"
        className="flex h-9 w-80 items-center justify-center gap-2 border border-gray-200 shadow-softSm duration-200 ease-kolumb-flow hover:bg-gray-100"
        disabled={!isLoaded}
      >
        <Icon.google className="h-3 w-3" />
        Continue with Google
      </Button>
    </section>
  );
}
