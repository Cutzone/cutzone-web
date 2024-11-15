import { Dispatch, SetStateAction } from "react";

export interface DatePickerProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
}
