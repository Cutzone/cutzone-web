"use client";

import useAuth from "@hooks/useAuth";
import Button from "@atoms/Button/button";
import FormErrorLabel from "@atoms/FormError/formError";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SignInFormSchema from "@/validations/signIn";

type SignInForm = z.infer<typeof SignInFormSchema>;

export default function LoginPage() {
  const { loginWithGoogleUser, loginWithInternalService, loading } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SignInForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(SignInFormSchema)
  });

  const handleSubmitForm = (data: SignInForm) => {
    loginWithInternalService(data.email, data.password);
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-5">
      <h1 className="text-2xl font-bold">LOGIN PAGE</h1>
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <input {...register("email")} type="text" placeholder="email" />
        {errors.email?.message && (
          <FormErrorLabel>{String(errors.email?.message)}</FormErrorLabel>
        )}
        <input
          {...register("password")}
          type="password"
          placeholder="password"
        />
        {errors.password?.message && (
          <FormErrorLabel>{String(errors.password?.message)}</FormErrorLabel>
        )}
        <Button>Entrar</Button>
      </form>
      <div className="flex gap-5">
        <Link href="/forgot-password">Esqueci a senha</Link>
        <Link href="/sign-up">Sign up</Link>
      </div>
      <Button onClick={loginWithGoogleUser}>ENTRAR COM GOOGLE</Button>
    </main>
  );
}
