export default function BetaWatermark() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] rounded-full bg-orange-300/60 p-3 text-center font-inter text-xs font-semibold text-orange-700 backdrop-blur-sm">
      <span className="absolute inset-0 -z-10 rounded-full bg-orange-400 blur" />
      <p>Open Beta</p>
      <p>Work in Progress</p>
    </div>
  );
}
