"use client";

import Button from "@/components/atoms/Button/button";
import Header from "@/components/molecules/Header";
import { CheckOutlined } from "@ant-design/icons";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Benefits = () => {
  return (
    <section className="bg-[#f7f6f2]">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 mt-6 text-4xl font-extrabold md:text-5xl">
            Maximize seu Potencial com Cutzone
          </h2>
          <div className="mx-auto mb-8 mt-4 max-w-[528px] md:mb-12 lg:mb-16">
            <p className="text-[#494848]">
              Acelere o crescimento da sua barbearia com ferramentas
              inteligentes e serviços personalizados que a Cutzone oferece.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-8 md:p-10">
            <Image
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a287_Circle%20Image.svg"
              alt="Features Icon"
              className=""
              height={65}
              width={65}
            />

            <p className="text-xl font-semibold">Suporte Dedicado</p>
            <p className="text-sm text-[#494848]">
              Acesso a uma equipe de suporte sempre disponível para ajudar a
              otimizar sua presença na plataforma e garantir a melhor
              experiência para seus clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-8 md:p-10">
            <Image
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a285_Circle%20Image-1.svg"
              alt="Features Icon"
              className=""
              height={65}
              width={65}
            />
            <p className="text-xl font-semibold">Gestão Facilitada</p>
            <p className="text-sm text-[#636262]">
              Ferramentas intuitivas para gerenciar agendamentos, clientes e
              serviços, tudo em um só lugar para manter sua barbearia
              organizada.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-8 md:p-10">
            <Image
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a286_Circle%20Image-2.svg"
              alt="Features Icon"
              className=""
              height={65}
              width={65}
            />
            <p className="text-xl font-semibold">Flexibilidade de Serviços</p>
            <p className="text-sm text-[#636262]">
              Ofereça serviços customizados e ajuste sua disponibilidade em
              tempo real para atender às demandas dos clientes com facilidade.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-8 md:p-10">
            <Image
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a283_Circle%20Image-3.svg"
              alt="Features Icon"
              className=""
              height={65}
              width={65}
            />
            <p className="text-xl font-semibold">Agilidade nos Agendamentos</p>
            <p className="text-sm text-[#636262]">
              Sistema rápido de reservas que permite a clientes agendar e
              reagendar serviços sem complicações, aumentando a eficiência da
              sua barbearia.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-8 md:p-10">
            <Image
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a284_Circle%20Image-4.svg"
              alt="Features Icon"
              className=""
              height={65}
              width={65}
            />
            <p className="text-xl font-semibold">Qualidade Comprovada</p>
            <p className="text-sm text-[#636262]">
              Destaque-se no mercado com avaliações de clientes e mostre a
              excelência dos seus serviços. A Cutzone eleva seu padrão de
              qualidade.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 rounded-xl bg-white p-8 md:p-10">
            <Image
              src="https://uploads-ssl.webflow.com/646f65e37fe0275cfb808405/646f66cdeeb4ddfdae25a288_Circle%20Image-5.svg"
              alt="Features Icon"
              className=""
              height={65}
              width={65}
            />
            <p className="text-xl font-semibold">Recursos Exclusivos</p>
            <p className="text-sm text-[#636262]">
              Beneficie-se de recursos de marketing e análise de dados para
              atrair e reter mais clientes, melhorando continuamente o
              crescimento do seu negócio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = ({
  setIsLoginOpen
}: {
  setIsLoginOpen: (value: boolean) => void;
}) => {
  return (
    <section className="block overflow-x-hidden bg-[#D0C8C5]">
      <div className="mx-auto mt-14 w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-40 ">
        <div className="grid grid-cols-1 items-center justify-items-center gap-8 max-[991px]:justify-items-start sm:gap-20 lg:grid-cols-2">
          <div className="relative h-[250px] w-full max-[991px]:[grid-area:-2/1/-1/2] sm:h-[400px]">
            <Image
              src="/barber-shop.jpg"
              alt="Imagem de uma barbearia"
              fill
              className="mx-auto inline-block  max-w-[640px] object-cover"
            />
          </div>
          <div className="max-[991px]:max-w-[720px] max-[991px]:[grid-area:1/1/2/2]">
            <h1 className="mb-4 text-4xl font-bold text-[#171516] md:text-5xl">
              Faça parte do nosso sistema de gestão de barbearias
            </h1>
            <div className="mb-6 max-w-[528px] md:mb-10 lg:mb-12">
              <p className="mb-4 text-sm text-[#322E2D] sm:text-xl">
                Gerencie sua Barbearia pelo nosso software e seja um parceiro do
                Cutzone, o app para Marketplace de Barbearias.
              </p>
              <Button
                borderColor="border-primary-amber"
                hover="hover:bg-primary-amber"
                onClick={() => setIsLoginOpen(true)}
              >
                Comece agora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  const router = useRouter();

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = "/CONTRATO_WEB_PARA_BARBEARIA.pdf";
    link.download = "contrato-babearia.pdf";
    link.click();
  };

  return (
    <section className="bg-[#FBE3BD]/30">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="flex w-full flex-col items-center bg-[#f2f2f7]/50 px-6 py-16 text-center shadow md:py-24">
          <h2 className="mb-6 max-w-[600px] flex-col text-3xl font-bold md:mb-10 md:text-5xl lg:mb-12">
            {" "}
            Transforme Sua Barbearia
          </h2>

          <div className="mx-auto">
            <ul className="mb-6 flex flex-col flex-nowrap gap-3 md:mb-10 md:flex-row lg:mb-12">
              <li className="ml-2 mr-2 flex flex-row items-center md:mx-4">
                <CheckOutlined className="mr-2 font-bold text-primary-amber" />
                <p className="">Conectividade Total com Clientes</p>
              </li>
              <li className="ml-2 mr-2 flex flex-row items-center md:mx-4">
                <CheckOutlined className="mr-2 font-bold text-primary-amber" />
                <p className="">Experiência Adaptável ao Usuário</p>
              </li>
              <li className="ml-2 mr-2 flex flex-row items-center md:mx-4">
                <CheckOutlined className="mr-2 font-bold text-primary-amber" />
                <p className="">Implementação Direta e Sem Esforço</p>
              </li>
            </ul>
          </div>

          <div
            className="mb-4 flex cursor-pointer flex-row items-center bg-primary-amber px-8 py-4 font-semibold text-white transition [box-shadow:rgb(255,_130,0,0.4)-8px_8px] hover:[box-shadow:rgb(204,_153,_0)_0px_0px]"
            onClick={() => router.push("/cadastro")}
          >
            <p className="mr-6 font-bold">Cadastre Sua Barbearia</p>
            <svg
              fill="currentColor"
              className="h-4 w-4 flex-none"
              viewBox="0 0 20 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Arrow Right</title>
              <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
            </svg>
          </div>
          <p className="text-sm">
            Comece hoje, sem taxas. Elevamos o padrão do seu negócio.
            <br />
            Para mais informações sobre valores e repasses, acesse o contrato,
            <br /> o qual será encaminhado e deverá ser assinado para concluir a
            aprovação.
          </p>
          <div
            onClick={downloadFile}
            className="mt-1 cursor-pointer text-sm text-blue-500 underline"
          >
            Contrato para barbearia
          </div>
        </div>
      </div>
    </section>
  );
};

const SouBarbearia = () => {
  const [isSingUpOpen, setIsSingUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Header
        isSingUpOpen={isSingUpOpen}
        setIsSingUpOpen={setIsSingUpOpen}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
      />
      <Hero setIsLoginOpen={setIsLoginOpen} />
      <Benefits />
      <CallToAction />
    </>
  );
};

export default SouBarbearia;
