import Icon from "@/components/icons";
import { Divider } from "@/components/ui";
import Link from "next/link";

export default function Contact() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <Link href="/">
        <Icon.logo className="h-8" />
      </Link>
      <h1 className="text-lg font-bold text-gray-600">Contact</h1>
      <p>E-mail: pawel@kolumbus.app</p>
    </div>
  );
}
