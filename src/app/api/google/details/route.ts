import { NextRequest } from "next/server";
import { generateErrorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { place_id, fields, language, sessionToken } = await req.json();

    if (!place_id || !fields || !language || !sessionToken) {
      return new Response("Missing place_id, fields, language, or session token in request", { status: 400 });
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${fields}&language=${language}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}&sessiontoken=${sessionToken}`
    );

    console.log(response);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return generateErrorResponse(error);
  }
}
