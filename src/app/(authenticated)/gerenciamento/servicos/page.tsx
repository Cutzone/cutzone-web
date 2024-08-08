"use client";

import Subtitle from "@/components/atoms/Subtitle";
import Title from "@/components/atoms/Title";
import ServiceForm from "./ServiceForm";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import Button from "@/components/atoms/Button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import { createNewServiceDoc } from "@/store/services/services";
import { storageGet } from "@/store/services/storage";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBarberDocFlags } from "@/store/services/barberShop";
import { Separator } from "@/components/ui/separator";
import { CheckOutlined } from "@ant-design/icons";

function Servicos() {
  const [formsCount, setFormsCount] = useState(1);
  const [services, setServices] = useState<BarberServicesEntity[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const route = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useBarberShop(storageGet("uid") as string);
  const progress = data?.flags?.filter((flag) => flag === true).length;

  const mutation = useMutation(
    () => {
      return updateBarberDocFlags({
        id: storageGet("uid") as string,
        flags: [true, true, true, true, true, false],
        aproved: false,
        status: "creating"
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "barberShop",
          storageGet("uid") as string
        ]);
      }
    }
  );

  const handleAddService = () => {
    setEmptyError("");
    setFormsCount((prevCount) => prevCount + 1);
  };

  const handleDeleteService = (index: number) => {
    setServices((prevServices) => prevServices.filter((_, i) => i !== index));
    setFormsCount((prevCount) => prevCount - 1);
  };

  const handleButtonClick = () => {
    if (services.length === 0) {
      setEmptyError("Adicione pelo menos um serviço");
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleSubmitServices = () => {
    for (const service of services) {
      const res = createNewServiceDoc(service, storageGet("uid") as string);
    }

    mutation.mutateAsync();

    route.replace("/gerenciamento/colaboradores");
  };

  useEffect(() => {
    if ((progress !== 4 && progress !== 5) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [progress, route]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3 text-center text-sm font-bold text-primary-amber sm:justify-start">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-amber text-white">
            <CheckOutlined />
          </div>
          <p className="hidden sm:block">
            Informações <br />
            iniciais
          </p>
        </div>
        <Separator className="w-10 bg-primary-light-gray " />
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-amber text-white">
            <CheckOutlined />
          </div>
          <p className="hidden sm:block">
            Horário de <br />
            funcionamento
          </p>
        </div>
        <Separator className="w-10 bg-primary-light-gray " />
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-amber text-white">
            <p>3</p>
          </div>
          <p className="hidden sm:block">
            Meus <br />
            serviços
          </p>
        </div>
        <Separator className="w-10 bg-primary-light-gray " />
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-amber text-white">
            <p>4</p>
          </div>
          <p className="hidden sm:block">
            Meus <br />
            funcionários
          </p>
        </div>
      </div>
      <div className="mb-8">
        <Title className="mb-8">Continuando...</Title>
        <Subtitle className="mb-4">Adicione seus serviços</Subtitle>
        <p className="text-sm text-gray-500">
          Adicione os serviços e categorias de sua empresa que vão ser ofertados
          aos clientes.
        </p>
      </div>

      <div>
        {[...Array(formsCount)].map((_, index) =>
          services[index] ? (
            <ServiceCard
              key={index}
              nome={services[index].name}
              descricao={services[index].description}
              duracao={services[index].averageServiceTime}
              preco={services[index].price}
              categorias={services[index].category}
              imageURL={services[index].photo}
              index={index}
              handleDeleteService={handleDeleteService}
            />
          ) : (
            <ServiceForm
              key={index}
              number={index + 1}
              handleAddService={handleAddService}
              setServices={setServices}
            />
          )
        )}
      </div>

      <div className="mt-8 flex justify-center px-8 sm:justify-end">
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleButtonClick}
            borderColor="border-primary-amber"
            hover="hover:bg-primary-amber"
            type="submit"
          >
            Salvar e continuar
          </Button>
          <FormErrorLabel>{emptyError}</FormErrorLabel>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" bg-white">
          <DialogHeader>
            <DialogTitle>
              Deseja adicionar {services.length} serviço
              {services.length <= 1 ? "" : "s"} a sua barbearia?
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="rounded-full border-2 border-gray-500 bg-gray-500 px-2 py-1 text-lg transition-all hover:bg-white"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="rounded-full border-2 border-primary-amber bg-primary-amber px-2 py-1 text-lg transition-all hover:bg-white"
              onClick={handleSubmitServices}
            >
              Adicionar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Servicos;
