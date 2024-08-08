"use client";

import { DataTable } from "@/components/ui/dataTable";
import useAllBarberShops from "@/hooks/queries/useAllBarberShops";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { columns } from "./columns";

const Solicitacoes = () => {
  const { data } = useAllBarberShops();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");

  const filteredData = data?.filter((val) => {
    if (filterValue === "") {
      return val;
    } else if (val) {
      return val.name.toLowerCase().includes(filterValue.toLocaleLowerCase());
    }
    return false;
  });

  const waitingForApproval = data?.filter((val) => {
    if (
      val.aproved === false &&
      val.rejected !== true &&
      val.flags &&
      val.flags[5]
    ) {
      return val;
    }
    return null;
  });

  if (!filteredData) return <div>Carregando...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium">Solicitações</h1>
      <div>
        <p className="mb-2 text-lg">
          {waitingForApproval?.length !== 0
            ? "Barbearias esperando por aprovação"
            : "Sem barbearias esperando por aprovação nesse momento."}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-6">
          {waitingForApproval?.map((company) => {
            return (
              <div
                key={company.id}
                className="grid h-44 w-full max-w-sm cursor-pointer grid-cols-2 gap-2 rounded p-5 shadow-md transition-all hover:scale-[105%]"
                onClick={() => router.push(`/admin/solicitacoes/${company.id}`)}
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={company.mainPhoto || ""}
                    alt="Picture of the author"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="self-center">
                  <p className="text-xl font-medium text-primary-amber">
                    {company?.name}
                  </p>
                  <p className="mb-2 text-sm">
                    {company?.description && company?.description?.length > 38
                      ? `${company?.description?.slice(0, 38)}...`
                      : company?.description}
                  </p>
                  <p className="text-sm">{company?.city}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-12">
        <h1 className="mb-6 text-2xl font-medium">
          Barbearias em processo de criação
        </h1>
        <div className="mb-4 flex items-center gap-2">
          <p className="font-light">Buscar: </p>
          <input
            type="text"
            className="rounded border px-1"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <DataTable data={filteredData} columns={columns} />
      </div>
    </div>
  );
};

export default Solicitacoes;
