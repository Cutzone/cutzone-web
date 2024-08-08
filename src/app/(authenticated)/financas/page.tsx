"use client";

import { Separator } from "@/components/ui/separator";
import InfoCard from "./InfoCard";
import { DataTable } from "@/components/ui/dataTable";
import { columns } from "./columns";
import { pending } from "./pending";
import { Progress, ConfigProvider } from "antd";
import Image from "next/image";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { storageGet } from "@/store/services/storage";
import useAllAppointments from "@/hooks/queries/useAllAppointments";
import {
  isThisMonth,
  format,
  isThisYear,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameYear
} from "date-fns";
import { timestampToDate } from "@/utils/timestampToDate";
import { Timestamp } from "@/common/entities/timestamp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import FilterButton from "@/components/atoms/FilterButton";
import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import useAllConfigs from "@/hooks/queries/useAllConfigs";
import Payments from "./payments";

function Financas() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];
  const { data: barbershop } = useBarberShop(storageGet("uid") as string);
  const { data: configs } = useAllConfigs();

  const [tableFilter, setTableFilter] = useState("all");
  const [viewType, setViewType] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const now = new Date();
  const { data: appointments, isLoading: isLoadingAppointments } =
    useAllAppointments(storageGet("uid") as string);

  const currYearAppointments = useMemo(() => {
    return appointments?.filter((item) => {
      return (
        timestampToDate(item.startTime as Timestamp)
          .getFullYear()
          .toString() === selectedYear
      );
    });
  }, [appointments, selectedYear]);

  const lastYearAppointments = useMemo(() => {
    return appointments?.filter((item) => {
      return isSameYear(
        timestampToDate(item.startTime as Timestamp),
        new Date(
          months.indexOf(selectedMonth) + " 1, " + (Number(selectedYear) - 1)
        )
      );
    });
  }, [appointments, months, selectedMonth, selectedYear]);

  const currMonthAppointments = useMemo(() => {
    return appointments?.filter((item) => {
      const appointmentDate = timestampToDate(item.startTime as Timestamp);
      const appointmentYear = appointmentDate.getFullYear().toString();
      const appointmentMonth = appointmentDate.toLocaleString("pt-BR", {
        month: "long"
      });
      return (
        appointmentMonth === selectedMonth && appointmentYear === selectedYear
      );
    });
  }, [appointments, selectedMonth, selectedYear]);

  const lastMonthAppointments = useMemo(() => {
    return appointments?.filter((item) => {
      return isSameMonth(
        timestampToDate(item.startTime as Timestamp),
        new Date(months.indexOf(selectedMonth) + " 1, " + selectedYear)
      );
    });
  }, [appointments, months, selectedMonth, selectedYear]);

  const appointmentsCount = useMemo(
    () => ({
      total: 0,
      concluded: 0,
      canceled: 0,
      scheduled: 0,
      didNotShow: 0
    }),
    []
  );

  const currYearAppointmentsCount = useMemo(
    () => ({
      total: 0,
      concluded: 0,
      canceled: 0,
      scheduled: 0,
      didNotShow: 0
    }),
    []
  );

  const currMonthAppointmentsCount = useMemo(
    () => ({
      total: 0,
      concluded: 0,
      canceled: 0,
      scheduled: 0,
      didNotShow: 0
    }),
    []
  );

  useMemo(() => {
    appointments?.forEach((item) => {
      appointmentsCount.total++;

      if (isThisMonth(timestampToDate(item.startTime as Timestamp))) {
        currMonthAppointmentsCount.total++;
      }

      if (isThisYear(timestampToDate(item.startTime as Timestamp))) {
        currYearAppointmentsCount.total++;
      }

      if (item.status === "concluded") {
        appointmentsCount.concluded++;

        if (isThisMonth(timestampToDate(item.startTime as Timestamp))) {
          currMonthAppointmentsCount.concluded++;
        }
        if (isThisYear(timestampToDate(item.startTime as Timestamp))) {
          currYearAppointmentsCount.concluded++;
        }
      } else if (item.status === "canceled") {
        appointmentsCount.canceled++;

        if (isThisMonth(timestampToDate(item.startTime as Timestamp))) {
          currMonthAppointmentsCount.canceled++;
        }
        if (isThisYear(timestampToDate(item.startTime as Timestamp))) {
          currYearAppointmentsCount.canceled++;
        }
      } else if (item.status === "scheduled") {
        appointmentsCount.scheduled++;

        if (isThisMonth(timestampToDate(item.startTime as Timestamp))) {
          currMonthAppointmentsCount.scheduled++;
        }
        if (isThisYear(timestampToDate(item.startTime as Timestamp))) {
          currYearAppointmentsCount.scheduled++;
        }
      } else {
        appointmentsCount.didNotShow++;

        if (isThisMonth(timestampToDate(item.startTime as Timestamp))) {
          currMonthAppointmentsCount.didNotShow++;
        }
        if (isThisYear(timestampToDate(item.startTime as Timestamp))) {
          currYearAppointmentsCount.didNotShow++;
        }
      }
    });
  }, [
    currMonthAppointmentsCount,
    appointmentsCount,
    appointments,
    currYearAppointmentsCount
  ]);

  const filters = [
    {
      value: "all",
      text: "Todos",
      quantity:
        viewType === "year"
          ? currYearAppointmentsCount.total
          : currMonthAppointmentsCount.total
    },
    {
      value: "concluded",
      text: "Concluídos",
      quantity:
        viewType === "year"
          ? currYearAppointmentsCount.concluded
          : currMonthAppointmentsCount.concluded
    },
    {
      value: "canceled",
      text: "Cancelados",
      quantity:
        viewType === "year"
          ? currYearAppointmentsCount.canceled
          : currMonthAppointmentsCount.canceled
    },
    {
      value: "scheduled",
      text: "Agendados",
      quantity:
        viewType === "year"
          ? currYearAppointmentsCount.scheduled
          : currMonthAppointmentsCount.scheduled
    },
    {
      value: "didNotShow",
      text: "Não compareceu",
      quantity:
        viewType === "year"
          ? currYearAppointmentsCount.didNotShow
          : currMonthAppointmentsCount.didNotShow
    }
  ];

  const pendingData = appointments?.filter(
    (item) => item.status === "scheduled"
  );

  const getCategorySums = (appointments: AppoitmentCompanyEntity[]) => {
    const categorySums: { [key: string]: number } = {};

    appointments.forEach((appointment) => {
      const categories = appointment.service?.category;

      if (categories) {
        categories.forEach((category) => {
          if (!categorySums[category]) {
            categorySums[category] = 0;
          }
          categorySums[category]++;
        });
      }
    });

    if (configs && barbershop) {
      configs.forEach((config) => {
        if (barbershop.tier?.toString() === config.id) {
          for (const [key] of Object.entries(categorySums)) {
            switch (key) {
              case "barba":
                categorySums[key] *= config.barba;
                break;
              case "corte":
                categorySums[key] *= config.corte;
                break;
              case "sobrancelha":
                categorySums[key] *= config.sobrancelha;
                break;
            }
          }
        }
      });
    }

    return categorySums;
  };

  const filteredPending = Object.entries(
    pendingData ? getCategorySums(pendingData) : [[], {}]
  ).map(([category, value]) => ({
    category,
    value
  }));

  const filteredData =
    viewType === "year"
      ? currYearAppointments?.filter((item) => {
          if (tableFilter === "all") {
            return true;
          }

          return item.status === tableFilter;
        })
      : currMonthAppointments?.filter((item) => {
          if (tableFilter === "all") {
            return true;
          }

          return item.status === tableFilter;
        });

  const clientCount = useMemo(() => {
    const clientIds =
      viewType === "year"
        ? currYearAppointments?.map((appointment) => appointment.idClient)
        : currMonthAppointments?.map((appointment) => appointment.idClient);

    return viewType === "year"
      ? currYearAppointments?.filter((item, index) => {
          return clientIds?.indexOf(item.idClient) === index;
        }).length
      : currMonthAppointments?.filter((item, index) => {
          return clientIds?.indexOf(item.idClient) === index;
        }).length;
  }, [currYearAppointments, currMonthAppointments, viewType]);

  const clientCountLast = useMemo(() => {
    const clientIds =
      viewType === "year"
        ? lastYearAppointments?.map((appointment) => appointment.idClient)
        : lastMonthAppointments?.map((appointment) => appointment.idClient);

    return viewType === "year"
      ? lastYearAppointments?.filter((item, index) => {
          return clientIds?.indexOf(item.idClient) === index;
        }).length
      : lastMonthAppointments?.filter((item, index) => {
          return clientIds?.indexOf(item.idClient) === index;
        }).length;
  }, [lastYearAppointments, lastMonthAppointments, viewType]);

  const services = useMemo(() => {
    const serviceCounts: { [key: string]: number } = {};

    const currentDate = new Date();

    viewType === "year"
      ? currYearAppointments?.forEach((appointment) => {
          const appointmentDate = timestampToDate(
            appointment.startTime as Timestamp
          );

          const serviceName = appointment.service?.name;
          if (serviceName) {
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
          }
        })
      : currMonthAppointments?.forEach((appointment) => {
          const appointmentDate = timestampToDate(
            appointment.startTime as Timestamp
          );

          const serviceName = appointment.service?.name;
          if (serviceName) {
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
          }
        });

    const serviceRanking = Object.entries(serviceCounts).map(
      ([service, count]) => ({
        service,
        count
      })
    );

    serviceRanking.sort((a, b) => b.count - a.count);

    return serviceRanking;
  }, [currYearAppointments, currMonthAppointments, viewType]);

  const route = useRouter();
  const { data, isLoading } = useBarberShop(storageGet("uid") as string);

  useEffect(() => {
    if (data?.flags?.includes(false) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [data, route]);

  const calculatePercentage = (canceled: any, total: any): number | string => {
    if (
      typeof canceled === "number" &&
      typeof total === "number" &&
      total !== 0
    ) {
      return ((canceled / total) * 100).toFixed(0);
    }
    return 0;
  };

  if (isLoading || isLoadingAppointments) {
    return <p>Carregando...</p>;
  }

  const generateMonthOptions = () => {
    return months.map((month, index) => (
      <option key={index} value={month}>
        {month.charAt(0).toUpperCase() + month.slice(1)}
      </option>
    ));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years.map((year, index) => (
      <option key={index} value={year}>
        {year}
      </option>
    ));
  };

  return (
    <div>
      <div>
        <div className="mb-2 flex items-center gap-4">
          <h1 className="text-3xl font-bold">Relatório</h1>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className=" flex items-center gap-2">
                <h1 className="text-xl font-bold text-primary-amber sm:text-3xl">
                  {viewType === "year" && "ANUAL"}
                  {viewType === "month" && "MENSAL"}
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
                onClick={() => setViewType("month")}
              >
                Mensal
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary-amber" />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setViewType("year")}
              >
                Anual
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {viewType === "month" && (
            <div className="flex cursor-pointer items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {generateMonthOptions()}
              </select>
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {generateYearOptions()}
              </select>
            </div>
          )}
          {viewType === "year" && (
            <div>
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {generateYearOptions()}
              </select>
            </div>
          )}
        </div>
        <p>
          Aqui encontramos os relatórios mensais e anuais referentes aos tipos
          de
          <br /> serviços prestados pela barbearia e seu status: concluídos,
          agendados e cancelados.
        </p>
        <Separator className="mb-6 mt-4 bg-primary-light-gray" />
      </div>

      <h2 className="mb-8 font-bold ">Visão Geral da sua empresa</h2>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6 lg:col-span-5">
          <div className="mb-6 grid gap-5 md:grid-cols-2 lg:mb-10 2xl:grid-cols-4">
            <InfoCard
              bgColor="bg-secondary-amber"
              title={`N° de clientes/${viewType === "year" ? "ano" : "mês"}`}
              titleClassName="text-primary-amber"
            >
              <div className="flex items-center gap-8">
                <div className="relative mt-3">
                  <Image
                    src="/lineChart.svg"
                    width={70}
                    height={70}
                    alt="chart"
                  />
                  <div className="absolute bottom-[-16px] right-0 text-2xl font-bold text-primary-amber">
                    +{" "}
                    {(clientCount || 0) > (clientCountLast || 0)
                      ? (clientCount || 0) - (clientCountLast || 0)
                      : 0}
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-xl font-bold text-primary-amber md:text-2xl">
                    Clientes/ <br /> {viewType === "year" ? "ano" : "mês"}
                  </p>
                </div>
              </div>
            </InfoCard>
            <InfoCard bgColor="bg-primary-amber" title="Total N° de clientes">
              <div className="flex items-center gap-8">
                <div className="mt-5 flex items-center gap-2">
                  <Image src="/face.svg" width={40} height={40} alt="chart" />
                  <p className="text-3xl font-bold text-secondary-amber">
                    {(clientCount || 10) < 10 ? "0" : ""}
                    {clientCount}
                  </p>
                </div>
                <div>
                  <p className="mt-5 text-xl font-bold text-white md:text-2xl">
                    Clientes/ <br /> total
                  </p>
                </div>
              </div>
            </InfoCard>
            <InfoCard
              bgColor="bg-[#2AC511]"
              title={`% de Serviços/${viewType === "year" ? "ano" : "mês"}`}
            >
              <div className="flex gap-3">
                <ConfigProvider
                  theme={{
                    components: {
                      Progress: {
                        circleTextColor: "#FFF",
                        circleTextFontSize: "32px"
                      }
                    },
                    token: {
                      colorSuccess: "#FFF"
                    }
                  }}
                >
                  <Progress
                    type="circle"
                    percent={
                      viewType === "year"
                        ? (calculatePercentage(
                            currYearAppointmentsCount.concluded,
                            currYearAppointmentsCount.total
                          ) as number)
                        : (calculatePercentage(
                            currMonthAppointmentsCount.concluded,
                            currMonthAppointmentsCount.total
                          ) as number)
                    }
                    strokeColor="#FFF"
                    format={(percent) =>
                      percent === 100 ? "100%" : `${percent}%`
                    }
                  />
                </ConfigProvider>
                <div className="mt-2">
                  <p className="mb-4 text-xl font-bold text-white md:text-2xl 2xl:text-sm">
                    Servicos realizados
                  </p>
                  <p className="text-sm text-white">
                    /{viewType === "year" ? selectedYear : selectedMonth}
                  </p>
                </div>
              </div>
            </InfoCard>
            <InfoCard
              bgColor="bg-[#E01515]"
              title={`% de Serviços/${viewType === "year" ? "ano" : "mês"}`}
            >
              <div className="flex gap-3">
                <ConfigProvider
                  theme={{
                    components: {
                      Progress: {
                        circleTextColor: "#FFF",
                        circleTextFontSize: "32px"
                      }
                    },
                    token: {
                      colorSuccess: "#FFF"
                    }
                  }}
                >
                  <Progress
                    type="circle"
                    percent={
                      viewType === "year"
                        ? (calculatePercentage(
                            currYearAppointmentsCount.canceled,
                            currYearAppointmentsCount.total
                          ) as number)
                        : (calculatePercentage(
                            currMonthAppointmentsCount.canceled,
                            currMonthAppointmentsCount.total
                          ) as number)
                    }
                    strokeColor="#FFF"
                    format={(percent) =>
                      percent === 100 ? "100%" : `${percent}%`
                    }
                  />
                </ConfigProvider>
                <div className="mt-2">
                  <p className="mb-4 text-xl font-bold text-white md:text-2xl 2xl:text-sm">
                    Servicos Cancelados
                  </p>
                  <p className="text-sm text-white">
                    /{viewType === "year" ? selectedYear : selectedMonth}
                  </p>
                </div>
              </div>
            </InfoCard>
          </div>

          <Payments
            appointments={
              appointments?.filter(
                (appointment) =>
                  appointment.status === "concluded" ||
                  appointment.status === "didNotShow"
              ) || []
            }
          />

          <div className="mb-6 block rounded-xl border border-primary-light-gray px-4 lg:hidden">
            <div className="my-4 mb-1 flex flex-col">
              <h3 className="text-xs font-bold sm:text-base">
                Serviços mais realizados no{" "}
                {viewType === "year" ? "ano" : "mês"}
              </h3>
              <p className="mb-2 text-xs text-primary-light-gray">
                {viewType === "year" ? (
                  <span className="text-primary-amber">{selectedYear}</span>
                ) : (
                  <>
                    <span className="text-primary-amber">
                      {format(startOfMonth(now), "dd")}
                    </span>{" "}
                    {selectedMonth} -{" "}
                    <span className="text-primary-amber">
                      {format(endOfMonth(now), "dd")}
                    </span>{" "}
                    {selectedMonth}
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-4 overflow-x-scroll">
              {services.map((service, index) => {
                return (
                  <div
                    className="mb-2 rounded border-[1px] border-primary-light-gray px-2 py-1 text-sm"
                    key={index}
                  >
                    <h4 className="mb-1 font-bold">
                      {index + 1}. {service.service}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-primary-light-gray">Total</p>
                      <p className="text-primary-amber">{service.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-1 flex h-11 items-start gap-2 overflow-x-auto overflow-y-hidden text-sm md:gap-[72px]">
            {filters.map((item) => {
              return (
                <FilterButton
                  key={item.value}
                  value={item.value}
                  quantity={item.quantity}
                  curValue={tableFilter}
                  setFilter={setTableFilter}
                >
                  {item.text}
                </FilterButton>
              );
            })}
          </div>
          <div>
            <div>
              <h3 className="mb-3 mt-7 text-xl font-bold">
                {viewType === "year"
                  ? `${selectedYear} (Relatório/ano)`
                  : `${selectedMonth} de ${selectedYear} (Relatório/mês)`}
              </h3>
            </div>
            <DataTable columns={columns} data={filteredData || []} />
          </div>
        </div>

        <div className="col-span-1 hidden rounded-xl border border-primary-light-gray p-4 lg:block">
          <div className="mb-2">
            <h3 className="font-bold">
              Serviços mais
              <br /> realizados no {viewType === "year" ? "ano" : "mês"}
            </h3>
            <p className="my-4 text-xs text-primary-light-gray">
              {viewType === "year" ? (
                <span className="text-primary-amber">{selectedYear}</span>
              ) : (
                <>
                  <span className="text-primary-amber">
                    {format(startOfMonth(now), "dd")}
                  </span>{" "}
                  {selectedMonth} -{" "}
                  <span className="text-primary-amber">
                    {format(endOfMonth(now), "dd")}
                  </span>{" "}
                  {selectedMonth}
                </>
              )}
            </p>
          </div>
          <div>
            {services.map((service, index) => {
              return (
                <div
                  className="mb-2 rounded border-[1px] border-primary-light-gray px-2 py-1 text-sm"
                  key={index}
                >
                  <h4 className="mb-1 font-bold">
                    {index + 1}. {service.service}
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-primary-light-gray">Total</p>
                    <p className="text-primary-amber">{service.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Financas;
