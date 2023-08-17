// import UserSVG from "@/assets/svg/User.svg";
// import GoogleSVG from "@/assets/svg/brands/Google.svg";

import Icon from "./icons";

export default function AuthProviders() {
  const className =
    "flex h-9 w-80 select-none items-center justify-center gap-2 rounded-md border border-gray-200 px-4 shadow-soft hover:bg-gray-200";

  return (
    <section className="relative flex flex-col items-center justify-center gap-3 text-[13px]">
      <p className="absolute -top-9 z-10 w-14 cursor-default select-none bg-white text-center">or</p>
      <button className={className}>
        <Icon.x className="h-[13px] w-[13px]" />
        Try kolumbus as a Guest
      </button>
      <button className={className}>
        <Icon.x className="h-[13px] w-[13px]" />
        Continue with Google
      </button>
    </section>
  );
}
// box-shadow: rgba(15, 15, 15, 0.05) 0px 1px 2px;
