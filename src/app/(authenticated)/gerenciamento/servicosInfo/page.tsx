/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Button from "@/components/atoms/Button/button";
import CustomCheckbox from "@/components/atoms/CustomCheckbox";
import DayCheckbox from "@/components/atoms/DayCheckbox";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import Subtitle from "@/components/atoms/Subtitle";
import Title from "@/components/atoms/Title";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { storageGet } from "@/store/services/storage";
import { Separator } from "@/components/ui/separator";
import {
  updateBarberDocFlags,
  updateBarberDocServicesInfo
} from "@/store/services/barberShop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TimePicker, InputNumber } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";

const weekDays = [
  { name: "segunda", label: "Seg" },
  { name: "terca", label: "Ter" },
  { name: "quarta", label: "Qua" },
  { name: "quinta", label: "Qui" },
  { name: "sexta", label: "Sex" },
  { name: "sabado", label: "Sáb" },
  { name: "domingo", label: "Dom" }
];

function isNumber(input: string): boolean {
  return !isNaN(parseFloat(input)) && isFinite(parseFloat(input));
}

function ServicosInfo() {
  const [days, setDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);
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

  const route = useRouter();
  const queryClient = useQueryClient();
  const { data } = useBarberShop(storageGet("uid") as string);
  const progress = data?.flags?.filter((flag) => flag === true).length;

  const mutation = useMutation(
    () => {
      return updateBarberDocFlags({
        id: storageGet("uid") as string,
        flags: [true, true, true, true, false, false],
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

  useEffect(() => {
    if (days.includes(true)) {
      setDaysError("");
    }
  }, [days]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!days.includes(true)) {
      setDaysError("Selecione pelo menos um dia");
      return;
    }

    if (workTime[0] === "00:00" && workTime[1] === "00:00") {
      setWorkTimeError("Selecione o horário de funcionamento");
      return;
    }

    if (
      cancelTime === undefined ||
      cancelTime === null ||
      cancelTime === 0 ||
      !isNumber(cancelTime.toString())
    ) {
      setCancelTimeError("Digite um valor válido");
      return;
    }

    if (cancelTime < 1 || cancelTime > 24) {
      setCancelTimeError("Digite um valor entre 1 e 24");
      return;
    }

    if (
      maxDays === undefined ||
      maxDays === null ||
      maxDays === 0 ||
      !isNumber(maxDays.toString())
    ) {
      setMaxDaysError("Digite um valor válido");
      return;
    }

    if (maxDays < 1 || maxDays > 30) {
      setMaxDaysError("Digite um valor entre 1 e 30");
      return;
    }

    if (isLunchTime && lunchTime[0] === "00:00" && lunchTime[1] === "00:00") {
      setLunchTimeError("Selecione o horário de almoço");
      return;
    }

    updateBarberDocServicesInfo({
      id: storageGet("uid") as string,
      workDays: days,
      startTimeWork: workTime[0],
      endTimeWork: workTime[1],
      lunchBreakInterval: isLunchTime,
      lunchBreakIntervalStart: lunchTime[0],
      lunchBreakIntervalEnd: lunchTime[1],
      cancelTime,
      maxAppointmentTime: maxDays
    });

    await mutation.mutateAsync();

    route.replace("/gerenciamento/servicos");
  };

  useEffect(() => {
    if ((progress !== 3 && progress !== 4) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [progress, route]);

  const onChangeCancelTime = (value: number | null) => {
    setCancelTimeError("");
    setCancelTime(value as number);
  };

  const onChangeMaxDays = (value: number | null) => {
    setMaxDaysError("");
    setMaxDays(value as number);
  };

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
      <div className="mb-8">
        <Title>E sobre seus serviços</Title>
        <p className="mb-8">
          Preencha os campos abaixo com as informações dos serviços,
          funcionários,
          <br />
          horário de funcionamento, descrevendo brevemente cada um deles.
        </p>
        <Subtitle>Adicione seus horários de funcionamento</Subtitle>
        <p className="mb-8 text-sm text-gray-500">
          Adicione os horários de funcionamento da barbearia, em seguida os dias
          de semana e<br /> sua média de atendimento.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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
          <h3 className="mb-1 font-bold">
            Selecione os dias em que a a barbearia é aberta
          </h3>
          <p className="mb-2 text-[#999999]">
            Digite o horário de abertura e fechamento{" "}
          </p>
          <TimePicker.RangePicker
            format="HH:mm"
            popupClassName=""
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
            defaultValue={3}
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
            defaultValue={3}
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
              format="HH:mm"
              popupClassName=""
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

        {/* <div className="mb-4 mt-8">
          <h3 className="mb-2 font-bold">
            Existe uma média de tempo de atendimento?
          </h3>

          <div className="flex items-center gap-2">
            <CustomCheckbox
              checked={averageServiceTime}
              onChange={setAverageServiceTime}
              label="Não"
              type="n"
              name="averageServiceTime"
            />

            <CustomCheckbox
              checked={averageServiceTime}
              onChange={setAverageServiceTime}
              label="Sim"
              type="y"
              name="averageServiceTime"
            />
          </div>
        </div>

        {averageServiceTime && (
          <div className="mb-4">
            <p className="mb-2 text-[#999999]">
              Digite a duração em minutos de um atendimento
            </p>

            <input
              type="text"
              className="w-20 rounded border-[1px] border-[#ECECEC] px-2 py-1 hover:border-[#4096FF]"
              placeholder="45 min"
              maxLength={3}
              value={serviceTime}
              onChange={(e) => {
                setAverageServiceTimeError("");
                setServiceTime(e.target.value);
              }}
            />
            <div className="mt-2">
              <FormErrorLabel>{averageServiceTimeError || ""}</FormErrorLabel>
            </div>
          </div>
        )} */}

        <div className="flex justify-end px-8">
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

export default ServicosInfo;
