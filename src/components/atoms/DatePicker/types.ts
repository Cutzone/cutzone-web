import { Dispatch, SetStateAction } from "react";
import { SelectSingleEventHandler } from "react-day-picker";

export interface DatePickerProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
}
