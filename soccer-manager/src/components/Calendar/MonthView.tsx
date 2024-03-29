import Enumerable from "linq";
import { Grid } from "@mui/material";
import DayView from "./DayView";
import { CalendarEvent } from "../../Types";

interface IProps {
  calendar: CalendarEvent[];
  year: number;
  month: number;
}

function MonthView({ calendar, year, month }: IProps) {
  const daysInMonth = new Date(year, month - 1, 0).getDate();
  const todaysDay = new Date().getDate();
  const todaysMonth = parseInt(new Date().toISOString().split("-")[1]) + 1;

  return (
    <Grid
      container
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {Enumerable.range(1, daysInMonth)
        .toArray()
        .map((d) => (
          <DayView
            key={d}
            day={d}
            event={calendar.find((c) => c.day === d)}
            isCurrent={d === todaysDay && month === todaysMonth}
          />
        ))}
    </Grid>
  );
}

export default MonthView;
