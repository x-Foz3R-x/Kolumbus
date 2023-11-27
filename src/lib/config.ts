export const BASE_URL = process.env.NODE_ENV === "production" ? "https://www.kolumbus.app" : "http://localhost:3000";
export const LANGUAGE = !(typeof window !== "undefined" && window.document && window.document.createElement)
  ? navigator.language.split("-")[0]
  : "en";
