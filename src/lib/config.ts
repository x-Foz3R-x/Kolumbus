export const BASE_URL = process.env.NODE_ENV === "production" ? "https://www.kolumbus.app" : "http://localhost:3000";
export const LANGUAGE = global.navigator?.language.split("-")[0] || "en";

export const AVATAR_FALLBACK = `/images/avatar-fallback.jpg`;
export const TRIP_IMG_FALLBACK = `/images/trip-fallback.jpg`;
export const EVENT_IMG_FALLBACK = `/images/event-fallback.jpg`;
