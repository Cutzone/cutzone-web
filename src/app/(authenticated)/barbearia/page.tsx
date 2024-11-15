/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useBarberShop from "@/hooks/queries/useBarberShop";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storageGet } from "@/store/services/storage";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import { Separator } from "@/components/ui/separator";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import { InputNumber, Progress, TimePicker } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "@/components/atoms/Button/button";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import myBarberShopFormSchema from "@/validations/myBarberShop";
import { uploadFile } from "@/store/services/uploadFile";
import DayCheckbox from "@/components/atoms/DayCheckbox";
import CustomCheckbox from "@/components/atoms/CustomCheckbox";
import Title from "@/components/atoms/Title";
import dayjs from "dayjs";
import { updateMyBarberShopInfo } from "@/store/services/barberShop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast } from "@/hooks/useAppToast";
import Input from "@/components/atoms/Input/input";
import { FinanceForm, financeFormSchema } from "@/validations/financesForm";

const weekDays = [
  { name: "segunda", label: "Seg" },
  { name: "terca", label: "Ter" },
  { name: "quarta", label: "Qua" },
  { name: "quinta", label: "Qui" },
  { name: "sexta", label: "Sex" },
  { name: "sabado", label: "Sáb" },
  { name: "domingo", label: "Dom" }
];

type myBarberShopForm = z.infer<typeof myBarberShopFormSchema>;

