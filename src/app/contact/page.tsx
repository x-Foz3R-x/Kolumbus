"use client";

import Link from "next/link";
import Icon from "@/components/icons";
import { Button } from "@/components/ui";

export default function Contact() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <Link href="/">
        <Icon.logo className="h-8" />
      </Link>
      <h1 className="text-lg font-bold text-gray-600">Contact</h1>
      <p className="mb-2 text-gray-600">For questions or bug reports, reach out via email:</p>

      <span>
        <Link href="mailto:pawel@kolumbus.app" className="text-blue-500 mr-3 rounded-lg border px-5 py-3 text-lg hover:underline">
          pawel@kolumbus.app
        </Link>

        <Button
          onClick={() => navigator.clipboard.writeText("pawel@kolumbus.app")}
          variant="scale"
          size="icon"
          className="p-2.5 before:bg-gray-100 active:scale-95"
        >
          <Icon.copy className="h-4 w-4" />
        </Button>
      </span>
    </div>
  );
}
