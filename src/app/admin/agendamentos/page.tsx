"use client";

import AdminInfoPage from "@/components/organisms/AdminInfoPage";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { columns } from "./columns";
import useAllPlataformAppointments from "@/hooks/queries/useAllPlataformAppointments";
import { useState } from "react";
import useAllBarberShops from "@/hooks/queries/useAllBarberShops";
import FilterButton from "@/components/atoms/FilterButton";

const Agendamentos = () => {
  const { data, isLoading, dataUpdatedAt, isFetching, refetch } =
    useAllPlataformAppointments();
  const { data: companiesData } = useAllBarberShops();
  const [companyFilterValue, setCompanyFilterValue] = useState("todas");
  const [tableFilter, setTableFilter] = useState("all");

  const appointmentsCount = {
    total: 0,
    concluded: 0,
    canceled: 0,
    didNotShow: 0,
    scheduled: 0
  };

  data?.forEach((item) => {
    appointmentsCount.total++;
    if (
      item.status === "concluded" &&
      (companyFilterValue === "todas" ||
        item?.company?.id === companyFilterValue)
    ) {
      appointmentsCount.concluded++;
    } else if (
      item.status === "canceled" &&
      (companyFilterValue === "todas" ||
        item?.company?.id === companyFilterValue)
    ) {
      appointmentsCount.canceled++;
    } else if (
      item.status === "didNotShow" &&
      (companyFilterValue === "todas" ||
        item?.company?.id === companyFilterValue)
    ) {
      appointmentsCount.didNotShow++;
    } else if (
      item.status === "scheduled" &&
      (companyFilterValue === "todas" ||
        item?.company?.id === companyFilterValue)
    ) {
      appointmentsCount.scheduled++;
    }
  });

  const filters = [
    {
      value: "all",
      text: "Todos",
      quantity: appointmentsCount.total
    },
    {
      value: "concluded",
      text: "Concluídos",
      quantity: appointmentsCount.concluded
    },
    {
      value: "canceled",
      text: "Cancelados",
      quantity: appointmentsCount.canceled
    },
    {
      value: "didNotShow",
      text: "Não compareceu",
      quantity: appointmentsCount.didNotShow
    },
    {
      value: "scheduled",
      text: "Agendados",
      quantity: appointmentsCount.scheduled
    }
  ];

  const filteredByCompanyData = data?.filter((val) => {
    if (companyFilterValue === "todas" && tableFilter === "all") {
      return val;
    }

    if (tableFilter === "all" && companyFilterValue !== "todas") {
      return val.company?.id === companyFilterValue;
    }

    if (companyFilterValue === "todas") {
      return val.status === tableFilter;
    } else {
      return (
        val.status === tableFilter && val.company?.id === companyFilterValue
      );
    }
  });

  console.log(filteredByCompanyData);

  return (
    <AdminInfoPage
      columns={columns}
      data={filteredByCompanyData || []}
      isLoading={isLoading}
      title="Agendamentos"
      appointments
      dataUpdatedAt={dataUpdatedAt}
      isFetching={isFetching}
      onRefetch={refetch}
    >
      <div className="mb-8">
        <Select
          value={companyFilterValue}
          onValueChange={(e) => setCompanyFilterValue(e)}
        >
          <SelectTrigger className="w-[180px] rounded  border border-gray-300 bg-gray-50 shadow">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent className="rounded bg-gray-50">
            <SelectGroup>
              <SelectLabel>Barbearias</SelectLabel>
              <SelectItem value="todas">Todas as barbearias</SelectItem>
              {companiesData?.map((company) => (
                <SelectItem
                  key={company.id}
                  value={company.id}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {company.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="my-4 flex h-11 items-start gap-2 overflow-x-auto overflow-y-hidden text-sm md:gap-[72px]">
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
    </AdminInfoPage>
  );
};

export default Agendamentos;
