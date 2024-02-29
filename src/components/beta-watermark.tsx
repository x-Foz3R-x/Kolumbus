export default function BetaWatermark() {
  return (
    <div className="absolute bottom-5 right-5 z-50 rounded-full bg-orange-300/60 p-3 text-center font-inter text-[10px] font-semibold leading-tight text-orange-700 backdrop-blur-sm">
      <span className="absolute inset-0 -z-10 rounded-full bg-orange-400 blur" />
      <p>Beta 0.2.0</p>
      <p>Work in Progress</p>
    </div>
  );
}
