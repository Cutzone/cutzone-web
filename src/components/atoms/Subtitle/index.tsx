import React from "react";
import { twMerge } from "tailwind-merge";
import { SubTitleProps } from "./types";

const Subtitle = ({ children, className }: SubTitleProps) => {
  return (
    <h2 className={twMerge("text-xl font-bold", className)}>{children}</h2>
  );
};

export default Subtitle;
