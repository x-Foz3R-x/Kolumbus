export const BASE_URL = process.env.NODE_ENV === "production" ? "https://www.kolumbus.app" : "http://localhost:3000";
export const LANGUAGE = global.navigator?.language.split("-")[0] || "en";
