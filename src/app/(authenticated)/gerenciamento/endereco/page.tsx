"use client";

import Title from "@/components/atoms/Title";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingComponent from "@/components/atoms/Loading/loading";
import adressFormSchema from "@/validations/adress";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/atoms/Input/input";
import Button from "@/components/atoms/Button/button";
import useBarberShop from "@/hooks/queries/useBarberShop";
import {
  updateBarberDocFlags,
  updateUserDocAdress
} from "@/store/services/barberShop";
import { storageGet } from "@/store/services/storage";
import { useRouter } from "next/navigation";

type adressForm = z.infer<typeof adressFormSchema>;

export default function Endereco() {
  const [enableSearch, setEnableSearch] = useState(false);
  const [checked, setChecked] = useState(false);
  const queryClient = useQueryClient();
  const { data: barberShopData } = useBarberShop(storageGet("uid") as string);
  const progress = barberShopData?.flags?.filter(
    (flag) => flag === true
  ).length;

  const fetchAddressByCEP = async (cep: string) => {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  };
  const route = useRouter();
  const mutation = useMutation(
    () => {
      return updateBarberDocFlags({
        id: storageGet("uid") as string,
        flags: [true, true, false, false, false, false],
        aproved: false,
        status: "creating"
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "barberShop",
          storageGet("uid") as string
        ]);
        route.replace("/gerenciamento/informacoes");
      }
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues
  } = useForm<adressForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(adressFormSchema)
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

  const handleSubmitForm = async (formData: adressForm) => {
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

      updateUserDocAdress({ ...data, id: storageGet("uid") as string });
      await mutation.mutateAsync();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if ((progress !== 1 && progress !== 2) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [progress, route]);

  return (
    <div>
      <Title>Gostariamos de saber mais sobre a sua barbearia</Title>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div>
          <h2 className="mb-2 text-lg font-bold">Informações básicas</h2>
          <p className="mb-8">
            Primeiro vamos coletar suas informações básicas.
          </p>
          <div className="mb-5">
            <Input
              label="Nome da barbearia"
              placeholder="Brown Barbershop"
              formRegister={register}
              name="name"
              formErrors={errors}
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
            />
          </div>
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            mask="(99) 99999-9999"
            name="cellphone"
            formRegister={register}
            formErrors={errors}
          />
        </div>
        <div>
          <h2 className="mb-2 text-lg font-bold">Localização</h2>
          <p className="mb-8">
            Queremos saber onde a usa barbearia está localizada, para que
            possamos encontrar os clientes mais próximos.
          </p>
          <div>
            <div>
              <div
                className={`relative my-3 w-full rounded-full border-2 border-primary-amber p-2 ${
                  checked ? "bg-gray-200" : ""
                }`}
              >
                <label
                  className={`absolute left-5 top-[-14px] rounded-full bg-[#fafafa] px-2 font-bold text-primary-amber`}
                >
                  CEP
                </label>
                <input
                  type="text"
                  placeholder="xxxxx-xxx"
                  className={`w-full border-none bg-[#fafafa] px-4 focus:border-white ${
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
              <div className="mb-2 ml-4">
                {isFetching && <LoadingComponent />}
                {!isLoading && isError && (
                  <p className="text-red-500">CEP não encontrado</p>
                )}
              </div>
              <label className="mb-4 ml-4 flex items-center gap-1 self-start">
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
              />
              <Input
                bgColor="bg-[#fafafa]"
                textColor="text-primary-amber"
                borderColor="border-primary-amber"
                label="Número"
                placeholder="123"
                mask="99999"
                name="number"
                formRegister={register}
                formErrors={errors}
              />
            </div>
            <div className="flex justify-end py-8">
              <Button
                borderColor="border-[#B7864B]"
                textColor="text-black"
                hover="hover:bg-[#B7864B]"
                type="submit"
              >
                Salvar e continuar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