function Barbearia() {
  const route = useRouter();
  const [downloadMainURL, setDownloadMainURL] = useState<string>("");
  const [mainImageError, setMainImageError] = useState<string>("");
  const [imagesError, setImagesError] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const queryClient = useQueryClient();
  const { data, isLoading } = useBarberShop(storageGet("uid") as string);

  const [days, setDays] = useState(
    data?.workDays || [false, false, false, false, false, false, false]
  );
  const [daysError, setDaysError] = useState("");

  const [isLunchTime, setIsLunchTime] = useState(false);
  const [lunchTime, setLunchTime] = useState(["00:00", "00:00"]);
  const [lunchTimeError, setLunchTimeError] = useState("");
  const [workTime, setWorkTime] = useState(["00:00", "00:00"]);
  const [workTimeError, setWorkTimeError] = useState("");
  const [cancelTime, setCancelTime] = useState(3);
  const [cancelTimeError, setCancelTimeError] = useState("");
  const [maxDays, setMaxDays] = useState(3);
  const [maxDaysError, setMaxDaysError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm<myBarberShopForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(myBarberShopFormSchema)
  });

  const {
    register: registerFinance,
    formState: { isValid, errors: financeErrors },
    getValues,
    trigger
  } = useForm<FinanceForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(financeFormSchema),
    values: {
      bank: data?.bank || "",
      bankAccount: String(data?.bankAccount) || "",
      bankAgency: String(data?.bankAgency) || "",
      pix: data?.pix || ""
    }
  });

  const onChangeCancelTime = (value: number | null) => {
    setCancelTimeError("");
    setCancelTime(value as number);
  };

  const onChangeMaxDays = (value: number | null) => {
    setMaxDaysError("");
    setMaxDays(value as number);
  };
  const handleSelectedFile = async (files: any) => {
    setImagesError("");

    if (files[0].type !== "image/png" && files[0].type !== "image/jpeg") {
      setImagesError("O arquivo deve ser uma imagem PNG ou JPG");
      return;
    }

    if (files && files[0].size < 10000000) {
      const url = await uploadFile(files[0], setUploadProgress);
      setImages([...images, url]);

      console.log(files[0]);
    } else {
      setImagesError("O arquivo deve ser menor que 10MB");
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setImages(images.filter((url) => url !== imageUrl));
  };

  const mutation = useMutation(
    ({ data, imagesArray }: { data: myBarberShopForm; imagesArray: any }) => {
      return updateMyBarberShopInfo({
        ...data,
        mainPhoto: downloadMainURL,
        id: storageGet("uid") as string,
        photos: imagesArray,
        description: data.description,
        workDays: days,
        startTimeWork: workTime[0],
        endTimeWork: workTime[1],
        lunchBreakInterval: isLunchTime,
        lunchBreakIntervalStart: lunchTime[0],
        lunchBreakIntervalEnd: lunchTime[1],
        cancelTime,
        maxAppointmentTime: maxDays,
        bank: getValues("bank"),
        bankAccount: Number(getValues("bankAccount")),
        bankAgency: Number(getValues("bankAgency")),
        pix: getValues("pix")
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "barberShop",
          storageGet("uid") as string
        ]);
        successToast("Informações atualizadas com sucesso!");
      }
    }
  );

  const handleSubmitForm = async (data: myBarberShopForm) => {
    if (downloadMainURL === "") {
      setMainImageError("Insira uma imagem principal");
      return;
    }

    const imagesArray = [];

    for (const image of images) {
      imagesArray.push(image);
    }

    if (!days.includes(true)) {
      setDaysError("Selecione pelo menos um dia");
      return;
    }

    if (workTime[0] === "00:00" && workTime[1] === "00:00") {
      setWorkTimeError("Selecione o horário de funcionamento");
      return;
    }

    if (isLunchTime && lunchTime[0] === "00:00" && lunchTime[1] === "00:00") {
      setLunchTimeError("Selecione o horário de almoço");
      return;
    }

    if (cancelTime < 1 || cancelTime > 24) {
      setCancelTimeError("O tempo de cancelamento deve ser entre 1 e 24 horas");
      return;
    }

    if (maxDays < 1 || maxDays > 30) {
      setMaxDaysError(
        "O tempo máximo de agendamento deve ser entre 1 e 30 dias"
      );
      return;
    }

    if (!isValid) {
      trigger("bank");
      trigger("bankAccount");
      trigger("bankAgency");
      trigger("pix");
      return;
    }

    await mutation.mutateAsync({ data, imagesArray });
  };

  useEffect(() => {
    if (days.includes(true)) {
      setDaysError("");
    }
  }, [days]);

  useEffect(() => {
    if (data?.flags?.includes(false) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [data, route]);

  useEffect(() => {
    if (!isLoading) {
      // default main picture
      setDownloadMainURL(data?.mainPhoto || "");

      // default descriptioin
      setValue("description", data?.description as string);

      // default images
      setImages(data?.photos || []);

      // default work days
      setDays(
        data?.workDays || [false, false, false, false, false, false, false]
      );

      // default work time
      setWorkTime([
        data?.startTimeWork || "00:00",
        data?.endTimeWork || "00:00"
      ]);

      // default islunchTime
      setIsLunchTime(data?.lunchBreakInterval || false);

      // default lunchTime
      setLunchTime([
        data?.lunchBreakIntervalStart || "00:00",
        data?.lunchBreakIntervalEnd || "00:00"
      ]);

      setCancelTime(data?.cancelTime || 3);
      setMaxDays(data?.maxAppointmentTime || 3);
    }
  }, [data, isLoading, setValue]);

  if (isLoading) return <div>Carregando...</div>;
  console.log(cancelTime, maxDays);
  return (
    <div>
      <Title>Minha barbearia</Title>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div>
          <h2 className="my-4 text-xl font-bold">Fotos e informações</h2>
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
                <h1 className="text-primary-amber">Brown Barbearia</h1>
                <p className="text-sm">Empresa</p>
              </div>
              <Separator className="rounded-xl bg-primary-light-gray" />
              <input
                type="text"
                className="mb-2 rounded-xl border-2 border-primary-light-gray p-3"
                placeholder="Escreva um pouco sobre sua empresa aqui..."
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
                <div className="flex h-40 w-60 cursor-pointer items-center justify-center overflow-hidden rounded bg-gray-200 transition-all hover:bg-gray-400  sm:h-56 sm:w-80">
                  <div className="rounded-3xl border-2 border-black px-4 py-2  text-sm sm:text-lg">
                    Adicionar imagens
                  </div>
                </div>
              </label>
              <div className="flex flex-col items-center justify-center">
                <p className="mt-1 text-xs sm:text-base">
                  Clique para fazer o upload das imagens
                </p>{" "}
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
            {images.map((image, index) => {
              // if (uploadProgress !== 100 && !image.uploaded) {
              //   return;
              // }
              return (
                <div key={index}>
                  <div className="relative h-40 w-60 overflow-hidden rounded sm:h-56 sm:w-80">
                    <Image
                      src={image}
                      alt="barbearia"
                      fill={true}
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <p
                      className="flex cursor-pointer items-center text-2xl font-bold text-red-500 transition-all hover:text-red-700"
                      onClick={() => handleDeleteImage(image)}
                    >
                      <DeleteOutlined />
                    </p>
                    {/* <p className="font-bold">
                      {image.name.slice(0, 25)}
                      {image.name.length > 25 ? "..." : ""}
                    </p>{" "} */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="my-4 text-xl font-bold">Horário de funcionamento</h2>
          <div className="mb-8">
            <h3 className="mb-2 font-bold">
              Selecione os dias em que a a barbearia é aberta
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {weekDays.map((day, index) => (
                <DayCheckbox
                  key={day.name}
                  name={day.name}
                  label={day.label}
                  days={days}
                  position={index}
                  setDays={setDays}
                />
              ))}
            </div>
            <div className="mt-2">
              <FormErrorLabel>{daysError || ""}</FormErrorLabel>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="mb-1 font-bold">Insira o horário da barbearia</h3>
            <p className="mb-2 text-[#999999]">
              Digite o horário de abertura e fechamento{" "}
            </p>
            <TimePicker.RangePicker
              value={[dayjs(workTime[0], "HH:mm"), dayjs(workTime[1], "HH:mm")]}
              format="HH:mm"
              placeholder={["00:00", "00:00"]}
              onChange={(value, dateString) => {
                setWorkTime(dateString);
                setWorkTimeError("");
              }}
            />
            <div className="mt-2">
              <FormErrorLabel>{workTimeError || ""}</FormErrorLabel>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-1 font-bold">
              Selecione o máximo de horas para cancelamento
            </h3>
            <p className="mb-2 text-[#999999]">
              Digite o tempo em horas prévias ao agendamento que não será mais
              possível realizar o cancelamento{" "}
            </p>
            <InputNumber
              min={1}
              max={24}
              defaultValue={data?.cancelTime}
              onChange={onChangeCancelTime}
            />
            <div className="mt-2">
              <FormErrorLabel>{cancelTimeError || ""}</FormErrorLabel>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-1 font-bold">
              Selecione o máximo de dias para agendamento
            </h3>
            <p className="mb-2 text-[#999999]">
              Digite o tempo máximo em dias que um usuários pode fazer um
              agendamento futuro{" "}
            </p>
            <InputNumber
              min={1}
              max={30}
              defaultValue={data?.maxAppointmentTime}
              onChange={onChangeMaxDays}
            />
            <div className="mt-2">
              <FormErrorLabel>{maxDaysError || ""}</FormErrorLabel>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-2 font-bold">
              A barbearia tem intervalo de almoço?
            </h3>
            <div className="flex items-center gap-2">
              <CustomCheckbox
                checked={isLunchTime}
                onChange={setIsLunchTime}
                label="Não"
                type="n"
                name="lunchTime"
              />
              <CustomCheckbox
                checked={isLunchTime}
                onChange={setIsLunchTime}
                label="Sim"
                type="y"
                name="lunchTime"
              />
            </div>
          </div>
          {isLunchTime && (
            <div className="mb-4">
              <p className="mb-2 text-[#999999]">
                Digite o horário de abertura e fechamento do intervalo de almoço
              </p>
              <TimePicker.RangePicker
                value={[
                  dayjs(lunchTime[0], "HH:mm"),
                  dayjs(lunchTime[1], "HH:mm")
                ]}
                format="HH:mm"
                placeholder={["00:00", "00:00"]}
                onChange={(value, dateString) => {
                  setLunchTime(dateString);
                  setLunchTimeError("");
                }}
              />
              <div className="mt-2">
                <FormErrorLabel>{lunchTimeError || ""}</FormErrorLabel>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-1 sm:w-1/2">
          <h2 className="text-xl font-bold">Dados financeiros</h2>
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Banco"
            placeholder="Insira o nome"
            name="bank"
            formRegister={registerFinance}
            formErrors={financeErrors}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Conta bancária"
            placeholder="Insira o numero da conta"
            mask="999999999999"
            name="bankAccount"
            formRegister={registerFinance}
            formErrors={financeErrors}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Agência bancária"
            placeholder="Insira o numero da agência"
            mask="9999"
            name="bankAgency"
            formRegister={registerFinance}
            formErrors={financeErrors}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Chave Pix"
            placeholder="Insira a chave"
            name="pix"
            formRegister={registerFinance}
            formErrors={financeErrors}
          />
        </div>

        <div className="my-4 flex justify-end px-8">
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
    </div>
  );
}

export default Barbearia;
