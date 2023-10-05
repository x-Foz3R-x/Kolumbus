import { z } from "zod";

export interface PlaceOld {
  address_components?: { long_name: string; short_name: string; types: string[] }[];
  adr_address?: string;
  business_status?: string;
  curbside_pickup?: boolean;
  current_opening_hours?: PlaceOpeningHours;
  delivery?: boolean;
  dine_in?: boolean;
  editorial_summary?: { language?: string; overview?: string };
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry?: Geometry;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  name?: string;
  opening_hours?: PlaceOpeningHours;
  photos?: PlacePhoto[];
  place_id?: string;
  plus_code?: { global_code: string; compound_code?: string };
  price_level?: number;
  rating?: number;
  reservable?: boolean;
  reviews?: PlaceReview[];
  secondary_opening_hours?: PlaceOpeningHours[];
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_wine?: boolean;
  takeout?: boolean;
  types?: string[];
  url?: string;
  user_ratings_total?: number;
  utc_offset?: number;
  vicinity?: string;
  website?: string;
  wheelchair_accessible_entrance?: boolean;
}

export interface Geometry {
  location: { lat: number; lng: number };
  viewport: { northeast: { lat: number; lng: number }; southwest: { lat: number; lng: number } };
}

export interface PlaceOpeningHours {
  open_now?: boolean;
  periods?: {
    open: { day: number; time: string; date?: string; truncated?: boolean };
    close?: { day: number; time: string; date?: string; truncated?: boolean };
  }[];
  special_days?: { date?: string; exceptional_hours?: boolean }[];
  type?: string;
  weekday_text?: string[];
}

export interface PlacePhoto {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface PlaceReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  time: number;
  author_url?: string;
  language?: string;
  original_language?: string;
  profile_photo_url?: string;
  text?: string;
  translated?: boolean;
}

