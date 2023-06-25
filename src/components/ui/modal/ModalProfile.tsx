import Image from "next/image";

interface Props {
  username: string;
  email: string;
}

export default function ModalProfile({ username, email }: Props) {
  return (
    <div className="flex w-full select-none flex-col items-center gap-1 p-3 pb-1">
      <Image
        src="/images/default-avatar.png"
        alt="default avatar picture"
        width={64}
        height={64}
        draggable={false}
        className="rounded-xl"
      />
      <div className="flex w-48 flex-none select-text flex-col justify-around text-center">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {username}
        </span>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {email}
        </span>
      </div>
    </div>
  );
}
