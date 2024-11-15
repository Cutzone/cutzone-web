"use client";

import Button from "@/components/atoms/Button/button";
import Input from "@/components/atoms/Input/input";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import LoadingComponent from "@/components/atoms/Loading/loading";
import signUpFormSchema from "@/validations/signUp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import ReactInputMask from "react-input-mask";
import { storageGet } from "@/store/services/storage";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

type signUpForm = z.infer<typeof signUpFormSchema>;

export default function CadastroPage() {
  const [enableSearch, setEnableSearch] = useState(false);
  const [checked, setChecked] = useState(false);
  const fetchAddressByCEP = async (cep: string) => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  };
  const { createUserWithInternalService } = useAuth();

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: signUpForm & { latitude: number; longitude: number }) => {
      return createUserWithInternalService(data);
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues
  } = useForm<signUpForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(signUpFormSchema)
  });

  const { data, isLoading, isFetching, isError, refetch } = useQuery(
    ["adress"],
    () => fetchAddressByCEP(getValues("cep")),
    {
      cacheTime: 0,
      enabled: enableSearch,
      refetchOnWindowFocus: false,
      retry: 1
    }
  );

  const [showPassword, setShowPassword] = useState(false);

  const hasPasswordError = errors.password?.message;

  async function handleSubmitForm(formData: signUpForm) {
    try {
      const fullAddress = `${formData.address}, ${formData.number}, ${formData.neighborhood}, ${formData.city}, ${formData.state}`;
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: fullAddress,
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
          }
        }
      );

      const lat = response.data.results[0].geometry.location.lat;
      const long = response.data.results[0].geometry.location.lng;
      const data = { ...formData, latitude: lat, longitude: long };
      await mutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="mt-[90px] grid min-h-screen grid-cols-2">
      <div className="col-span-0 relative hidden md:col-span-1 md:block">
        <Image
          src="/imagcadastro.svg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="col-span-2 py-12 md:col-span-1">
        <h1 className="my-5 flex justify-center text-center text-2xl font-bold sm:text-3xl xl:text-5xl">
          Cadastre seu negócio
        </h1>
        <p className="my-5 flex justify-center text-center text-xs font-bold sm:text-base">
          Campos com <span className="m-1 text-red-500">*</span> são
          obrigatórios
        </p>

        <form
          className="flex flex-col items-center justify-start gap-3 px-8 py-4 xl:px-24 2xl:px-32"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Nome do responsável da empresa"
            placeholder="Insira o nome"
            name="owner"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Nome da empresa"
            placeholder="Insira o nome"
            name="name"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Email do responsável da empresa"
            placeholder="teste@email.com"
            name="email"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Telefone"
            placeholder="(xx) xxxxx-xxxx"
            mask="(99) 99999-9999"
            name="cellphone"
            formRegister={register}
            formErrors={errors}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="RG"
            placeholder="x.xxx.xxx"
            mask="9.999.999"
            name="rg"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="CPF"
            placeholder="xxx.xxx.xxx-xx"
            mask="999.999.999-99"
            name="cpf"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="CNPJ"
            placeholder="xx.xxx.xxx/xxxx-xx"
            mask="99.999.999/9999-99"
            name="cnpj"
            formRegister={register}
            formErrors={errors}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Banco"
            placeholder="Insira o nome"
            name="bank"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Conta bancária"
            placeholder="Insira o numero da conta"
            mask="999999999999"
            name="bankAccount"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Agência bancária"
            placeholder="Insira o numero da agência"
            mask="9999"
            name="bankAgency"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Chave Pix"
            placeholder="Insira a chave"
            name="pix"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />

          <div className="w-full">
            <div
              className={`relative my-3 w-full rounded-full border-2 border-primary-amber p-2 ${
                checked ? "bg-gray-200" : ""
              }`}
            >
              <label
                className={`absolute left-5 top-[-14px] rounded-full bg-[#fafafa] px-2 font-bold text-primary-amber`}
              >
                CEP <span className="text-red-500">*</span>
              </label>
              <ReactInputMask
                type="text"
                mask={checked ? "" : "99999-999"}
                placeholder="xxxxx-xxx"
                className={`w-full border-none bg-[#fafafa] px-4 py-1 focus:border-white ${
                  checked ? "bg-gray-200" : ""
                }`}
                disabled={checked}
                {...register("cep")}
                onBlur={() => {
                  if (enableSearch && !isFetching) {
                    refetch();
                    return;
                  }

                  if (!enableSearch) {
                    setEnableSearch(true);
                  }
                }}
              />
            </div>

            <div className="mb-2">
              {isFetching && <LoadingComponent />}
              {!isLoading && isError && (
                <FormErrorLabel>CEP não encontrado</FormErrorLabel>
              )}
            </div>
            <label className="ml-4 flex items-center gap-1 self-start">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);

                  if (!checked) {
                    setValue("cep", "");
                  }
                }}
              />
              Não possuo CEP
            </label>
          </div>
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Logradouro"
            value={data?.logradouro}
            setValue={setValue}
            disabled={!checked}
            name="address"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Bairro"
            value={data?.bairro}
            setValue={setValue}
            disabled={!checked}
            name="neighborhood"
            formRegister={register}
            formErrors={errors}
            isRequired={true}
          />
          <div className="flex w-full gap-3">
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="UF"
              value={data?.uf}
              setValue={setValue}
              disabled={!checked}
              name="state"
              formRegister={register}
              formErrors={errors}
              mask="aa"
              isRequired={true}
            />
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="Cidade"
              value={data?.localidade}
              setValue={setValue}
              disabled={!checked}
              name="city"
              formRegister={register}
              formErrors={errors}
              isRequired={true}
            />
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="Numero"
              placeholder="123"
              name="number"
              formRegister={register}
              formErrors={errors}
              mask="99999"
              isRequired={true}
            />
          </div>
          <div className="relative w-full">
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="Senha"
              placeholder="********"
              name="password"
              type={showPassword ? "text" : "password"}
              formRegister={register}
              formErrors={errors}
              isRequired={true}
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
            isRequired={true}
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
    </main>
  );
}