export enum PlacesDetailsStatus {
  OK = "OK",
  ZERO_RESULTS = "ZERO_RESULTS",
  NOT_FOUND = "NOT_FOUND",
  INVALID_REQUEST = "INVALID_REQUEST",
  OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
  REQUEST_DENIED = "REQUEST_DENIED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum PlacesAutocompleteStatus {
  OK = "OK",
  ZERO_RESULTS = "ZERO_RESULTS",
  INVALID_REQUEST = "INVALID_REQUEST",
  OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
  REQUEST_DENIED = "REQUEST_DENIED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

//
//
//
// NEW
//
//
//

//#region Place Autocomplete
const PlaceAutocompleteMatchedSubstring = z.object({
  length: z.number(),
  offset: z.number(),
});

const PlaceAutocompleteStructuredFormat = z.object({
  main_text: z.string(),
  main_text_matched_substrings: z.array(PlaceAutocompleteMatchedSubstring),
  secondary_text: z.string().optional(),
  secondary_text_matched_substrings: z.array(PlaceAutocompleteMatchedSubstring).optional(),
});

const PlaceAutocompleteTerm = z.object({
  offset: z.number(),
  value: z.string(),
});

export type PlaceAutocompletePrediction = z.infer<typeof PlaceAutocompletePrediction>;
const PlaceAutocompletePrediction = z.object({
  description: z.string(),
  matched_substrings: z.array(PlaceAutocompleteMatchedSubstring),
  structured_formatting: PlaceAutocompleteStructuredFormat,
  terms: z.array(PlaceAutocompleteTerm),
  distance_meters: z.number().optional(),
  place_id: z.string().optional(),
  types: z.array(z.string()).optional(),
});

export const PlacesAutocompleteResponse = z.object({
  predictions: z.array(PlaceAutocompletePrediction),
  status: z.enum([
    "OK",
    "ZERO_RESULTS",
    "INVALID_REQUEST",
    "OVER_QUERY_LIMIT",
    "REQUEST_DENIED",
    "UNKNOWN_ERROR",
  ]),
  error_message: z.string().optional(),
  info_messages: z.array(z.string()).optional(),
});
//#endregion

//#region Place Details
export enum FieldsGroup {
  Basic = "address_components,adr_address,business_status,formatted_address,geometry,icon,icon_mask_base_uri,icon_background_color,name,photo,place_id,plus_code,type,url,utc_offset,vicinity,wheelchair_accessible_entrance",
  Contact = ",current_opening_hours,formatted_phone_number,international_phone_number,opening_hours,secondary_opening_hours,website",
  Atmosphere = ",curbside_pickup,delivery,dine_in,editorial_summary,price_level,rating,reservable,reviews,serves_beer,serves_breakfast,serves_brunch,serves_dinner,serves_lunch,serves_vegetarian_food,serves_wine,takeout,user_ratings_total",
}

export const AddressComponent = z.object({
  long_name: z.string(),
  short_name: z.string(),
  types: z.array(z.string()),
});

export const PlaceEditorialSummary = z.object({
  language: z.string().optional(),
  overview: z.string().optional(),
});

export const PlacePhoto = z.object({
  height: z.number(),
  html_attributions: z.array(z.string()),
  photo_reference: z.string(),
  width: z.number(),
});

const PlusCode = z.object({
  global_code: z.string(),
  compound_code: z.string().optional(),
});

export const PlaceReview = z.object({
  author_name: z.string(),
  rating: z.number(),
  relative_time_description: z.string(),
  time: z.number(),
  author_url: z.string().optional(),
  language: z.string().optional(),
  original_language: z.string().optional(),
  profile_photo_url: z.string().optional(),
  text: z.string().optional(),
  translated: z.boolean().optional(),
});

//#region PlaceOpeningHours
const PlaceOpeningHoursPeriodDetail = z.object({
  day: z.number(),
  time: z.string(),
  date: z.string().optional(),
  truncated: z.boolean().optional(),
});

const PlaceSpecialDay = z.object({
  date: z.string().optional(),
  exceptional_hours: z.boolean().optional(),
});

const PlaceOpeningHoursPeriod = z.object({
  open: PlaceOpeningHoursPeriodDetail,
  close: PlaceOpeningHoursPeriodDetail.optional(),
});

export const PlaceOpeningHours = z.object({
  open_now: z.boolean().optional(),
  periods: z.array(PlaceOpeningHoursPeriod).optional(),
  special_days: z.array(PlaceSpecialDay).optional(),
  type: z.string(),
  weekday_text: z.array(z.string()),
});
//#endregion

//#region Geometry
const LatLngLiteral = z.object({
  lat: z.number(),
  lng: z.number(),
});

const Bounds = z.object({
  northeast: LatLngLiteral,
  southwest: LatLngLiteral,
});

export const Geometry = z.object({
  location: LatLngLiteral,
  viewport: Bounds,
});
//#endregion

const Place = z.object({
  address_components: z.array(AddressComponent).optional(),
  adr_address: z.string().optional(),
  business_status: z.string().optional(),
  curbside_pickup: z.boolean().optional(),
  current_opening_hours: PlaceOpeningHours.optional(),
  delivery: z.boolean().optional(),
  dine_in: z.boolean().optional(),
  editorial_summary: PlaceEditorialSummary.optional(),
  formatted_address: z.string().optional(),
  formatted_phone_number: z.string().optional(),
  geometry: Geometry.optional(),
  icon: z.string().optional(),
  icon_background_color: z.string().optional(),
  icon_mask_base_uri: z.string().optional(),
  international_phone_number: z.string().optional(),
  name: z.string().optional(),
  opening_hours: PlaceOpeningHours.optional(),
  photos: z.array(PlacePhoto).optional(),
  place_id: z.string().optional(),
  plus_code: PlusCode.optional(),
  price_level: z.number().optional(),
  rating: z.number().optional(),
  reservable: z.boolean().optional(),
  reviews: z.array(PlaceReview).optional(),
  secondary_opening_hours: PlaceOpeningHours.optional(),
  serves_beer: z.boolean().optional(),
  serves_breakfast: z.boolean().optional(),
  serves_brunch: z.boolean().optional(),
  serves_dinner: z.boolean().optional(),
  serves_lunch: z.boolean().optional(),
  serves_vegetarian_food: z.boolean().optional(),
  serves_wine: z.boolean().optional(),
  takeout: z.boolean().optional(),
  types: z.array(z.string()).optional(),
  url: z.string().optional(),
  user_ratings_total: z.number().optional(),
  utc_offset: z.number().optional(),
  vicinity: z.string().optional(),
  website: z.string().optional(),
  wheelchair_accessible_entrance: z.boolean().optional(),
});

export const PlacesDetailsResponse = z.object({
  html_attributions: z.array(z.string()),
  result: Place,
  status: z.enum([
    "OK",
    "ZERO_RESULTS",
    "NOT_FOUND",
    "INVALID_REQUEST",
    "OVER_QUERY_LIMIT",
    "REQUEST_DENIED",
    "UNKNOWN_ERROR",
  ]),
  info_messages: z.array(z.string()).optional(),
});
//#endregion
