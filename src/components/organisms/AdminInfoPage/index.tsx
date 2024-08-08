"use client";

import { DataTable } from "@/components/ui/dataTable";
import { AdminInfoPageProps } from "./types";
import { useState } from "react";
import RefetchButton from "@/components/molecules/RefetchButton/refetchButton";

const AdminInfoPage = ({
  columns,
  data,
  isLoading,
  title,
  children,
  appointments,
  dataUpdatedAt,
  isFetching,
  onRefetch
}: AdminInfoPageProps) => {
  const [filterValue, setFilterValue] = useState("");
  console.log(data);
  const filteredData = !appointments
    ? data?.filter((val: any) => {
        if (filterValue === "") {
          return val;
        } else if (val) {
          return val.name
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase());
        }
        return false;
      })
    : data?.filter((val: any) => {
        if (filterValue === "") {
          return val;
        } else if (val) {
          return val.company.name
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase());
        }
        return false;
      });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium">{title}</h1>
      {children}
      <div className="mb-4 flex items-center gap-2">
        <p className="font-light">Buscar: </p>
        <input
          type="text"
          className="rounded border px-1"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>
      <RefetchButton
        dataUpdatedAt={dataUpdatedAt}
        isLoading={isFetching}
        onRefetch={onRefetch}
        className="mb-4"
      />
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
};

export default AdminInfoPage;
