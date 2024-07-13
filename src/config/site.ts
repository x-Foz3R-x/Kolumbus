import type { FooterItem } from "~/types";

export type SiteConfig = typeof siteConfig;

const links = {
  discord: "https://discord.com/invite/UH5BP8Hy8z",
  instagram: "https://www.instagram.com/kolumbusapp/",
  youtube: "https://www.youtube.com/channel/UCJc9ERuxfuH2xEJmMhdPAUQ",
  x: "https://twitter.com/Kolumbusapp",
};

export const siteConfig = {
  name: "Kolumbus",
  description:
    "Travel Planning Made Simple and Fun! Discover the power of Kolumbus and transform your travel planning process. Build your itinerary, navigate your journey with map, manage your travel expenses, and organize your packing list. Your next adventure is just a few clicks away. Start your adventure with Kolumbus today.",
  url: "https://www.kolumbus.app",
  links,
  footerNav: [
    {
      items: [
        {
          title: "About",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Invalid Invite",
          href: "/invite/invalid",
          external: false,
        },
      ],
    },
    {
      items: [
        {
          title: "Sign in",
          href: "/signin",
          external: false,
        },
        {
          title: "Sign up",
          href: "/signup",
          external: false,
        },
        {
          title: "Reset Password",
          href: "/signin/reset-password",
          external: false,
        },
      ],
    },
    {
      items: [
        {
          title: "Discord",
          href: links.discord,
          external: true,
        },
        {
          title: "Instagram",
          href: links.instagram,
          external: true,
        },
        {
          title: "Youtube",
          href: links.youtube,
          external: true,
        },
        {
          title: "x.com",
          href: links.x,
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
