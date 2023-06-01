import Icon from "@/assets/kolumbus/icon.svg";

interface Props {
  value?: number;
  className: string;
}

export default function Color({ value, className }: Props) {
  return (
    <div
      className={
        "flex h-14 w-full items-center justify-center border-black " + className
      }
    >
      <Icon className="h-8 fill-black" />
      <div className={"mx-14 rounded-lg bg-black/30 p-1 text-white"}>
        PALETA {value}
      </div>
      <Icon className="h-8 fill-white" />
    </div>
  );
}
