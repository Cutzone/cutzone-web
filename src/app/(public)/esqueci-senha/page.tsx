"use client";

import useAuth from "@hooks/useAuth";
import Button from "@atoms/Button/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import forgotPasswordFormSchema from "@/validations/forgotPassword";
import Input from "@/components/atoms/Input/input";

type ForgotPasswordForm = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<ForgotPasswordForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(forgotPasswordFormSchema)
  });

  const handleSubmitForm = (data: ForgotPasswordForm) => {
    console.log(data);
    forgotPassword(data.email);
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-primary-amber/20">
      <div className="w-full max-w-sm rounded bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-primary-amber">
          Esqueci a senha
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Insira seu email para que possamos enviar um link de recuperação da
          sua senha
        </p>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <Input
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Email"
            placeholder="email@dominio.com"
            name="email"
            formRegister={register}
            formErrors={errors}
          />
          <Button
            borderColor="border-primary-amber w-1/2 self-center"
            hover="hover:bg-primary-amber"
            type="submit"
          >
            Enviar
          </Button>
        </form>
      </div>
    </main>
  );
}
