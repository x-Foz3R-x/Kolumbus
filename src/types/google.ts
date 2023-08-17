export interface Place {
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

export enum PlaceFieldsGroup {
  Basic = "address_components,adr_address,business_status,formatted_address,geometry,icon,icon_mask_base_uri,icon_background_color,name,photo,place_id,plus_code,type,url,utc_offset,vicinity,wheelchair_accessible_entrance",
  Contact = ",current_opening_hours,formatted_phone_number,international_phone_number,opening_hours,secondary_opening_hours,website",
  Atmosphere = ",curbside_pickup,delivery,dine_in,editorial_summary,price_level,rating,reservable,reviews,serves_beer,serves_breakfast,serves_brunch,serves_dinner,serves_lunch,serves_vegetarian_food,serves_wine,takeout,user_ratings_total",
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
