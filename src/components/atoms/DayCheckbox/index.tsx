import React from "react";
import { DayCheckboxProps } from "./types";

const DayCheckbox = ({
  name,
  label,
  days,
  position,
  setDays
}: DayCheckboxProps) => {
  return (
    <div>
      <label htmlFor={name}>
        <div
          className={`flex w-16 cursor-pointer items-center justify-center rounded-full border-[1px] border-black px-2 py-1 text-sm ${
            days[position] ? "bg-primary-amber" : ""
          }`}
        >
          {label}
        </div>
      </label>
      <input
        type="checkbox"
        id={name}
        className="hidden"
        checked={days[position]}
        onChange={() =>
          setDays(days.map((day, index) => (index === position ? !day : day)))
        }
      />
    </div>
  );
};

export default DayCheckbox;
