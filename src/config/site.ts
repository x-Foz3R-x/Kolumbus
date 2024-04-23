import type { FooterItem } from "~/types";

export type SiteConfig = typeof siteConfig;

const links = {
  x: "https://twitter.com/Kolumbusapp",
  instagram: "https://www.instagram.com/kolumbusapp/",
  youtube: "https://www.youtube.com/channel/UCJc9ERuxfuH2xEJmMhdPAUQ",
  discord: "https://discord.com/invite/UH5BP8Hy8z",
};

export const siteConfig = {
  name: "Kolumbus",
  description:
    "Travel Planning Made Simple and Fun! Discover the power of Kolumbus and transform your travel planning process. Build your itinerary, navigate your journey with map, manage your travel expenses, and organize your packing list. Your next adventure is just a few clicks away. Start your adventure with Kolumbus today.",
  url: "https://www.kolumbus.app",
  // ogImage: "https://www.kolumbus.app/opengraph-image.png",
  links,
  footerNav: [
    {
      title: "Help",
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
          title: "Terms",
          href: "/terms",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "X",
          href: links.x,
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
          title: "Discord",
          href: links.discord,
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
