/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { months } from "./constants";
import { View } from "react-big-calendar";
import { startOfWeek, endOfWeek, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import LoadingComponent from "@/components/atoms/Loading/loading";
import { RefreshCcw } from "lucide-react";

interface ToolbarProps {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: any;
  refetch: any;
  isFetching?: boolean;
  dataUpdatedAt: number;
}

const Toolbar = ({
  view,
  setView,
  date,
  setDate,
  refetch,
  dataUpdatedAt,
  isFetching
}: ToolbarProps) => {
  const dateUpdated = new Date(dataUpdatedAt as number);

  const day = dateUpdated.getDate();
  const month = dateUpdated.getMonth() + 1;
  const year = dateUpdated.getFullYear();
  const hours = dateUpdated.getHours();
  const minutes = dateUpdated.getMinutes();
  const seconds = dateUpdated.getSeconds();

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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className=" flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary-amber md:text-3xl">
                {view === "day" && "DIÁRIO"}
                {view === "week" && "SEMANAL"}
                {view === "month" && "MENSAL"}
              </h1>
              <Image
                src="/dropdownIcon.svg"
                alt="icon"
                width={15}
                height={15}
              />{" "}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded bg-white" align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setView("month")}
            >
              Mensal
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary-amber" />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setView("week")}
            >
              Semanal
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary-amber" />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setView("day")}
            >
              Diário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden md:block">
          {view === "day" && <p>{date.toLocaleDateString()}</p>}
          {view === "week" && (
            <p>
              {`${format(
                startOfWeek(date, { weekStartsOn: 0 }),
                "dd/MM/yyyy"
              )} - ${format(
                endOfWeek(date, { weekStartsOn: 0 }),
                "dd/MM/yyyy"
              )}`}
            </p>
          )}
          {view === "month" && (
            <p>
              {months[date.getMonth()]} de {date.getFullYear()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-lg">
          <div
            className="flex cursor-pointer items-center gap-1 border-r pr-2"
            onClick={() =>
              setDate((prevDate: any) => {
                if (view === "month") {
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth() - 1
                  );
                } else if (view === "week") {
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                    prevDate.getDate() - 7
                  );
                } else if (view === "day") {
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                    prevDate.getDate() - 1
                  );
                } else {
                  return prevDate;
                }
              })
            }
          >
            {"<-"} <span className="hidden sm:block">Anterior</span>
          </div>
          <div className="cursor-pointer" onClick={() => setDate(new Date())}>
            Hoje
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 border-l pl-2"
            onClick={() =>
              setDate((prevDate: any) => {
                if (view === "month") {
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth() + 1
                  );
                } else if (view === "week") {
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                    prevDate.getDate() + 7
                  );
                } else if (view === "day") {
                  return new Date(
                    prevDate.getFullYear(),
                    prevDate.getMonth(),
                    prevDate.getDate() + 1
                  );
                } else {
                  return prevDate;
                }
              })
            }
          >
            <span className="hidden sm:block">Próximo</span> {"->"}
          </div>
        </div>
      </div>

      <div className="my-4 flex justify-center md:hidden">
        {view === "day" && <p>{date.toLocaleDateString()}</p>}
        {view === "week" && (
          <p>
            {`${format(
              startOfWeek(date, { weekStartsOn: 0 }),
              "dd/MM/yyyy"
            )} - ${format(endOfWeek(date, { weekStartsOn: 0 }), "dd/MM/yyyy")}`}
          </p>
        )}
        {view === "month" && (
          <p>
            {months[date.getMonth()]} de {date.getFullYear()}
          </p>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={refetch}
          className="rounded-xl border border-primary-amber p-1 text-xs sm:text-base"
        >
          {isFetching ? <LoadingComponent /> : <RefreshCcw strokeWidth={1.2} />}
        </button>
        <p className="self-center text-xs text-gray-500 sm:text-sm">
          Última atualização: {resultDate}
        </p>
      </div>
    </div>
  );
};

export default Toolbar;
