import Icon from "@/assets/logo/icon.svg";

export default function ColorPallette(props: any) {
  const Pallette: any = [
    <div key={props.color} className="flex items-center justify-center p-1">
      {props.color}
    </div>,
  ];

  for (let i = 50; i <= 950; i += 100) {
    let fill = `bg-${props.color}-` + i;

    Pallette.push(
      <div
        key={props.color + i}
        className={
          "flex h-14 w-full items-center justify-center border-black " + fill
        }
      >
        <Icon className="h-8 fill-black" />
        <div className={"bg-blackAlpha-300 mx-14 rounded-lg p-1 text-white"}>
          PALETA {i}
        </div>
        <Icon className="h-8 fill-white" />
      </div>
    );

    if (i == 50) i = 0;
    if (i == 900) i = 850;
  }

  return Pallette;
}
