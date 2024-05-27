import { type HandleOAuthCallbackParams } from "@clerk/types";
import { SSOCallback } from "@/app/(auth)/_components/sso-callback";
import { SpinnerCopy } from "@/components/ui";

export default function SSOCallbackPage(props: { searchParams: HandleOAuthCallbackParams }) {
  return (
    <div role="status" aria-label="Loading" aria-describedby="loading-description" className="pt-8">
      <SpinnerCopy.default size="xl" className="fill-gray-600" />
      <SSOCallback searchParams={props.searchParams} />
    </div>
  );
}
