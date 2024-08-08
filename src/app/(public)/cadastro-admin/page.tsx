"use client";

import Button from "@/components/atoms/Button/button";
import Input from "@/components/atoms/Input/input";
import Image from "next/image";
import { useState } from "react";
import signUpUserFormSchema from "@/validations/signUpUser";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

type signUpUserForm = z.infer<typeof signUpUserFormSchema>;

export default function CadastroPage() {
  const { createUser } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: signUpUserForm) => {
      return createUser(data, "admin");
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["users"]);
      }
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<signUpUserForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(signUpUserFormSchema)
  });

  async function handleSubmitForm(data: signUpUserForm) {
    await mutation.mutateAsync(data);
  }
  const currentPath = usePathname();
  const [showPassword, setShowPassword] = useState(false);

  const hasPasswordError = errors.password?.message;
  return (
    <main className="mt-[90px] grid min-h-screen grid-cols-2">
      <div className="col-span-0 relative hidden md:col-span-1 md:block">
        <Image
          src="/signUpUser.svg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="col-span-2 flex items-center md:col-span-1">
        <div className="flex-1">
          <h1 className="my-5 flex justify-center text-center text-2xl font-bold sm:text-3xl xl:text-5xl">
            Cadastro de Administrador
          </h1>
          <form
            className="flex flex-col items-center justify-start gap-3 px-8 py-4 xl:px-24 2xl:px-32"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="Nome"
              placeholder="Insira o nome"
              name="name"
              formRegister={register}
              formErrors={errors}
            />
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="Email"
              placeholder="teste@email.com"
              name="email"
              formRegister={register}
              formErrors={errors}
            />
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="CPF"
              placeholder="XXX.XXX.XXX-XX"
              mask="999.999.999-99"
              name="cpf"
              formRegister={register}
              formErrors={errors}
            />
            <div className="relative w-full">
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
                  <EyeInvisibleOutlined color="#000" className="outline-none" />
                ) : (
                  <EyeOutlined color="#000" className="outline-none" />
                )}
              </button>
            </div>
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-[#B7864B]"
              label="Confirmar senha"
              type={showPassword ? "text" : "password"}
              placeholder="xxxxxxxx"
              name="confirmPassword"
              formRegister={register}
              formErrors={errors}
            />
            <Button
              borderColor="border-[#B7864B]"
              textColor="text-black"
              hover="hover:bg-[#B7864B]"
              type="submit"
            >
              Criar conta
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
