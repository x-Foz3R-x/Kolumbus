// import UserSVG from "@/assets/svg/User.svg";
// import GoogleSVG from "@/assets/svg/brands/Google.svg";

import Icon from "./icons";

export default function AuthProviders() {
  const className =
    "flex h-9 w-80 select-none items-center justify-center gap-2 rounded-md border border-gray-200 px-4 shadow-softSm hover:bg-gray-200";

  return (
    <section className="relative flex flex-col items-center justify-center gap-2 text-[0.8125rem]">
      <p className="absolute -top-9 z-10 w-14 cursor-default select-none bg-white text-center">or</p>
      <button className={className}>
        <Icon.user className="h-3 w-3" />
        Try kolumbus as a Guest
      </button>

      <button className={className}>
        <Icon.google className="h-3 w-3" />
        Continue with Google
      </button>
    </section>
  );
}
