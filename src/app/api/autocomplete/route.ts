import { NextRequest } from "next/server";
import axios from "axios";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { input, language, sessionToken } = await req.json();

    if (!input || !language || !sessionToken)
      return new Response("Missing input, language, or session token in request", { status: 400 });
    if (input?.length < 3) return new Response("Input value must be at least 3 characters.", { status: 400 });

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&radius=5000&language=${language}&sessiontoken=${sessionToken}&key=${
        process.env.NEXT_PUBLIC_GOOGLE_KEY
      }`
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
