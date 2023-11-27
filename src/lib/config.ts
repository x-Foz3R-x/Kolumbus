export const BASE_URL = process.env.NODE_ENV === "production" ? "https://www.kolumbus.app" : "http://localhost:3000";

// The language of the user's browser. We use this to determine the default language of the app.
export const LANGUAGE = global.navigator.language.split("-")[0];
