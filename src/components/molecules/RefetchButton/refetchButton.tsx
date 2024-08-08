import { RotateCw } from "lucide-react";
import { twMerge } from "tailwind-merge";

import Button from "@atoms/Button/button";

import { RefetchButtonProps } from "./types";

const RefetchButton = ({
  isLoading,
  onRefetch,
  dataUpdatedAt,
  className
}: RefetchButtonProps) => {
  const date = new Date(dataUpdatedAt as number);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    year;
  const formattedHour =
    (hours < 10 ? "0" : "") +
    hours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;

  const resultDate =
    formattedDate + ` ${minutes === 0 ? "as" : "às"} ` + formattedHour;

  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      <Button onClick={onRefetch} className="px-3 py-2">
        {isLoading ? (
          <RotateCw className="animate-spin" size={20} />
        ) : (
          <RotateCw size={20} />
        )}
      </Button>
      <p className="hidden self-center text-sm text-gray-500 md:block">
        Última atualização: {resultDate}
      </p>
    </div>
  );
};

export default RefetchButton;
