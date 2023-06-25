import SubmitButton from "./submit";
import AuthProviderSection from "./AuthProviderSection";

import FormSeparatorSVG from "@/assets/svg/Separator.svg";

interface SubmitProps {
  handleClick?: any;
  isEnabled: boolean;
  className?: string;
}

/**
 * @param handleClick function that will be fired on click
 * @param isEnabled status of button
 * @param className tailwind styles
 */
export function Submit({ handleClick, isEnabled, className }: SubmitProps) {
  return (
    <SubmitButton
      handleClick={handleClick}
      isEnabled={isEnabled}
      className={className}
    />
  );
}

export function AuthProviders() {
  return <AuthProviderSection />;
}

interface SeparatorProps {
  separatorWidth?: number;
}

/**
 * @param separatorWidth separatorWidth * 100 = width in px
 */
export function FormSeparator({ separatorWidth = 3.2 }: SeparatorProps) {
  return (
    <FormSeparatorSVG
      style={{ transform: `scaleX(${separatorWidth})` }}
      className="my-6 h-px"
    />
  );
}
