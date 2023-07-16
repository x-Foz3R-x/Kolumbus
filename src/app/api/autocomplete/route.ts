import { NextRequest } from "next/server";
import axios from "axios";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const { inputValue } = await req.json();

  if (inputValue.length > 2) {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          inputValue
        )}&radius=500&key=${process.env.GOOGLE_KEY}`
      );

      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.log(error);

      if (error instanceof z.ZodError) {
        return new Response(error.message, { status: 422 });
      }

      if (error instanceof Error) {
        return new Response(error.message, { status: 500 });
      }

      return new Response("Something went wrong", { status: 500 });
    }
  } else {
    return new Response(
      "Invalid input length. Please provide a value with at least 3 characters.",
      { status: 400 }
    );
  }
}
