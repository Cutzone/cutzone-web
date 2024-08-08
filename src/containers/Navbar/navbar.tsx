"use client";

import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { Separator } from "@/components/ui/separator";
import {
  CalendarOutlined,
  DollarOutlined,
  FolderOutlined,
  HomeOutlined,
  ScissorOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { storageGet } from "@/store/services/storage";
import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export default function NavBar({ data }: { data: BarberShopEntity }) {
  const currentRoute = usePathname();
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    setComponentMounted(true);
  }, []);

  const notFinished = data?.flags?.includes(false);
  const aproved = data?.aproved;

  const role = storageGet("role") as string;

  if (data?.suspended)
    return (
      <nav className="fixed left-0 top-0 hidden h-screen w-full max-w-[16vw] border-r-2 border-primary-light-gray shadow-md xl:block">
        <header className="mb-2 flex items-center gap-1 p-6">
          {data?.mainPhoto && (
            <div className="relative h-10 w-10 overflow-hidden rounded">
              <Image
                src={data?.mainPhoto}
                fill
                className="object-contain"
                alt="Logo da barbearia"
              />
            </div>
          )}
          {!data?.mainPhoto && (
            <div className="h-10 w-10 rounded border-2 border-black">
              <UserOutlined style={{ color: "#000", fontSize: "16px" }} />
            </div>
          )}
          <div className="ml-2 flex flex-col">
            <h1 className="text-primary-amber">{data?.name}</h1>

            {componentMounted && (
              <p className="text-sm">
                {role === "barber" ? "Empresa" : "Cliente"}
              </p>
            )}
          </div>
        </header>
        <Separator className="bg-primary-light-gray" />
      </nav>
    );

  return (
    <nav className="fixed left-0 top-0 hidden h-screen w-full max-w-[16vw] border-r-2 border-primary-light-gray shadow-md xl:block">
      <header className="mb-10 flex items-center gap-1 p-6">
        {data?.mainPhoto && (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
            <Image
              src={data?.mainPhoto}
              fill
              className="object-contain"
              alt="Logo da barbearia"
            />
          </div>
        )}
        {data?.image && (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
            <Image
              src={data?.image}
              fill
              className="object-contain"
              alt="Perfil do usuario"
            />
          </div>
        )}
        {!data?.mainPhoto && !data?.image && !data?.mainPhoto && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-black text-black">
            <UserOutlined style={{ color: "#000", fontSize: "16px" }} />
          </div>
        )}
        <div className="ml-2 flex flex-col">
          <h1 className="text-primary-amber">{data?.name}</h1>

          {componentMounted && (
            <p className="text-sm">
              {role === "barber" ? "Empresa" : "Cliente"}
            </p>
          )}
        </div>
      </header>

      <div>
        <Separator className="bg-primary-light-gray" />
        {componentMounted && role === "barber" && (
          <>
            {!data?.rejected && (
              <>
                <Link
                  href={notFinished ? "#" : "/agenda"}
                  className={`relative flex items-center px-6 py-3 ${
                    notFinished ? "cursor-not-allowed bg-gray-300/70" : ""
                  } ${aproved ? "gap-5" : " justify-between"}`}
                >
                  <div className="flex items-center gap-5">
                    <CalendarOutlined
                      style={{ color: "#B7864B", fontSize: "20px" }}
                    />{" "}
                    Agenda
                  </div>
                  {currentRoute.startsWith("/agenda") && (
                    <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
                  )}
                  {!aproved && !notFinished && !notFinished && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <WarningOutlined className="animate-pulse cursor-default text-xl text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded bg-white">
                          <p>
                            Sua barbearia ainda está em processo de aprovação.{" "}
                            <br />
                            Confira mais informações na aba de informações
                            iniciais
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Link>
                <Separator className="bg-primary-light-gray" />
                <Link
                  href="/financas"
                  className={`relative flex items-center px-6 py-3 ${
                    notFinished ? "cursor-not-allowed bg-gray-300/70" : ""
                  } ${aproved ? "gap-5" : " justify-between"}`}
                >
                  <div className="flex items-center gap-5">
                    <DollarOutlined
                      style={{ color: "#B7864B", fontSize: "20px" }}
                    />{" "}
                    Finanças
                  </div>
                  {currentRoute === "/financas" && (
                    <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
                  )}
                  {!aproved && !notFinished && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <WarningOutlined className="animate-pulse cursor-default text-xl text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded bg-white">
                          <p>
                            Sua barbearia ainda está em processo de aprovação.{" "}
                            <br />
                            Confira mais informações na aba de informações
                            iniciais
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Link>
                <Separator className="bg-primary-light-gray" />
                <Link
                  href="/funcionarios"
                  className={`relative flex items-center px-6 py-3 ${
                    notFinished ? "cursor-not-allowed bg-gray-300/70" : ""
                  } ${aproved ? "gap-5" : " justify-between"}`}
                >
                  <div className="flex items-center gap-5">
                    <TeamOutlined
                      style={{ color: "#B7864B", fontSize: "20px" }}
                    />{" "}
                    Funcionários
                  </div>
                  {currentRoute === "/funcionarios" && (
                    <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
                  )}
                  {!aproved && !notFinished && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <WarningOutlined className="animate-pulse cursor-default text-xl text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded bg-white">
                          <p>
                            Sua barbearia ainda está em processo de aprovação.{" "}
                            <br />
                            Confira mais informações na aba de informações
                            iniciais
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Link>
                <Separator className="bg-primary-light-gray" />
                <Link
                  href="/servicos"
                  className={`relative flex items-center px-6 py-3 ${
                    notFinished ? "cursor-not-allowed bg-gray-300/70" : ""
                  } ${aproved ? "gap-5" : " justify-between"}`}
                >
                  <div className="flex items-center gap-5">
                    <ScissorOutlined
                      style={{ color: "#B7864B", fontSize: "20px" }}
                    />{" "}
                    Serviços
                  </div>
                  {currentRoute === "/servicos" && (
                    <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
                  )}
                  {!aproved && !notFinished && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <WarningOutlined className="animate-pulse cursor-default text-xl text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded bg-white">
                          <p>
                            Sua barbearia ainda está em processo de aprovação.{" "}
                            <br />
                            Confira mais informações na aba de informações
                            iniciais
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Link>
                <Separator className="bg-primary-light-gray" />
                <Link
                  href="/barbearia"
                  className={`relative flex items-center px-6 py-3 ${
                    notFinished ? "cursor-not-allowed bg-gray-300/70" : ""
                  } ${aproved ? "gap-5" : " justify-between"}`}
                >
                  <div className="flex items-center gap-5">
                    <HomeOutlined
                      style={{ color: "#B7864B", fontSize: "20px" }}
                    />{" "}
                    Minha barbearia
                  </div>
                  {currentRoute === "/barbearia" && (
                    <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
                  )}
                  {!aproved && !notFinished && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <WarningOutlined className="animate-pulse cursor-default text-xl text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent className="rounded bg-white">
                          <p>
                            Sua barbearia ainda está em processo de aprovação.{" "}
                            <br />
                            Confira mais informações na aba de informações
                            iniciais
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Link>{" "}
              </>
            )}
            <Separator className="bg-primary-light-gray" />
            {!aproved && (
              <Link
                href="/gerenciamento"
                className="relative flex items-center gap-5 px-6 py-3"
              >
                <FolderOutlined
                  style={{ color: "#B7864B", fontSize: "20px" }}
                />{" "}
                Informações iniciais
                {currentRoute.startsWith("/gerenciamento") && (
                  <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
                )}
              </Link>
            )}
          </>
        )}

        {componentMounted && role === "user" && (
          <Link
            href={"/meu-perfil"}
            className={`relative flex items-center gap-5 px-6 py-3`}
          >
            <div className="flex items-center gap-5">
              <UserOutlined style={{ color: "#B7864B", fontSize: "20px" }} />{" "}
              Meu perfil
            </div>
            {(currentRoute === "/meu-perfil" || currentRoute === "/planos") && (
              <div className="absolute right-0 top-0 h-full w-2 bg-primary-amber"></div>
            )}
          </Link>
        )}

        <Separator className="bg-primary-light-gray" />
      </div>
    </nav>
  );
}
