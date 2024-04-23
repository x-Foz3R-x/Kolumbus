import RouteLink from "./_components/route-link";
import ProtectedLink from "./_components/protected-link";
import { accountUrl } from "~/lib/constants";

export default function Sitemap() {
  return (
    <div className="mx-auto flex w-screen max-w-screen-2xl flex-col items-center justify-center gap-2 space-y-6 p-8">
      <div>
        <h1 className="text-center text-lg font-bold">Site Map</h1>
        <p>Navigate through kolumbus using the links below.</p>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-4">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-400">General</h2>
          <RouteLink href="/">Home</RouteLink>
          <RouteLink href="/contact">Contact</RouteLink>
          <ProtectedLink href="/library">Library</ProtectedLink>
          <RouteLink href="/invite/invalid">Invalid Invite</RouteLink>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-400">Account</h2>
          <ProtectedLink href={accountUrl}>My Account</ProtectedLink>
          <RouteLink href="/signin">Sign In</RouteLink>
          <RouteLink href="/signup">Sign Up</RouteLink>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-400">Legal</h2>
          <RouteLink href="/legal">Legal</RouteLink>
          <RouteLink href="/legal/privacy">Privacy</RouteLink>
          <RouteLink href="/legal/terms">Terms</RouteLink>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-gray-400">Playground</h2>
          <RouteLink href="/playground">Playground</RouteLink>
          <RouteLink href="/playground/button">Button</RouteLink>
          <RouteLink href="/playground/permission-calculator">Permission Calculator</RouteLink>
        </div>
      </div>
    </div>
  );
}
