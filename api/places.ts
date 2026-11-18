import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";

import { PlacesAutocompleteResponse, PlacesDetailsResponse } from "../src/lib/validations/google";

const querySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("autocomplete"),
    input: z.string().trim().min(1).max(200),
    sessionToken: z.string().min(1).max(128),
  }),
  z.object({
    action: z.literal("details"),
    placeId: z.string().min(1).max(256),
    sessionToken: z.string().min(1).max(128),
  }),
  z.object({
    action: z.literal("photo"),
    placeId: z.string().min(1).max(256),
  }),
  z.object({
    action: z.literal("image"),
    reference: z.string().min(1).max(2000),
  }),
]);

export async function handlePlacesRequest(request: Request) {
  const headers = { "Cache-Control": "no-store" };

  if (request.method !== "GET") {
    return new Response(null, { status: 405, headers: { ...headers, Allow: "GET" } });
  }

  const query = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!query.success) {
    return new Response(null, { status: 400, headers });
  }

  const key = process.env.GOOGLE_KEY;
  if (!key) {
    return new Response(null, { status: 503, headers });
  }

  const { data } = query;
  const params = new URLSearchParams({ key });
  let endpoint = "details/json";

  switch (data.action) {
    case "autocomplete":
      endpoint = "autocomplete/json";
      params.set("input", data.input);
      params.set("sessiontoken", data.sessionToken);
      break;
    case "details":
      params.set("place_id", data.placeId);
      params.set("fields", "name,formatted_address,international_phone_number,website,photo");
      params.set("sessiontoken", data.sessionToken);
      break;
    case "photo":
      params.set("place_id", data.placeId);
      params.set("fields", "photo");
      break;
    case "image":
      endpoint = "photo";
      params.set("photo_reference", data.reference);
      params.set("maxwidth", "624");
      break;
  }

  try {
    const result = await fetch(
      `https://maps.googleapis.com/maps/api/place/${endpoint}?${params.toString()}`,
      {
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!result.ok) {
      return new Response(null, { status: 502, headers });
    }

    if (data.action === "image") {
      const contentType = result.headers.get("Content-Type") ?? "";
      if (!contentType.startsWith("image/")) {
        return new Response(null, { status: 502, headers });
      }
      return new Response(result.body, { headers: { ...headers, "Content-Type": contentType } });
    }

    const body: unknown = await result.json();
    const parsed =
      data.action === "autocomplete"
        ? PlacesAutocompleteResponse.parse(body)
        : PlacesDetailsResponse.parse(body);

    return Response.json(parsed, { headers });
  } catch {
    return new Response(null, { status: 502, headers });
  }
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const result = await handlePlacesRequest(
    new Request(new URL(request.url ?? "/", "http://localhost"), { method: request.method }),
  );
  response.writeHead(result.status, Object.fromEntries(result.headers));
  response.end(Buffer.from(await result.arrayBuffer()));
}
