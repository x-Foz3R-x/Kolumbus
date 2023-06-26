import Calendar from "./Calendar";
import CalendarEnd from "./CalendarEnd";

export default function RenderCalendarSection(
  userTripsInfo: [],
  selectedTrip: number
) {
  const calendar = [];

  const startDate = new Date(userTripsInfo[selectedTrip]["start_date"]);
  let currentDate = new Date(startDate);

  for (let i = 0; i < userTripsInfo[selectedTrip]["days"]; i++) {
    calendar.push(
      <Calendar
        key={"calendar " + i}
        tripDay={1 + i}
        date={new Date(currentDate.setDate(startDate.getDate() + i))}
      />
    );
  }

  return (
    <section className="h-fit w-fit rounded-xl shadow-kolumblue">
      {calendar}
      <CalendarEnd totalDays={userTripsInfo[selectedTrip]["days"]} />
    </section>
  );
}
