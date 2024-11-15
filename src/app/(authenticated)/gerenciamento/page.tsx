"use client";

import { Timestamp } from "@/common/entities/timestamp";
import Button from "@/components/atoms/Button/button";
import Title from "@/components/atoms/Title";
import { Separator } from "@/components/ui/separator";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { storageGet } from "@/store/services/storage";
import { timestampToDate } from "@/utils/timestampToDate";
import { CheckOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const signUpFlagsURLs = [
  "0",
  "cadastro",
  "endereco",
  "informacoes",
  "servicosInfo",
  "servicos",
  "colaboradores"
];

const Step = ({
  stepIndex,
  children,
  concluded,
  currentStep
}: {
  stepIndex: number;
  children: React.ReactNode;
  concluded: boolean;
  currentStep?: boolean;
}) => {
  return (
    <Link
      href={
        currentStep ? `/gerenciamento/${signUpFlagsURLs[stepIndex + 2]}` : "#"
      }
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center ${
        concluded ? "border-primary-amber bg-primary-amber/40" : ""
      } ${
        currentStep
          ? "h-40 w-44 cursor-pointer border-primary-amber"
          : "h-36 w-40 cursor-default"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-white  ${
          concluded || currentStep ? "bg-primary-amber" : "bg-gray-500"
        }`}
      >
        {concluded ? <CheckOutlined /> : null}
      </div>
      <p className="font-bold">Passo {stepIndex + 1}</p>
      <p className={`text-sm  ${concluded ? "text-black" : "text-gray-700"}`}>
        {children}
      </p>
    </Link>
  );
};

export default function Gerenciamento() {
  const { data, isLoading } = useBarberShop(storageGet("uid") as string);

  const progress = data?.flags?.filter((flag) => flag === true).length;
  const progressPercent = progress ? (progress * 100) / 6 : 0;
  const aproved = data?.aproved;
  const route = useRouter();

  useEffect(() => {
    if (aproved && !data?.suspended) {
      route.replace("/agenda");
    }
  }, [aproved, route]);

  if (isLoading) return <div>Carregando...</div>;

  if (data?.suspended) {
    return (
      <div>
        <Title>{data?.name}</Title>
        <h1 className="mb-1 text-xl">Seu acesso a plataforma foi suspenso.</h1>
        <p className="mb-4">
          Status: <span className="font-bold text-yellow-500">Suspensa</span>
        </p>
        <div className="mb-8">
          <p>Tente entrar em contato conosco para obter mais informações.</p>
        </div>
      </div>
    );
  }

  if (progressPercent !== 100) {
    return (
      <div>
        <Title>Bem vindo a {data?.name}</Title>
        <p className="mb-5">
          Vamos preencher os dados para gerenciamento da barbearia pelo
          <br /> nosso sistema e validação do acesso no aplicativo.
        </p>

        <div className="xl:w-[50vw]">
          <p className="font-bold">
            Conclua seu cadastro para ter acesso total a nossa plataforma
          </p>
          <div className="my-8 flex flex-col items-center justify-center md:my-4 md:flex-row md:justify-start">
            <Step
              stepIndex={0}
              concluded={(progress || 0) >= 2}
              currentStep={progress === 1 && true}
            >
              Minha
              <br /> barbearia
            </Step>

            <Separator className="hidden w-10 bg-primary-light-gray md:block" />
            <Separator
              className="block h-10 bg-primary-light-gray md:hidden"
              orientation="vertical"
            />
            <Step
              stepIndex={1}
              concluded={(progress || 0) >= 3}
              currentStep={progress === 2 && true}
            >
              Informações
              <br /> iniciais
            </Step>

            <Separator className="hidden w-10 bg-primary-light-gray md:block" />
            <Separator
              className="block h-10 bg-primary-light-gray md:hidden"
              orientation="vertical"
            />
            <Step
              stepIndex={2}
              concluded={(progress || 0) >= 4}
              currentStep={progress === 3 && true}
            >
              Horário de
              <br /> funcionamento
            </Step>

            <Separator className="hidden w-10 bg-primary-light-gray md:block" />
            <Separator
              className="block h-10 bg-primary-light-gray md:hidden"
              orientation="vertical"
            />
            <Step
              stepIndex={3}
              concluded={(progress || 0) >= 5}
              currentStep={progress === 4 && true}
            >
              Meus
              <br /> Serviços
            </Step>

            <Separator className="hidden w-10 bg-primary-light-gray md:block" />
            <Separator
              className="block h-10 bg-primary-light-gray md:hidden"
              orientation="vertical"
            />
            <Step
              stepIndex={4}
              concluded={(progress || 0) >= 6}
              currentStep={progress === 5 && true}
            >
              Meus
              <br /> colaboradores
            </Step>
          </div>
          {/* <Progress
            percent={progressPercent}
            strokeColor="#B7864B"
            format={(percent) => `${percent?.toFixed(1)} %`}
          /> */}
        </div>

        <Link
          href={`/gerenciamento/${signUpFlagsURLs[(progress || 0) + 1]}`}
          className="flex justify-center md:justify-start
        "
        >
          <Button
            borderColor="border-primary-amber"
            hover="hover:bg-primary-amber"
          >
            Preencher dados
          </Button>
        </Link>
      </div>
    );
  }

  if (
    progressPercent === 100 &&
    data?.aproved === false &&
    data?.rejected === false
  ) {
    return (
      <div>
        <Title>{data?.name}</Title>
        <h1 className="mb-1 text-xl"> Seu cadastro foi concluído!</h1>
        <div className="mb-8">
          <p>
            Nós estamos analisando seus dados e em breve daremos uma resposta.
          </p>
          <p>
            Enquanto você aguarda sua aprovação, você pode checar as
            funcionalidades do Cutzone nas outras abas da dashboard.
          </p>
        </div>
        <p>
          Status do processo de aprovação:{" "}
          <span className="font-bold text-yellow-500">Em análise</span>
        </p>
      </div>
    );
  }

  if (
    progressPercent === 100 &&
    data?.aproved === false &&
    data?.rejected === true
  ) {
    return (
      <div>
        <Title>{data?.name}</Title>
        <h1 className="mb-1 text-xl">
          Infelizmente sua barbearia não foi aceita na nossa plataforma.
        </h1>
        <p className="mb-4">
          Status do processo de aprovação:{" "}
          <span className="font-bold text-red-500">Rejeitada</span>
        </p>
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-medium">Informações</h2>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-primary-amber">Motivo:</h3>
            <p>{data?.reason}</p>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-primary-amber">Rejeitada em:</h3>
            <p>
              {timestampToDate(
                data?.rejectedAt as Timestamp
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
