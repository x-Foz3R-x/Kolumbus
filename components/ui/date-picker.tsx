"use client";

import React, { useState } from "react";
import Calendar from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate]: [Date | null, any] = useState(null);
  const onChange = (dates: [Date, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Calendar
      selected={startDate}
      onChange={onChange([startDate, endDate])}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      inline
    />
  );
}
