"use client";

import Button from "@/components/atoms/Button/button";
import useUser from "@/hooks/useUser";
import { createNewUserDocGoogle } from "@/store/services/barberShop";
import { storageSet } from "@/store/services/storage";
import { createUserDoc } from "@/store/services/user";
import {
  CloseOutlined,
  ScissorOutlined,
  UserOutlined
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import Input from "@/components/atoms/Input/input";
import signUpGoogleFormSchema from "@/validations/signUpGoogle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SignUpGoogleForm = z.infer<typeof signUpGoogleFormSchema>;

const SelecaoCadastro = () => {
  const { userObject } = useUser();
  console.log(userObject);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SignUpGoogleForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(signUpGoogleFormSchema)
  });

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutationUser = useMutation(
    (formData: SignUpGoogleForm) => {
      return createUserDoc({
        id: userObject?.id,
        email: userObject.email ?? "",
        name: userObject.name ?? "",
        cpf: formData.cpf,
        phone: formData.phone,
        createdAt: new Date(),
        role: "user",
        barbaCredit: 0,
        corteCredit: 0,
        sobrancelhaCredit: 0,
        favorites: [],
        tokens: [],
        suspended: false,
        subscriptionPeriodEnd: null
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["profile", userObject?.id]);
        storageSet("role", "user");
        router.push("/meu-perfil");
      }
    }
  );

  const mutationBarberShop = useMutation(
    () => {
      return createNewUserDocGoogle({
        id: userObject?.id,
        email: userObject.email ?? "",
        name: userObject.name ?? "",
        owner: userObject.owner ?? "",
        cpf: userObject.cpf ?? "",
        rg: userObject.rg ?? "",
        cnpj: userObject.cnpj ?? "",
        bank: userObject.bank ?? "",
        bankAccount: userObject.bank_account ?? "",
        bankAgency: userObject.bank_agency ?? "",
        pix: userObject.pix_key ?? "",
        createdAt: new Date(),
        flags: [true, false, false, false, false, false],
        aproved: false,
        rejected: false,
        rating: 0,
        tier: "null",
        suspended: false,
        status: "creating"
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["barberShop", userObject?.id]);
        storageSet("role", "barber");
        router.push("/gerenciamento");
      }
    }
  );

  const handleBarberShopClick = async () => {
    await mutationBarberShop.mutateAsync();
  };

  const handleUserSubmit = async (formData: SignUpGoogleForm) => {
    await mutationUser.mutateAsync(formData);
  };

  const handleUserClick = () => {
    setIsOpen(true);
  };

  return (
    <main className="grid min-h-screen grid-cols-2">
      <div className="col-span-0 relative hidden md:col-span-1 md:block">
        <Image
          src="/signUpUser.svg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="col-span-2 mt-[90px] flex items-center justify-center md:col-span-1">
        <div className="flex flex-col items-center justify-center px-32 text-center">
          <h1 className="mb-2 flex justify-center text-center text-2xl font-bold sm:text-3xl xl:text-5xl">
            Como deseja se cadastrar?
          </h1>
          <p className="mb-3 text-lg font-light text-[#171516]">
            Bem-vindo ao Cutzone! Escolha uma opção abaixo para se cadastrar e
            ter acesso a nossa plataforma:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              onClick={handleUserClick}
              className="flex items-center justify-center gap-2"
            >
              <UserOutlined />
              Cliente
            </Button>
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              onClick={handleBarberShopClick}
              className="flex items-center justify-center gap-2"
            >
              <ScissorOutlined />
              Barbearia
            </Button>
          </div>
        </div>
      </div>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="w-80 rounded-xl bg-white shadow">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <h1 className="">Precisamos de algumas Informações</h1>
              <div
                className="cursor-pointer font-bold"
                onClick={() => setIsOpen(false)}
              >
                <CloseOutlined />
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="text-[#171516]">
              Precisamos que insira seu CPF e telefone para estar de acordo com
              as nossas políticas de privacidade. Fique tranquilo, não iremos
              compartilhar seus dados com ninguém.
            </p>
          </DialogDescription>
          <form onSubmit={handleSubmit(handleUserSubmit)}>
            <Input
              bgColor="bg-white"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="CPF"
              placeholder="XXX.XXX.XX-XX"
              mask="999.999.999-99"
              name="cpf"
              formRegister={register}
              formErrors={errors}
              className="mb-8"
            />
            <Input
              bgColor="bg-[#fafafa]"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              label="Número de telefone"
              placeholder="(99) 99999-9999"
              mask="(99) 99999-9999"
              name="phone"
              formRegister={register}
              formErrors={errors}
            />
            <DialogFooter>
              <Button
                borderColor="border-[#B7864B]"
                textColor="text-black"
                hover="hover:bg-[#B7864B]"
                type="submit"
              >
                Criar conta
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default SelecaoCadastro;
