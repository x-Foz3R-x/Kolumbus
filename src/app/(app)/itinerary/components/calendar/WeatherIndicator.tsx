export default function WeatherIndicator() {
  return (
    <div className="mt-1 flex w-full items-center gap-1 text-xs">
      <span>11°</span>
      <div className="h-1 w-full rounded-full bg-yellow-400 px-1"></div>
      <span>15°</span>
    </div>
  );
}
