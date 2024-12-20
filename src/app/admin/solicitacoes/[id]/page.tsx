"use client";

import { Timestamp } from "@/common/entities/timestamp";
import { Separator } from "@/components/ui/separator";
import useAllColaborators from "@/hooks/queries/useAllColaborators";
import useAllServices from "@/hooks/queries/useAllServices";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { timestampToDate } from "@/utils/timestampToDate";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ServiceCard from "./components/ServiceCard";
import CollaboratorCard from "./components/CollaboratorCard";
import { useState } from "react";
import ApprovalModal from "./components/ApprovalModal";
import Button from "@/components/atoms/Button/button";
import RejectionModal from "./components/RejectionModal";

const weekDays = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo"
];

const Item = ({ label, content }: { label: string; content: string }) => {
  return (
    <h1 className="text-lg font-semibold text-primary-amber">
      {label}: <span className="text-lg font-light text-black">{content}</span>
    </h1>
  );
};

const SolicitacoesPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: barberShop, isLoading } = useBarberShop(id as string);
  const { data: services } = useAllServices(id as string);
  const { data: collaborators } = useAllColaborators(id as string);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRejection, setIsOpenRejection] = useState(false);

  console.log(barberShop);

  const handleAprove = async () => {
    setIsOpen(true);
  };

  const handleReject = () => {
    setIsOpenRejection(true);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="relative">
      <div
        className="mb-4 w-32 cursor-pointer text-lg"
        onClick={() => router.back()}
      >
        {"<-"} Voltar
      </div>
      <h1 className="text-3xl font-medium ">Informações da barbearia</h1>
      <Separator className="mb-6 mt-4 bg-black" />
      <p className="mb-4 text-sm font-light">
        Solicitação criada em:{" "}
        {timestampToDate(barberShop?.createdAt as Timestamp).toLocaleDateString(
          "pt-BR"
        )}
      </p>
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Informações básicas</h2>
        <Item label="Responsável" content={barberShop?.owner || ""} />
        <Item label="Nome" content={barberShop?.name || ""} />
        <Item label="Descrição" content={barberShop?.description || ""} />
        <Item label="Email" content={barberShop?.email || ""} />
        <Item label="Telefone" content={barberShop?.cellphone || ""} />
        <Item label="RG" content={barberShop?.rg || ""} />
        <Item label="CPF" content={barberShop?.cpf || ""} />
        <Item label="cnpj" content={barberShop?.cnpj || ""} />
        <Item label="Nome do banco" content={barberShop?.bank || ""} />
        <Item label="Conta bancária" content={barberShop?.bankAccount || ""} />
        <Item label="Agência bancária" content={barberShop?.bankAgency || ""} />
        <Item label="Chave pix" content={barberShop?.pix || ""} />
        <Item
          label="Cidade"
          content={`${barberShop?.city}/${barberShop?.state}` || ""}
        />
        <Item label="Endereço" content={barberShop?.address || ""} />
        <Item label="Número" content={barberShop?.number || ""} />
        <Item label="CEP" content={barberShop?.cep || ""} />
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Imagens</h2>
        <div className="grid grid-cols-5">
          <div className="col-span-1">
            <h3 className="mb-2 font-semibold text-primary-amber">
              Foto principal
            </h3>
            <Image
              src={barberShop?.mainPhoto || ""}
              width={208}
              height={208}
              alt="Barbershop logo"
            />
          </div>
          <div className="col-span-4">
            <h3 className="mb-2 font-semibold text-primary-amber">
              Outras fotos
            </h3>
            <div className="flex flex-wrap gap-4">
              {barberShop?.photos?.map((picture) => {
                return (
                  <div className="relative h-52 w-52" key={picture}>
                    <Image
                      src={picture || ""}
                      fill
                      alt="Barbershop logo"
                      className="object-cover"
                    />
                  </div>
                );
              })}
              {barberShop?.photos?.length === 0 && (
                <p className="text-sm">Nenhuma outra foto foi adicionada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Funcionamento</h2>
        <h1 className="text-lg font-semibold text-primary-amber">
          Dias de funcionamento:{" "}
          {barberShop?.workDays?.map((day, index) => {
            if (day) {
              return (
                <span className="text-lg font-light text-black" key={index}>
                  {weekDays[index]}
                  {index !== (barberShop?.workDays?.length ?? 0) - 1
                    ? ", "
                    : ""}
                </span>
              );
            }
            return null;
          })}
        </h1>
        <Item
          label="Horário de funcionamento"
          content={`${barberShop?.startTimeWork} - ${barberShop?.endTimeWork}`}
        />
        {barberShop?.lunchBreakInterval && (
          <Item
            label="Horário de almoço"
            content={`${barberShop?.lunchBreakIntervalStart} - ${barberShop?.lunchBreakIntervalEnd}`}
          />
        )}
        <Item
          label="Tempo máximo de cancelamento"
          content={`${barberShop?.cancelTime} horas`}
        />
        <Item
          label="Máximo de dias para agendamento"
          content={`${barberShop?.maxAppointmentTime} dias`}
        />
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Serviços</h2>
        <div className="flex flex-wrap gap-4">
          {services?.map((service) => {
            return <ServiceCard key={service.id} service={service} />;
          })}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Colaboradores</h2>
        <div className="flex flex-wrap gap-4">
          {collaborators?.map((collaborator) => {
            return (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
              />
            );
          })}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Estilidade</h2>
        <div className="rounded p-1 shadow-sm sm:w-1/2">
          <p>{barberShop?.style}</p>
        </div>
      </div>

      <div className="fixed bottom-12 right-16">
        <div className="flex gap-4">
          <Button
            borderColor="border-primary-amber"
            hover="hover:bg-primary-amber"
            onClick={handleAprove}
          >
            Aprovar
          </Button>
          <Button
            borderColor="border-red-500"
            hover="hover:bg-red-500"
            onClick={handleReject}
          >
            Rejeitar
          </Button>
        </div>
      </div>

      <ApprovalModal open={isOpen} onOpenChange={setIsOpen} id={id as string} />
      <RejectionModal
        open={isOpenRejection}
        onOpenChange={setIsOpenRejection}
        id={id as string}
      />
    </div>
  );
};

export default SolicitacoesPage;
