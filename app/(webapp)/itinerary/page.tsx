import ActionBar from "./action-bar";
import DatePicker from "@/components/ui/date-picker";

export default function Itinerary() {
  return (
    <main className="h-[calc(100vh-3.5rem)] w-full bg-gray-50 px-4">
      <ActionBar />
      <h1>itinerary!!</h1>
      <DatePicker />
    </main>
  );
}
