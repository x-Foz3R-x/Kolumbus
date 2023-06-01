import Main from "../components/Main";
import ActionBar from "./components/ActionBar";

import Calendar from "./components/calendar/Calendar";
import CalendarWeather from "./components/calendar/CalendarWeather";
import CalendarEnd from "./components/calendar/CalendarEnd";

export default function Itinerary() {
  const tripData = [
    {
      name: "stężyca",
      metadata: {
        startDate: "09-06-2023",
        endDate: "13-06-2023",
        createdAt: "",
      },
      itinerary: {},
    },
  ];

  return (
    <Main>
      <ActionBar />
      <div className="mt-8 flex px-4">
        <section className="flex flex-col gap-10">
          <section className="h-fit w-fit rounded-xl shadow-default">
            <CalendarWeather tripDay={1} dayOfWeek={3} dayOfMonth={8} />
            <CalendarWeather tripDay={2} dayOfWeek={4} dayOfMonth={9} />
            <Calendar tripDay={3} dayOfWeek={5} dayOfMonth={10} />
            <Calendar tripDay={4} dayOfWeek={6} dayOfMonth={11} />
            <Calendar tripDay={5} dayOfWeek={0} dayOfMonth={12} />
            <Calendar tripDay={6} dayOfWeek={1} dayOfMonth={13} />
            <Calendar tripDay={7} dayOfWeek={2} dayOfMonth={14} />
            <CalendarEnd totalDays={7} />
          </section>

          <section className="h-fit w-fit rounded-xl shadow-kolumblue">
            <Calendar tripDay={3} dayOfWeek={5} dayOfMonth={10} />
            <Calendar tripDay={4} dayOfWeek={6} dayOfMonth={11} />
            <Calendar tripDay={5} dayOfWeek={0} dayOfMonth={12} />
            <Calendar tripDay={6} dayOfWeek={1} dayOfMonth={13} />
            <CalendarEnd totalDays={7} />
          </section>
        </section>

        <section>
          <div className="">itinerary!!</div>
        </section>
      </div>
    </Main>
  );
}
