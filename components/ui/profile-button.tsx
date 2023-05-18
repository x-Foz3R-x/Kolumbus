"use client";

import Image from "next/image";

function ShowModule(e: any) {
  console.log(e);
}

export default function ProfileButton() {
  return (
    <>
      <button onClick={ShowModule} className="h-14 w-14 rounded-full p-3">
        <Image
          src="/default-avatar.png"
          alt="default avatar picture"
          width={32}
          height={32}
        />
      </button>
      <dialog>
        <button>settings</button>
        <button>change profile</button>
        <button>sign out</button>
      </dialog>
    </>
  );
}
