import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import { EllipsisOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteServiceDoc } from "@/store/services/services";
import { storageGet } from "@/store/services/storage";
import DeleteModal from "@/components/atoms/DeleteModal";
import ServiceModal from "./serviceModal";
interface ServiceCardProps {
  service: BarberServicesEntity;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [downloadURL] = useState(service.photo);
  const queryClient = useQueryClient();

  const mutationDelete = useMutation(
    () => {
      return deleteServiceDoc(
        service.id as string,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "services",
          storageGet("uid") as string
        ]);
        setIsDeleteOpen(false);
      }
    }
  );

  const deleteService = async () => {
    await mutationDelete.mutateAsync();
  };

  return (
    <>
      <div className="flex w-64 flex-col items-center justify-between gap-1 rounded-xl bg-white px-4 pb-6 pt-3 text-center shadow-lg">
        <div className="self-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisOutlined className="cursor-pointer text-2xl text-primary-amber" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="rounded bg-white">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary-light-gray" />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsDeleteOpen(true)}
              >
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative h-24 w-24 overflow-hidden rounded">
          <Image src={service.photo} alt="service" fill className="cover" />
        </div>
        <h2 className="text-xl text-primary-amber">{service.name}</h2>
        <p className="mb-1 text-sm text-gray-500">{service.description}</p>
        <p className="font-bold">R$ {service.price}</p>
        <div className="flex flex-wrap items-center justify-evenly gap-1">
          {service.category.map((categoria, i) => {
            return (
              <div
                key={i}
                className="rounded-full bg-primary-amber px-2 py-1 text-xs text-white"
              >
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </div>
            );
          })}
        </div>
      </div>
      <ServiceModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        type="edit"
        url={downloadURL}
        service={service}
      />

      <DeleteModal
        fn={deleteService}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        trigger={false}
      ></DeleteModal>
    </>
  );
};

export default ServiceCard;
