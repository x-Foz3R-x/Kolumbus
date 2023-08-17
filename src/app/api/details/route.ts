import { NextRequest } from "next/server";
import axios from "axios";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { place_id, fields, language, sessionToken } = await req.json();

    if (!place_id || !fields || !language || !sessionToken) {
      return new Response("Missing place_id, fields, language, or session token in request", { status: 400 });
    }

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${fields}&language=${language}&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}&sessiontoken=${sessionToken}`
    );

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Something went wrong", { status: 500 });
  }
}
