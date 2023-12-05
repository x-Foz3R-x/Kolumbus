/**
 * @category Sitemap
 * @version 1.0.0
 *
 * @description
 * This file contains the sitemap of the application.
 * Priority schema:
 * - 1: Home page.
 * - 0.9: Auth.
 * - 0.8: Important and frequently accessed pages (default).
 * - 0.5: Moderately important pages.
 * - 0.1: Easter egg pages.
 * - 0: Utility pages.
 */
export default async function sitemap() {
  return [
    {
      url: "https://www.kolumbus.app/",
      lastModified: "06-12-2023",
      priority: 1,
    },
    {
      url: "https://www.kolumbus.app/sign-in",
      lastModified: "06-12-2023",
      priority: 0.9,
    },
    {
      url: "https://www.kolumbus.app/sign-up",
      lastModified: "06-12-2023",
      priority: 0.9,
    },
    {
      url: "https://www.kolumbus.app/contact",
      lastModified: "06-12-2023",
      priority: 0.8,
    },
    {
      url: "https://www.kolumbus.app/sitemap",
      lastModified: "06-12-2023",
      priority: 0.5,
    },
    //#region Legal
    {
      url: "https://www.kolumbus.app/legal",
      lastModified: "06-12-2023",
      priority: 0,
    },
    {
      url: "https://www.kolumbus.app/legal/privacy",
      lastModified: "06-12-2023",
      priority: 0.5,
    },
    {
      url: "https://www.kolumbus.app/legal/terms",
      lastModified: "06-12-2023",
      priority: 0.5,
    },
    //#endregion
    //#region Playground
    {
      url: "https://www.kolumbus.app/playground",
      lastModified: "06-12-2023",
      priority: 0.1,
    },
    {
      url: "https://www.kolumbus.app/playground/button",
      lastModified: "06-12-2023",
      priority: 0.1,
    },
    {
      url: "https://www.kolumbus.app/playground/color",
      lastModified: "06-12-2023",
      priority: 0.1,
    },
    {
      url: "https://www.kolumbus.app/playground/dropdown",
      lastModified: "06-12-2023",
      priority: 0.1,
    },
    //#endregion
    {
      url: "https://www.kolumbus.app/t/guest",
      lastModified: "06-12-2023",
      priority: 0.8,
    },
  ];
}
