import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  GoogleOutlined,
  ScissorOutlined,
  UserOutlined
} from "@ant-design/icons";

import Input from "@/components/atoms/Input/input";
import { Separator } from "@/components/ui/separator";
import Button from "@/components/atoms/Button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import SignInFormSchema from "@/validations/signIn";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { HeaderProps } from "./types";

type SignInForm = z.infer<typeof SignInFormSchema>;

const Header = ({
  isSingUpOpen,
  setIsSingUpOpen,
  isLoginOpen,
  setIsLoginOpen
}: HeaderProps) => {
  const { loginWithGoogleUser, loginWithInternalService } = useAuth();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SignInForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SignInFormSchema)
  });

  const currentPath = usePathname();
  const [showPassword, setShowPassword] = useState(false);
  const isBarberPage = currentPath === "/sou-barbearia";

  const hasPasswordError = errors.password?.message;

  const handleSubmitForm = (data: SignInForm) => {
    loginWithInternalService(data.email, data.password);
  };

  return (
    <header className="fixed left-0 top-0 z-20 overflow-x-hidden">
      <div className="h-auto w-screen bg-[#322E2D] py-2 text-white shadow-lg">
        <nav className="font-inter mx-auto h-auto w-full max-w-[1396px] lg:relative lg:top-0">
          <div className="flex items-center justify-between px-6 py-6 lg:flex-row lg:py-4">
            <Link href="/" className="">
              <Image
                src="/logo-cutzone.png"
                alt="Logo"
                width={150}
                height={50}
                className="cursor-pointer bg-white p-2"
              />
            </Link>

            <div className="flex flex-row items-start lg:mt-0 lg:flex lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Link
                href={isBarberPage ? "/" : "/sou-barbearia"}
                className="2 ml-5 rounded-full border-2 border-primary-amber bg-transparent px-4 py-2 text-center text-xs font-semibold text-gray-200 transition hover:bg-primary-amber hover:text-[#171516] sm:text-base md:ml-10 lg:ml-4"
              >
                Sou um{isBarberPage ? " cliente" : "a barbearia"}
              </Link>
              <Dialog onOpenChange={setIsLoginOpen} open={isLoginOpen}>
                <DialogTrigger className="ml-5 rounded-full border-2 border-primary-amber bg-transparent px-4 py-2 text-center text-xs font-semibold text-gray-200 transition hover:bg-primary-amber hover:text-[#171516] sm:text-base md:ml-10 lg:ml-4">
                  Entrar
                </DialogTrigger>
                <DialogContent
                  className="w-80 rounded-xl bg-white shadow"
                  onOpenAutoFocus={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <h1 className="">Fazer login</h1>
                      <div
                        className="cursor-pointer font-bold"
                        onClick={() => setIsLoginOpen(false)}
                      >
                        <CloseOutlined />
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <p className="text-[#171516]">
                      Entre com seu email e senha
                    </p>
                  </DialogDescription>
                  <form
                    onSubmit={handleSubmit(handleSubmitForm)}
                    className="flex flex-col"
                  >
                    <Input
                      bgColor="bg-white"
                      textColor="text-primary-amber"
                      borderColor="border-primary-amber"
                      label="Email"
                      placeholder="nome@email.com"
                      name="email"
                      formRegister={register}
                      formErrors={errors}
                    />
                    <div className="relative">
                      <Input
                        bgColor="bg-white"
                        textColor="text-primary-amber"
                        borderColor="border-primary-amber"
                        label="Senha"
                        placeholder="********"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        formRegister={register}
                        formErrors={errors}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-2 flex items-center px-3 text-sm leading-5 ${
                          hasPasswordError ? "mb-[14px]" : ""
                        }`}
                      >
                        {showPassword ? (
                          <EyeInvisibleOutlined
                            color="#000"
                            className="outline-none"
                          />
                        ) : (
                          <EyeOutlined color="#000" className="outline-none" />
                        )}
                      </button>
                    </div>
                    <Link
                      href="/esqueci-senha"
                      className="mb-2 ml-2 cursor-pointer self-end text-xs text-gray-500 underline"
                    >
                      Esqueceu a senha?
                    </Link>
                    <div className="max-w-40 flex justify-center">
                      <Button
                        borderColor="border-primary-amber"
                        hover="hover:bg-primary-amber"
                        type="submit"
                      >
                        Entrar
                      </Button>
                    </div>
                  </form>
                  <div className="items center flex gap-2">
                    <Separator className="bg-[#171516]" />
                    <p>ou</p>
                    <Separator className="bg-[#171516]" />
                  </div>
                  <div className="grid grid-cols-1  gap-4">
                    {/* <button className="flex items-center justify-center gap-2 rounded bg-primary-amber p-2">
                      <AppleOutlined className="text-xl" />
                    </button> */}
                    <button
                      className="flex items-center justify-center gap-2 rounded bg-primary-amber p-2"
                      onClick={() => {
                        setIsLoginOpen(false);
                        setIsSingUpOpen(false);
                        loginWithGoogleUser();
                      }}
                    >
                      <GoogleOutlined className="text-xl" />
                    </button>

                    {/* <button
                      className="flex items-center justify-center gap-2 rounded bg-primary-amber p-2"
                      onClick={() => {
                        setIsLoginOpen(false);
                        setIsSingUpOpen(false);
                        loginWithFacebookUser();
                      }}
                    >
                      <FacebookOutlined className="text-xl" />
                    </button> */}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="mx-auto">
                      <p className="text-[#171516]">
                        Não tem uma conta?{" "}
                        <span
                          className="cursor-pointer text-primary-amber underline"
                          onClick={() => {
                            setIsLoginOpen(false);
                            setIsSingUpOpen(true);
                          }}
                        >
                          Cadastre-se
                        </span>
                      </p>
                    </div>
                    <div className="mx-auto text-[10px]">
                      <p className="text-[#171516]">
                        <span
                          className="cursor-pointer text-primary-amber underline"
                          onClick={() => {
                            router.push("/termos-de-uso");
                          }}
                        >
                          Termos de Uso
                        </span>{" "}
                        &{" "}
                        <span
                          className="cursor-pointer text-primary-amber underline"
                          onClick={() => {
                            router.push("/politica-de-privacidade");
                          }}
                        >
                          Política de Privacidade
                        </span>
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog onOpenChange={setIsSingUpOpen} open={isSingUpOpen}>
                <DialogContent className="w-80 rounded-xl bg-white shadow">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <h1 className="">Como você deseja se cadastrar?</h1>
                      <div
                        className="cursor-pointer font-bold"
                        onClick={() => setIsSingUpOpen(false)}
                      >
                        <CloseOutlined />
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <p className="text-[#171516]">
                      Bem-vindo ao Cutzone! Escolha uma opção abaixo para se
                      cadastrar e ter acesso a nossa plataforma:
                    </p>
                  </DialogDescription>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      borderColor="border-primary-amber"
                      hover="hover:bg-primary-amber"
                      onClick={() => {
                        router.push("/cadastro-usuario");
                        setIsSingUpOpen(false);
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      <UserOutlined />
                      Cliente
                    </Button>
                    <Button
                      borderColor="border-primary-amber"
                      hover="hover:bg-primary-amber"
                      onClick={() => {
                        router.push("/cadastro");
                        setIsSingUpOpen(false);
                      }}
                      className="flex items-center justify-center gap-2"
                    >
                      <ScissorOutlined />
                      Barbearia
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
