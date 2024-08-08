"use client";

import Title from "@/components/atoms/Title";
import { DataTable } from "@/components/ui/dataTable";
import { columns } from "./columns";
import BlockModal from "./components/BlockModal";
import { useState } from "react";
import Button from "@/components/atoms/Button/button";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useAllColaborators from "@/hooks/queries/useAllColaborators";
import { storageGet } from "@/store/services/storage";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import useAllBsBlockedDates from "@/hooks/queries/useAllBsBlockedDates";
import { BlocekdDateEntity } from "@/common/entities/blockedDate";
import useAllCollaboratorsBlockedDates from "@/hooks/queries/useAllColaboratorBlockedDates";
import FilterButton from "@/components/atoms/FilterButton";
import useAllAppointments from "@/hooks/queries/useAllAppointments";
import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";

const DatasBloqueadas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableFilter, setTableFilter] = useState("all");
  const router = useRouter();

  const { data: collaborators, isLoading: isLoadingCollaborators } =
    useAllColaborators(storageGet("uid") as string);
  const { data: barberShop, isLoading: isLoadingBarberShop } = useBarberShop(
    storageGet("uid") as string
  );
  const { data: barberShopBlockedDates, isLoading: isLoadingBlockedDates } =
    useAllBsBlockedDates(storageGet("uid") as string);

  const {
    data: CollaboratorsBlockedDates,
    isLoading: isLoadingCollaboratorsBlockedDates
  } = useAllCollaboratorsBlockedDates(storageGet("uid") as string);

  const { data: appointments } = useAllAppointments(
    storageGet("uid") as string
  );

  const concatArray = barberShopBlockedDates?.concat(
    CollaboratorsBlockedDates as BlocekdDateEntity[]
  );

  if (
    isLoadingCollaborators ||
    isLoadingBlockedDates ||
    !concatArray ||
    isLoadingCollaboratorsBlockedDates
  )
    return <div>Carregando...</div>;

  // remove collaborators duplicates
  const uniqueCollaborators = new Set();
  const uniqueCollaboratorsArray = concatArray?.filter((item) => {
    if (
      item.type === "collaborator" &&
      !uniqueCollaborators.has(item.collaboratorId)
    ) {
      uniqueCollaborators.add(item.collaboratorId);
      return true;
    }
    return false;
  });

  // create filters
  const filters = uniqueCollaboratorsArray?.map((item) => ({
    value: item.collaboratorId,
    name: item.collaboratorName,
    quantity: CollaboratorsBlockedDates?.filter(
      (collab) => collab.collaboratorId === item.collaboratorId
    ).length as number
  }));

  filters?.push({
    value: "barbershop",
    name: "Barbearia",
    quantity: barberShopBlockedDates?.length as number
  });
  filters?.push({
    value: "all",
    name: "Todos",
    quantity: concatArray?.length as number
  });
  filters?.reverse();

  const filteredData = concatArray?.filter((item) => {
    if (tableFilter === "all") {
      return true;
    } else if (tableFilter === "barbershop") {
      return item.type === "barbershop";
    }
    return item.collaboratorId === tableFilter;
  });

  if (
    (isLoadingCollaborators ||
      isLoadingBarberShop ||
      isLoadingBlockedDates ||
      isLoadingCollaboratorsBlockedDates) &&
    !filters
  )
    return <div>Carregando...</div>;

  console.log(filteredData);
  return (
    <div>
      <div
        className="mb-4 flex w-16 cursor-pointer items-center gap-2 text-lg"
        onClick={() => router.push("/agenda")}
      >
        <ArrowLeftOutlined /> Voltar
      </div>
      <Title>Datas bloqueadas</Title>
      <h2 className="mb-4 text-lg text-gray-500">
        Aqui você pode bloquear datas para que seus clientes não consigam
        agendar horários.
      </h2>
      <Button
        onClick={() => setIsModalOpen(true)}
        borderColor="border-primary-amber"
        hover="hover:bg-primary-amber"
        className="mb-8"
      >
        Bloquear datas
      </Button>
      <BlockModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        collaborators={collaborators as CollaboratorEntity[]}
        barberShop={barberShop as BarberShopEntity}
        appointments={appointments as AppoitmentCompanyEntity[]}
      />
      <div className="mt-1 flex h-12 items-start gap-2 overflow-x-auto overflow-y-hidden text-sm md:gap-[72px]">
        {filters?.map((item) => {
          return (
            <FilterButton
              key={item.value}
              value={item.value}
              quantity={item.quantity}
              curValue={tableFilter}
              setFilter={setTableFilter}
            >
              {item.name}
            </FilterButton>
          );
        })}
      </div>

      <DataTable data={filteredData as BlocekdDateEntity[]} columns={columns} />
    </div>
  );
};

export default DatasBloqueadas;
