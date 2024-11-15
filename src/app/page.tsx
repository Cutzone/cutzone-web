"use client";

import Image from "next/image";
import Button from "@/components/atoms/Button/button";
import { CheckOutlined } from "@ant-design/icons";
import { useState } from "react";
import Header from "@/components/molecules/Header";
import Footer from "@/components/molecules/Footer";

export default function Home() {
  const [isSingUpOpen, setIsSingUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const HowItWorks = () => {
    return (
      <section className="bg-[#D0C8C5]">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
          <p className="text-center text-sm font-bold uppercase">
            3 passos simples
          </p>
          <h2 className="text-center text-3xl font-bold md:text-5xl">
            Como funciona
          </h2>
          <p className="mx-auto mb-8 mt-4 max-w-lg text-center text-sm text-[#494848] sm:text-base md:mb-12 lg:mb-16">
            Em três etapas simples, garanta seu acesso a cortes de cabelo e
            estilos exclusivos. Assine, conecte-se e transforme-se com Cutzone.
          </p>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex h-full flex-col items-center  pt-7 [grid-area:2/1/3/2] lg:[grid-area:1/2/2/3]">
              <div className="mb-8 flex max-w-lg justify-center gap-4 rounded-xl border border-solid border-white px-6 py-5 text-[#222222]">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f2f2f7]">
                  <p className="text-sm font-bold sm:text-base">1</p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <h5 className="text-xl font-bold">
                    {" "}
                    Selecione Sua Experiência
                  </h5>
                  <p className="text-sm text-[#494848]">
                    Escolha o plano ideal para seu estilo. De básico ao premium,
                    temos a opção certa para você.
                  </p>
                </div>
              </div>

              <div className="mb-8 flex max-w-lg justify-center gap-4 rounded-xl border border-solid border-white px-6 py-5 text-[#222222]">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f2f2f7]">
                  <p className="text-sm font-bold sm:text-base">2</p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <h5 className="text-xl font-bold">
                    Conecte-se com Especialistas
                  </h5>
                  <p className="text-sm text-[#494848]">
                    Acesse uma rede de barbearias de elite e marque seus
                    serviços com facilidade.
                  </p>
                </div>
              </div>

              <div className="mb-8 flex max-w-lg justify-center gap-4 rounded-xl border border-solid border-white px-6 py-5 text-[#222222]">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f2f2f7]">
                  <p className="text-sm font-bold sm:text-base">3</p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <h5 className="text-xl font-bold">
                    Aproveite seu Novo Visual
                  </h5>
                  <p className="text-sm text-[#494848]">
                    Use seus créditos, aproveite os serviços e saia renovado com
                    seu estilo perfeito.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-full w-full">
              <Image
                fill
                className="object-cover"
                alt="barbeShop"
                src="/howItWorks.jpg"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };
  return (
    <>
      <Header
        isSingUpOpen={isSingUpOpen}
        setIsSingUpOpen={setIsSingUpOpen}
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
      />
      {/* <section className="block overflow-x-hidden bg-[#f7f6f2]">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-40">
          <div className="grid grid-cols-1 items-center gap-8 max-[991px]:justify-items-start sm:gap-20 lg:grid-cols-2">
            <div className="max-[991px]:max-w-[720px]">
              <h1 className="mb-4 text-4xl font-bold text-[#171516] md:text-5xl">
                Descubra seu Estilo com Cutzone
              </h1>
              <div className="mb-6 max-w-[528px] md:mb-10 lg:mb-12">
                <p className="mb-4 text-sm text-[#322E2D] sm:text-xl">
                  Escolha e agende serviços nas melhores barbearias da cidade.
                  Rapidez, estilo e conveniência, tudo em um só lugar. Cutzone,
                  onde seu próximo corte está à distância de um toque.
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
            <div className="">
              <Image
                src="/barber-shop.jpg"
                alt="Picture of the author"
                width={500}
                height={500}
                className="mx-auto inline-block h-full w-full max-w-[640px] object-cover"
              />
            </div>
          </div>
        </div>
      </section> */}

      <section className="relative grid h-screen grid-rows-2 lg:grid-cols-2 lg:grid-rows-none">
        <div className="mt-[100px] flex items-center justify-center bg-[#faead2] lg:mt-20 lg:pl-36 lg:pr-16 lg:pt-44">
          <div className="mt-16 text-center lg:mt-0 lg:text-start">
            <h1 className="mb-4 px-4 text-3xl font-bold  text-[#171516] lg:px-0 xl:text-5xl">
              Descubra sua Estilidade com Cutzone
            </h1>
            <div className="mb-6 max-w-[528px] md:mb-10 lg:mb-12">
              <p className="mb-4 px-4 text-sm text-[#322E2D] md:text-base lg:px-0 xl:text-xl">
                Escolha e agende serviços nas melhores barbearias, em qualquer
                lugar e pelo mesmo preço sempre. Rapidez, estilo e conveniência,
                tudo em um só lugar. Cutzone, onde seu próximo corte está à
                distância de um toque.
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
        <div className="relative">
          <Image
            src="/barber-shop2.jpg"
            alt="Picture of the author"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute left-0 top-0 hidden h-full w-full bg-gradient-to-r from-[#faead2] via-transparent to-transparent lg:block"></div>
          <div className="absolute left-0 top-0 block h-full w-full bg-gradient-to-b from-[#faead2] to-transparent lg:hidden"></div>
        </div>
      </section>

      <HowItWorks />

      <section className="block overflow-x-hidden bg-[#f7f6f2]" id="plans">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-16">
          <div className="mx-auto mb-8 max-w-3xl text-center md:mb-12 lg:mb-16">
            <h1 className="text-6xl font-bold text-[#171516] sm:text-7xl">
              ESTILIDADE
            </h1>

            <p className="mt-4 text-sm text-[#322E2D] sm:text-base">
              É um novo conceito ousado, inovador, que vai ser a marca da
              Cutzone em todas as zonas de corte.
            </p>

            <p className="mt-4 text-sm text-[#322E2D] sm:text-base">
              É a união de estilo e identidade.
            </p>

            <p className="mt-4 text-sm text-[#322E2D] sm:text-base">
              Qual estilo você se identifica? Qual a sua estilidade?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            <div className="mx-auto flex w-full max-w-md flex-col items-start rounded-xl bg-[#D0C8C5]/40 p-8 shadow-xl">
              <div className="mb-4 rounded-[4px] bg-[#CD7F32] px-4 py-1.5">
                <p className="text-sm font-bold text-white sm:text-sm">Cria</p>
              </div>
              <p className="max-w-80 mb-6 max-h-12 text-base font-light text-[#322E2D] md:mb-10 lg:mb-12">
                Cria da comunidade, e por onde for, leva o estilo de onde
                cresceu consigo com muito orgulho.
              </p>
              <span className="mt-8 text-sm font-light sm:text-sm">
                A partir de
              </span>
              <h2 className="mb-5 text-3xl font-bold md:mb-6 lg:mb-8">
                R$ 16,50
                <span className="text-sm font-light sm:text-sm">/mês</span>
              </h2>
              <div
                onClick={() => setIsLoginOpen(true)}
                className="mb-5 w-full cursor-pointer rounded-xl bg-[#322E2D] px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8"
              >
                Comece já!
              </div>
              <div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Acesso a barbearias básicas</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">4 créditos de sobrancelha</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Faça um upgrade para barba</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Faça um upgrade para corte</p>
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-col items-start rounded-xl bg-[#D0C8C5]/40 p-8 shadow-xl">
              <div className="mb-4 rounded-[4px] bg-[#C0C0C0] px-4 py-1.5">
                <p className="text-sm font-bold text-white sm:text-sm">
                  Chavoso
                </p>
              </div>
              <p className="max-w-80 mb-6 max-h-12 text-base font-light text-[#322E2D] md:mb-10 lg:mb-12">
                Onde chega para tudo, chama atenção, o chavoso não passa
                despercebido.
              </p>
              <span className="mt-8 text-sm font-light sm:text-sm">
                A partir de
              </span>
              <h2 className="md:mb-6lg:mb-8 mb-5 text-3xl font-bold">
                R$ 23,90
                <span className="text-sm font-light sm:text-sm">/mês</span>
              </h2>
              <div
                onClick={() => setIsLoginOpen(true)}
                className="mb-5 w-full cursor-pointer rounded-xl bg-[#322E2D] px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8"
              >
                Comece já!
              </div>
              <div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">
                    Acesso a barbearias intermediárias
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">4 créditos de sobrancelha</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Faça um upgrade para barba</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Faça um upgrade para corte</p>
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-col items-start rounded-xl bg-[#D0C8C5]/40 p-8 shadow-xl">
              <div className="mb-4 rounded-[4px] bg-[#FFD700] px-4 py-1.5">
                <p className="text-sm font-bold text-white sm:text-sm">
                  Jogador
                </p>
              </div>
              <p className="max-w-80 mb-6 max-h-12 text-base font-light text-[#322E2D] md:mb-10 lg:mb-12">
                Camisa 10 e a faixa, caro e arrumado, confiança sempre la em
                cima.
              </p>
              <span className="mt-8 text-sm font-light sm:text-sm">
                A partir de
              </span>
              <h2 className="mb-5 text-3xl font-bold md:mb-6 lg:mb-8">
                R$ 38,00
                <span className="text-sm font-light sm:text-sm">/mês</span>
              </h2>
              <div
                onClick={() => setIsLoginOpen(true)}
                className="mb-5 w-full cursor-pointer rounded-xl bg-[#322E2D] px-6 py-3 text-center font-semibold text-white md:mb-6 lg:mb-8"
              >
                Comece já!
              </div>
              <div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Acesso a barbearias premium</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">4 créditos de sobrancelha</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Faça um upgrade para barba</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckOutlined />
                  <p className="text-base">Faça um upgrade para corte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
