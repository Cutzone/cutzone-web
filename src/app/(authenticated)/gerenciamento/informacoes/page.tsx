"use client";

import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import initialInfoFormSchema from "@/validations/initialInfo";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Button from "@/components/atoms/Button/button";
import {
  updateBarberDocFlags,
  updateBarberDocInitialInfo
} from "@/store/services/barberShop";
import { storageGet } from "@/store/services/storage";
import Image from "next/image";
import { deleteImage, uploadFile } from "@/store/services/uploadFile";
import Title from "@/components/atoms/Title";
import { useRouter } from "next/navigation";
import Subtitle from "@/components/atoms/Subtitle";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import { CaretRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useBarberShop from "@/hooks/queries/useBarberShop";

type intialInfoForm = z.infer<typeof initialInfoFormSchema>;

export default function Informacoes() {
  const [downloadMainURL, setDownloadMainURL] = useState<string>("");
  const [mainImageError, setMainImageError] = useState<string>("");
  const [imagesError, setImagesError] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const route = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useBarberShop(storageGet("uid") as string);
  const progress = data?.flags?.filter((flag) => flag === true).length;

  const mutation = useMutation(
    () => {
      return updateBarberDocFlags({
        id: storageGet("uid") as string,
        flags: [true, true, true, false, false, false],
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
        route.replace("/gerenciamento/servicosInfo");
      }
    }
  );

  const handleSubmitForm = async (data: intialInfoForm) => {
    if (downloadMainURL === "") {
      setMainImageError("Insira uma imagem principal");
      return;
    }

    const imagesArray = [];

    for (const image of images) {
      if (image.url) {
        imagesArray.push(image.url);
      }
    }

    updateBarberDocInitialInfo({
      ...data,
      mainPhoto: downloadMainURL,
      id: storageGet("uid") as string,
      photos: imagesArray
    });

    mutation.mutateAsync();
  };

  const handleSelectedFile = async (files: any) => {
    setImagesError("");

    if (files[0].type !== "image/png" && files[0].type !== "image/jpeg") {
      setImagesError("O arquivo deve ser uma imagem PNG ou JPG");
      return;
    }

    if (files && files[0].size < 10000000) {
      const url = await uploadFile(files[0], setUploadProgress);
      setImages([
        ...images,
        { file: files[0], name: files[0].name, url, uploaded: true }
      ]);

      console.log(files[0]);
    } else {
      setImagesError("O arquivo deve ser menor que 10MB");
    }
  };

  const handleDeleteImage = (name: string) => {
    deleteImage(name);
    setImages(images.filter((image) => image.name !== name));
  };

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<intialInfoForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(initialInfoFormSchema)
  });

  useEffect(() => {
    if ((progress !== 2 && progress !== 3) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [progress, route, data]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3 text-center text-sm font-bold text-primary-amber sm:justify-start">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-amber text-white">
            <p>1</p>
          </div>
          <p className="hidden sm:block">
            Informações <br />
            iniciais
          </p>
        </div>
        <Separator className="w-10 bg-primary-light-gray " />
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-amber text-white">
            <p>2</p>
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

      <Title>Gostariamos de saber mais sobre a {data?.name}</Title>
      <p className="mb-8">
        Vamos montar o perfil de sua barbearia, preenchendo os campos abaixo,
        para que os
        <br /> clientes possam ter acesso e identificação com os tipos de
        serviços e estilo ofertado.
      </p>

      <div className="mb-6">
        <Subtitle className="mb-4">
          Qual padrão sua barbearia se encaixa?
        </Subtitle>
        <ul className="mb-4">
          <li>
            <CaretRightOutlined /> Estabelecimento fixo
          </li>
          <li>
            <CaretRightOutlined /> Recepção
          </li>
          <li>
            <CaretRightOutlined /> Opções de entretenimento
          </li>
          <li>
            <CaretRightOutlined /> Sanitário
          </li>
          <li>
            <CaretRightOutlined /> Climatização
          </li>
          <li>
            <CaretRightOutlined /> Quantidade de barbeiros
          </li>
          <li>
            <CaretRightOutlined /> Bar
          </li>
        </ul>

        <p className="mb-2">
          No campo de texto abaixo, deixe claro qual dos pontos acima sua
          barbearia possui, quais estilidades você pretende atender.
          <br />
          Isso é importante para que nós da Cutzone possamos entender o estilo
          da sua barbearia e encontrar a estilidade adequada.
          <br /> Fique tranquilo para escrever sobre sua barbearia, esse texto
          não irá aparacer para seus clientes.
        </p>
        <textarea
          className="mb-2 w-1/2 resize-none rounded-xl border-2 border-primary-light-gray p-3"
          placeholder="Escreva aqui sobre o que sua barbearia tem a oferecer..."
          {...register("style")}
          rows={3}
        />
        {errors.style?.message && (
          <FormErrorLabel>{String(errors.style?.message)}</FormErrorLabel>
        )}
      </div>

      <Subtitle className="mb-4">Adicione fotos e informações</Subtitle>
      <p className="mb-4">
        Selecione fotos da barbearia para o perfil da empresa, adicione imagens
        do local, serviços,
        <br /> produtos e das suas instalações. Caso sua barbearia possua
        ambientes como bar,
        <br /> recepção, espaço kids, é importante adicionar fotos de todas
        essas áreas.
      </p>
      <div className="mb-10">
        <p className="mb-1">
          Na descrição, fale um pouco sobre os valores do seu negócio e explique
          o funcionamento de
          <br /> sua barbearia. Esse texto será exibido para os seus clientes ao
          acessar a página de sua barbearia.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row ">
          <UploadMainImage
            downloadURL={downloadMainURL}
            setDownloadURL={setDownloadMainURL}
            formErrors={errors}
            formRegister={register}
            mainImageError={mainImageError}
            setMainImageError={setMainImageError}
            size="large"
            rounded
          >
            Adicionar foto
          </UploadMainImage>
          <div className="flex grow flex-col px-8 py-5">
            <div className="flex flex-col">
              <h1 className="text-primary-amber">{data?.name}</h1>
              <p className="text-sm">Empresa</p>
            </div>
            <Separator className="rounded-xl bg-primary-light-gray" />
            <input
              type="text"
              className="mb-2 rounded-xl border-2 border-primary-light-gray p-3"
              placeholder="Escreva sobre sua empresa aqui..."
              {...register("description")}
            />
            {errors.description?.message && (
              <FormErrorLabel>
                {String(errors.description?.message)}
              </FormErrorLabel>
            )}
          </div>
        </div>

        <h2 className="my-4 font-bold">Adicione imagens da barbearia</h2>

        <div className="grid grid-cols-1 justify-items-center gap-y-4 sm:grid-cols-2 lg:grid-cols-3 min-[1600px]:grid-cols-4">
          <div>
            <label htmlFor="imgsUpload">
              <div className="flex h-56 w-80 cursor-pointer items-center  justify-center overflow-hidden rounded bg-gray-200  transition-all hover:bg-gray-400">
                <div className="rounded-3xl border-2 border-black px-4 py-2 text-lg">
                  Adicionar imagens
                </div>
              </div>
            </label>
            <div className="flex flex-col items-center justify-center">
              <p className="mt-1">Clique para fazer o upload das imagens</p>{" "}
              <Progress
                percent={uploadProgress}
                showInfo={false}
                strokeColor="#B7864B"
                className="px-4"
              />
              {imagesError !== "" && (
                <FormErrorLabel>{imagesError}</FormErrorLabel>
              )}
            </div>

            <input
              type="file"
              id="imgsUpload"
              className="hidden"
              onChange={(files) => handleSelectedFile(files.target.files)}
            />
          </div>
          {images.map((image) => {
            // if (uploadProgress !== 100 && !image.uploaded) {
            //   return;
            // }

            return (
              <div key={image.name}>
                <div className="relative h-56 w-80 overflow-hidden rounded">
                  <Image
                    src={image.url}
                    alt="barbearia"
                    fill={true}
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <p
                    className="flex cursor-pointer items-center text-2xl font-bold text-red-500 transition-all hover:text-red-700"
                    onClick={() => handleDeleteImage(image.name)}
                  >
                    <DeleteOutlined />
                  </p>
                  <p className="font-bold">
                    {image.name.slice(0, 25)}
                    {image.name.length > 25 ? "..." : ""}
                  </p>{" "}
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-4 flex justify-end px-8">
          <Button
            borderColor="border-[#B7864B]"
            textColor="text-black"
            hover="hover:bg-[#B7864B]"
            type="submit"
          >
            Salvar e continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
