import React from "react";
import { twMerge } from "tailwind-merge";
import { TitleProps } from "./types";

const Title = ({ children, className }: TitleProps) => {
  return (
    <h1
      className={twMerge(
        "mb-3 text-3xl font-bold text-primary-amber",
        className
      )}
    >
      {children}
    </h1>
  );
};

export default Title;
