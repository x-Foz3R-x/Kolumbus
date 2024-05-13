export type SidebarNavConfig = typeof sidebarNavConfig;

export const sidebarNavConfig = {
  tools: [
    {
      title: "Itinerary",
      icon: "itinerary",
      slug: "",
      development: false,
      disabled: false,
    },
    {
      title: "Map",
      icon: "map",
      slug: "map",
      development: true,
      disabled: true,
    },
    {
      title: "Expenses",
      icon: "expenses",
      slug: "expenses",
      development: true,
      disabled: true,
    },
    {
      title: "Packing List",
      icon: "packingList",
      slug: "packing-list",
      development: true,
      disabled: true,
    },
  ],
  pages: [
    {
      title: "Library",
      icon: "library",
      slug: "library",
      development: false,
      disabled: false,
    },
    {
      title: "Market",
      icon: "market",
      slug: "market",
      development: false,
      disabled: true,
    },
    {
      title: "Showcase",
      icon: "showcase",
      slug: "showcase",
      development: false,
      disabled: true,
    },
  ],
} as const;
