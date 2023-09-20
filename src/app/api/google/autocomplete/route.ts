import { NextRequest } from "next/server";
import { generateErrorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { input, language, sessionToken } = await req.json();

    if (!input || !language || !sessionToken)
      return new Response("Missing input, language, or session token in request", { status: 400 });
    if (input?.length < 3) return new Response("Input value must be at least 3 characters.", { status: 400 });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&radius=5000&language=${language}&sessiontoken=${sessionToken}&key=${
        process.env.NEXT_PUBLIC_GOOGLE_KEY
      }`
    );

    console.log(response);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return generateErrorResponse(error);
  }
}
