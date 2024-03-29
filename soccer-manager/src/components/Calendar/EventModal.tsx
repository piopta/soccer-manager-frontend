import {
  Dialog,
  FormControl,
  Grid,
  FilledInput,
  InputLabel,
  SelectChangeEvent,
  Button,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { CalendarEvent, EventType } from "../../Types";
import { MdEvent, MdClear } from "react-icons/md";
import AppSelectField from "../AppSelectField";

interface IProps {
  calendarEventDetails: Partial<CalendarEvent>;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
  setCalendarEventDetails: React.Dispatch<
    React.SetStateAction<Partial<CalendarEvent>>
  >;
}

//Mapping inspired here: https://stackoverflow.com/questions/41308123/map-typescript-enum
const events = (Object.keys(EventType) as Array<keyof EventType>)
  .map((k: keyof EventType) => {
    return {
      value: k,
      desc: k,
    };
  })
  .filter((k) => k) as {
  value: string;
  desc: string;
}[];

function EventModal({
  isOpen,
  setOpen,
  calendarEventDetails,
  setCalendarEventDetails,
}: IProps) {
  const { year, month, day } = calendarEventDetails;
  const currentDate = new Date();

  const [eventDate, setEventDate] = useState<Date>(
    new Date(
      year ?? currentDate.getFullYear(),
      month ?? currentDate.getMonth(),
      day ?? currentDate.getDay()
    )
  );

  const handleDescriptionChange = (val: string) => {
    setCalendarEventDetails((prev) => {
      let newEventDetails = {
        ...prev,
      };

      newEventDetails.description = val;
      return newEventDetails;
    });
  };

  const handleEventTypeChange = (e: SelectChangeEvent<string>) => {
    setCalendarEventDetails((prev) => {
      let newEventDetails = {
        ...prev,
      };

      newEventDetails.eventType = e.target.value as EventType;
      return newEventDetails;
    });
  };

  const handleAddFirstStep = () => {
    const dateToStore = eventDate
      .toISOString()
      .split("T")[0]
      .split("-")
      .map((d) => parseInt(d));

    setCalendarEventDetails((prev) => ({
      ...prev,
      day: dateToStore[2],
      month: dateToStore[1],
      year: dateToStore[0],
    }));

    setOpen([false, true]);
  };

  const handleClearDateClick = () => {
    setEventDate(
      new Date(
        year ?? currentDate.getFullYear(),
        month ?? currentDate.getMonth(),
        day ?? currentDate.getDay()
      )
    );
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          setOpen((prev) => [false, prev[1]]);
        }}
      >
        <Grid
          container
          padding={"3rem"}
          flexDirection={"column"}
          rowGap={"1rem"}
        >
          <FormControl>
            <InputLabel htmlFor="event-desc">Description</InputLabel>
            <FilledInput
              type="text"
              id="event-desc"
              value={calendarEventDetails.description}
              disabled={calendarEventDetails.notEditable}
              onChange={(e) => {
                handleDescriptionChange(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <FilledInput
              type="date"
              id="event-date"
              value={eventDate.toISOString().split("T")[0]}
              onChange={(e) => {
                setEventDate(new Date(e.target.value));
              }}
              disabled={calendarEventDetails.notEditable}
            />
            <FormHelperText>
              Events only possible to add in the season
            </FormHelperText>
            <Button
              color="secondary"
              endIcon={<MdClear />}
              onClick={handleClearDateClick}
              disabled={calendarEventDetails.notEditable}
            >
              Clear date
            </Button>
          </FormControl>
          <AppSelectField
            elementName="event-type"
            label="Event type"
            value={calendarEventDetails.eventType ?? EventType.NONE}
            elements={events}
            handleChange={handleEventTypeChange}
            isNotEditable={calendarEventDetails.notEditable}
            notEditableValue={
              EventType[calendarEventDetails.eventType ?? EventType.NONE]
            }
          />
          {!calendarEventDetails.notEditable ? (
            <Button
              endIcon={<MdEvent />}
              variant="contained"
              onClick={handleAddFirstStep}
              disabled={
                !calendarEventDetails.description ||
                !calendarEventDetails.eventType ||
                calendarEventDetails.eventType === EventType.NONE
              }
            >
              Add
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      </Dialog>
    </>
  );
}

export default EventModal;
