"use client";

import Title from "@/components/atoms/Title";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import { useEffect, useState } from "react";
import collaboratorFormSchema from "@/validations/collaborator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/atoms/Button/button";
import { createNewCollaboratorDoc } from "@/store/services/collaborators";
import { storageGet } from "@/store/services/storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { CheckOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBarberDocFlags } from "@/store/services/barberShop";
import useBarberShop from "@/hooks/queries/useBarberShop";
import Input from "@/components/atoms/Input/input";
import { Separator } from "@/components/ui/separator";

type collaboratorForm = z.infer<typeof collaboratorFormSchema>;

function Colaboradores() {
  const [downloadURL, setDownloadURL] = useState("");
  const [mainImageError, setMainImageError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data } = useBarberShop(storageGet("uid") as string);
  const progress = data?.flags?.filter((flag) => flag === true).length;

  const route = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    () => {
      return updateBarberDocFlags({
        id: storageGet("uid") as string,
        flags: [true, true, true, true, true, true],
        aproved: false,
        status: "awaiting approval"
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "barberShop",
          storageGet("uid") as string
        ]);
        await queryClient.invalidateQueries(["barberShops"]);
      }
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<collaboratorForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(collaboratorFormSchema)
  });

  const handleSubmitForm = (data: collaboratorForm) => {
    if (downloadURL === "") {
      setMainImageError("Insira uma imagem principal");
      return;
    }

    createNewCollaboratorDoc(
      { ...data, photo: downloadURL },
      storageGet("uid") as string
    );

    setIsDialogOpen(true);

    console.log({ ...data, mainImage: downloadURL });
  };

  useEffect(() => {
    if (progress !== 5 || data?.suspended) {
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
            <CheckOutlined />
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
        <Title>Vamos aos colaboradores</Title>
        <p className="text-gray-500">
          Para agendamento dos serviços para os clientes, é importante o
          registro de
          <br /> funcionário, assim como o acompanhamento dos mesmos.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold">Registre seus funcionários</h3>
        <p className="text-sm text-gray-500">
          Para cada funcionário, é importante adicionar informações sobre suas
          áreas de atuação,
          <br /> nível de habilidade, disponibilidade, entre outros.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="mb-4">
          <p className="mb-2 font-bold">Informações pessoais</p>
          <div className="flex">
            <UploadMainImage
              downloadURL={downloadURL}
              setDownloadURL={setDownloadURL}
              mainImageError={mainImageError}
              setMainImageError={setMainImageError}
              size="small"
              rounded
            >
              <UserOutlined style={{ fontSize: "28px" }} />
            </UploadMainImage>
          </div>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="w-64">
              <Input
                bgColor="bg-[#fafafa]"
                textColor="text-primary-amber"
                borderColor="border-primary-amber"
                label="Nome completo"
                placeholder="Insira o nome do funcionário"
                name="name"
                formRegister={register}
                formErrors={errors}
                className="my-1 text-sm"
              />
            </div>

            <div className="w-28">
              <Input
                bgColor="bg-[#fafafa]"
                textColor="text-primary-amber"
                borderColor="border-primary-amber"
                label="Idade"
                placeholder="25"
                mask="999"
                name="age"
                formRegister={register}
                formErrors={errors}
                className="my-1 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 font-bold">Contato</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="w-48">
              <Input
                bgColor="bg-[#fafafa]"
                textColor="text-primary-amber"
                borderColor="border-primary-amber"
                label="Email"
                placeholder="a@b.com"
                name="email"
                formRegister={register}
                formErrors={errors}
                className="my-1 text-sm"
              />
            </div>

            <div className="w-36">
              <Input
                bgColor="bg-[#fafafa]"
                textColor="text-primary-amber"
                borderColor="border-primary-amber"
                label="Pix"
                placeholder="Chave pix"
                name="pix"
                formRegister={register}
                formErrors={errors}
                className="my-1 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 font-bold">Informações profissionais</p>
          <div className="flex gap-8">
            <div className="w-56">
              <Input
                bgColor="bg-[#fafafa]"
                textColor="text-primary-amber"
                borderColor="border-primary-amber"
                label="Profissão"
                placeholder="Insira a profissão"
                name="profession"
                formRegister={register}
                formErrors={errors}
                className="my-1 text-sm"
              />
            </div>

            {/* <div className="w-56">
              <Input
                label="Nível desempenho"
                placeholder="0 a 5"
                register={register}
                name="desempenho"
                formErrors={errors}
              />
            </div> */}
          </div>
        </div>

        <div className="flex justify-center px-8 sm:justify-end">
          <Button
            borderColor="border-[#B7864B]"
            textColor="text-black"
            hover="hover:bg-[#B7864B]"
            type="submit"
          >
            Salvar
          </Button>
        </div>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent
          className="rounded border-[#171516] bg-white"
          onInteractOutside={(event) => {
            event.preventDefault(); // This prevents the dialog from closing when clicking outside
          }}
          onEscapeKeyDown={(event) => {
            event.preventDefault(); // This prevents the dialog from closing when clicking outside
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-primary-amber">
              Informações cadastradas!
            </DialogTitle>
            <DialogDescription>
              O colaborador foi adicionado ao sistema! Deseja adicionar mais
              colaboradores ou continuar?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <button
              className="rounded bg-primary-amber px-2 py-1"
              onClick={() => {
                setIsDialogOpen(false);
                setDownloadURL("");
                reset();
              }}
            >
              Adicionar mais colaboradores +
            </button>
            <button
              className="rounded bg-primary-light-gray px-2 py-1"
              onClick={() => {
                mutation.mutateAsync();
                route.replace("/gerenciamento");
              }}
            >
              Continuar {"->"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Colaboradores;
