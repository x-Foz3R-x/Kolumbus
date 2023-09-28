import { NextRequest } from "next/server";
import { generateErrorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { value, language, sessionToken } = await req.json();
    console.log(value);
    console.log(language);
    console.log(sessionToken);

    if (!value || !language || !sessionToken)
      return new Response("Missing value, language, or session token in request", { status: 400 });
    if (value?.length < 3) return new Response("Input value must be at least 3 characters.", { status: 400 });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        value
      )}&radius=5000&language=${language}&sessiontoken=${sessionToken}&key=${
        process.env.NEXT_PUBLIC_GOOGLE_KEY
      }`
    );

    console.log(JSON.stringify(response));

    return new Response(JSON.stringify(response), { status: 403 });
  } catch (error) {
    return generateErrorResponse(error);
  }
}
