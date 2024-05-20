export type SidebarNavConfig = typeof sidebarNavConfig;

export const sidebarNavConfig = {
  tools: [
    {
      title: "Itinerary",
      slug: "",
      icon: "itinerary",
      development: false,
      disabled: false,
    },
    {
      title: "Map",
      slug: "map",
      icon: "map",
      development: true,
      disabled: true,
    },
    {
      title: "Expenses",
      slug: "expenses",
      icon: "expenses",
      development: true,
      disabled: true,
    },
    {
      title: "Packing List",
      slug: "packing-list",
      icon: "packingList",
      development: true,
      disabled: true,
    },
  ],
  pages: [
    {
      title: "Library",
      slug: "library",
      icon: "library",
      development: false,
      disabled: false,
    },
    {
      title: "Market",
      slug: "market",
      icon: "market",
      development: false,
      disabled: true,
    },
    {
      title: "Showcase",
      slug: "showcase",
      icon: "showcase",
      development: false,
      disabled: true,
    },
  ],
} as const;
