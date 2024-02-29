/**
 * @category Sitemap
 * @updated 2023-12-05
 *
 * Priority grade system:
 * - 1.0: Critical - Reserved for home page or critical landing pages.
 * - 0.9: Very High - Assigned to pages of very high importance, such as key conversion funnels or crucial user interaction points.
 * - 0.8: High - Given to important and frequently accessed pages, like sign-in, sign-up, or major sections of your website.
 * - 0.7: Significant - Used for pages that are significant but slightly less critical in importance.
 * - 0.6: Above Average - Assigned to above-average important pages.
 * - 0.5: Moderate - Applied to moderately important pages, like legal pages or privacy policies.
 * - 0.4: Below Average - Given to pages of below-average importance.
 * - 0.3: Low - Reserved for pages of low importance in the overall structure of the site.
 * - 0.2: Very Low - Assigned to pages of very low importance or pages that are more like Easter eggs.
 * - 0.1: Minimal - Used for utility pages or pages with minimal importance in the context of the application.
 * - 0.0: Excluded - Indicates that the page should be excluded from the sitemap or considered the lowest possible priority.
 */
export default async function sitemap() {
  return [
    {
      url: "https://www.kolumbus.app/",
      lastModified: "2023-12-05",
      priority: 1.0,
    },
    {
      url: "https://www.kolumbus.app/sign-in",
      lastModified: "2023-12-05",
      priority: 0.8,
    },
    {
      url: "https://www.kolumbus.app/sign-up",
      lastModified: "2023-12-05",
      priority: 0.8,
    },
    {
      url: "https://www.kolumbus.app/contact",
      lastModified: "2023-12-05",
      priority: 0.6,
    },
    {
      url: "https://www.kolumbus.app/sitemap",
      lastModified: "2023-12-05",
      priority: 0.4,
    },
    //#region Legal
    {
      url: "https://www.kolumbus.app/legal",
      lastModified: "2023-12-05",
      priority: 0.4,
    },
    {
      url: "https://www.kolumbus.app/legal/privacy",
      lastModified: "2023-12-05",
      priority: 0.5,
    },
    {
      url: "https://www.kolumbus.app/legal/terms",
      lastModified: "2023-12-05",
      priority: 0.5,
    },
    //#endregion
    //#region Playground
    {
      url: "https://www.kolumbus.app/playground",
      lastModified: "2023-12-05",
      priority: 0.2,
    },
    {
      url: "https://www.kolumbus.app/playground/button",
      lastModified: "2023-12-05",
      priority: 0.2,
    },
    {
      url: "https://www.kolumbus.app/playground/color",
      lastModified: "2023-12-05",
      priority: 0.2,
    },
    {
      url: "https://www.kolumbus.app/playground/dropdown",
      lastModified: "2023-12-05",
      priority: 0.2,
    },
    //#endregion
    {
      url: "https://www.kolumbus.app/t/guest",
      lastModified: "2023-12-05",
      priority: 0.3,
    },
  ];
}
