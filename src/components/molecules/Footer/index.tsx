import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-[#322E2D] p-6 font-light text-white">
      <div className="fr mx-auto grid w-full max-w-7xl place-items-start gap-10 py-6 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="mdmx-auto flex flex-col  px-6 text-sm lg:text-base">
          <Link href="/" className="">
            <Image
              src="/logo-cutzone.png"
              alt="Logo"
              width={150}
              height={50}
              className="mb-2 cursor-pointer bg-white p-2"
            />
          </Link>
          <p>Cutzone LTDA.</p>
          <p>Av. Flor de Santana, 357</p>
          <p>+55 (81) 9678-3707</p>
        </div>
        <Separator
          orientation="vertical"
          className="hidden bg-white md:block"
        />
        <Separator
          orientation="horizontal"
          className="block bg-white md:hidden"
        />
        <div className="flex flex-col px-6 text-sm md:mx-auto lg:text-base">
          <h1 className="mb-4 text-xl font-medium">Acesso rápido</h1>
          <Link href="/sou-barbearia" className="mb-1 hover:underline">
            Sou uma barbearia
          </Link>
          <Link href="/cadastro" className="mb-1 hover:underline">
            Cadastro - barbearia
          </Link>
          <Link href="/cadastro-usuario" className="mb-1 hover:underline">
            Cadastro - usuário
          </Link>
        </div>
        <Separator
          orientation="vertical"
          className="hidden bg-white md:block"
        />
        <Separator
          orientation="horizontal"
          className="block bg-white md:hidden"
        />
        <div className="flex flex-col px-6  md:mx-auto">
          <h1 className="mb-4 text-xl font-medium">Redes sociais</h1>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/cutzonebrasil?igsh=M2lhanc0ejBvcWdr">
              <Image
                src="/insta-icon.svg"
                width={30}
                height={30}
                alt="insta icon"
              />
            </a>
            <a href="https://wa.me/558196783707">
              <Image
                src="/zap-icon.svg"
                width={30}
                height={30}
                alt="zap icon"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
