"use client";

import Button from "@/components/atoms/Button/button";
import { Separator } from "@/components/ui/separator";
import useProfile from "@/hooks/queries/useProfile";
import { storageGet } from "@/store/services/storage";
import { useRouter, useSearchParams } from "next/navigation";
import UpdateModal from "./components/UpdateModal";
import { useEffect, useState } from "react";
import PasswordModal from "./components/PasswordModal";
import usePayment from "@/hooks/usePayment";
import useAllProducts from "@/hooks/queries/useAllProducts";
import { PlanEntity } from "@/common/entities/plan";
import { LoadingOutlined } from "@ant-design/icons";
import { getUserSubscriptions, updateUser } from "@/store/services/user";
import { sub } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserDoc } from "@/store/services/barberShop";
import { UserEntity } from "@/common/entities/user";
import { timestampToDate } from "@/utils/timestampToDate";
import { Timestamp } from "@/common/entities/timestamp";

const MeuPerfil = () => {
  const { data, isLoading } = useProfile(storageGet("uid") as string);
  const { getPortalUrl, getPlanName, loading } = usePayment();
  const { data: products, isLoading: isLoadingProducts } = useAllProducts();
  const queryClient = useQueryClient();
  const router = useRouter();
  const succeded = useSearchParams().get("success") === "true";

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPass, setIsOpenPass] = useState(false);
  const [planName, setPlanName] = useState("");

  const redirectToManageSubscription = async () => {
    const portalUrl = await getPortalUrl();
    router.push(portalUrl);
  };

  useEffect(() => {
    const getPlan = async () => {
      if (!isLoadingProducts) {
        const planName = await getPlanName(
          storageGet("uid") as string,
          products as PlanEntity[]
        );
        setPlanName(planName.planName);
      }
    };
    getPlan();
  }, [getPlanName, isLoadingProducts, products]);

  useEffect(() => {
    if (data?.suspended) {
      router.replace("/meu-perfil/gerenciamento");
    }
  }, [data, router]);

  const updateUserMutation = useMutation(
    async (data: Partial<UserEntity>) => {
      const res = updateUser({ ...data, id: storageGet("uid") as string });
      return res;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "profile",
          storageGet("uid") as string
        ]);
      }
    }
  );

  useEffect(() => {
    async function confirmSubscription() {
      if (succeded) {
        const subscriptions = await getUserSubscriptions(
          storageGet("uid") as string
        );
        if (subscriptions && subscriptions.length > 0) {
          const subscription = subscriptions.find(
            (sub) =>
              sub.status === "active" &&
              sub.items[0].price.product.name === planName
          );
          if (!subscription) return;

          const timeDiff =
            new Date().getTime() -
            timestampToDate(subscription.created as Timestamp).getTime();
          console.log(timeDiff);
          if (timeDiff > 120000) return;

          const benefits =
            subscription.items[0].price.product.metadata.benefits.split("||");

          const data = {
            id: storageGet("uid") as string,
            corteCredit: Number(benefits[1]),
            barbaCredit: Number(benefits[2]),
            sobrancelhaCredit: Number(benefits[3])
          };

          await updateUserMutation.mutateAsync(data);
        }
      }
    }

    if (!succeded || !planName || planName === "Autenticado") return;

    confirmSubscription();
  }, [succeded, planName]);

  if (isLoading || isLoadingProducts || planName === "")
    return <div>Carregando...</div>;

  if (loading.getCheckoutUrl || loading.getPortalUrl)
    return (
      <>
        <h1 className="text-3xl">Ajustes da conta</h1>
        <Separator className="mb-8 mt-4 bg-black" />
        <div className="flex h-[calc(100vh-240px)] items-center justify-center">
          <LoadingOutlined className="text-6xl text-primary-amber" />
        </div>
      </>
    );

  return (
    <div>
      <h1 className="text-3xl">Ajustes da conta</h1>
      <Separator className="mb-8 mt-4 bg-black" />
      <div className="mb-12">
        <h2 className="mb-4 text-2xl">Informações atuais</h2>
        <div className="mb-4 ml-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-10 lg:w-2/3">
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">Nome</h3>
            <p className="text-lg font-medium">{data?.name}</p>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">
              Email
            </h3>
            <p className="text-lg font-medium">{data?.email}</p>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">
              Telefone
            </h3>
            <p className="text-lg font-medium">{data?.phone}</p>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">CPF</h3>
            <p className="text-lg font-medium">{data?.cpf}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            borderColor="border-primary-amber"
            hover="hover:bg-primary-amber"
            className="text-sm sm:text-base"
            onClick={() => setIsOpen(true)}
          >
            Alterar nome
          </Button>
          <UpdateModal
            open={isOpen}
            onOpenChange={setIsOpen}
            curName={data?.name || ""}
            userId={storageGet("uid") as string}
          />
          <Button
            borderColor="border-primary-amber"
            hover="hover:bg-primary-amber"
            className="text-sm sm:text-base"
            onClick={() => setIsOpenPass(true)}
          >
            Redefinir senha
          </Button>
          <PasswordModal
            open={isOpenPass}
            onOpenChange={setIsOpenPass}
            email={data?.email || ""}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl">Requisições e planos</h2>
        <div className="mb-4 ml-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-10 lg:w-2/3">
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">
              Estilidade
            </h3>
            <p className="text-lg font-medium">
              {planName === "Autenticado" ? "Sem plano" : planName}
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">
              Créditos p/ corte
            </h3>
            <p className="text-lg font-medium">{data?.corteCredit}</p>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">
              Créditos p/ barba
            </h3>
            <p className="text-lg font-medium">{data?.barbaCredit}</p>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-light text-primary-amber">
              Créditos p/ sobrancelha
            </h3>
            <p className="text-lg font-medium">{data?.sobrancelhaCredit}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {planName && planName !== "Autenticado" && (
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              className="text-sm sm:text-base"
              onClick={redirectToManageSubscription}
            >
              Gerenciar inscrição
            </Button>
          )}
          {planName && planName === "Autenticado" && (
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              className="text-sm sm:text-base"
              onClick={() => router.push("/planos")}
            >
              Ver todos os planos
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;
