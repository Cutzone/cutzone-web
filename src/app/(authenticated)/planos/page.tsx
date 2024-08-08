"use client";

import { PlanEntity } from "@/common/entities/plan";
import Button from "@/components/atoms/Button/button";
import LoadingComponent from "@/components/atoms/Loading/loading";
import PlanCard from "@/components/atoms/PlanCard";
import Subtitle from "@/components/atoms/Subtitle";
import Title from "@/components/atoms/Title";
import useAllProducts from "@/hooks/queries/useAllProducts";
import useProfile from "@/hooks/queries/useProfile";
import usePayment from "@/hooks/usePayment";
import { storageGet } from "@/store/services/storage";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { set } from "date-fns";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const planCardData = [
  {
    name: "Cria",
    description:
      "Experimente nossos serviços básicos com acesso a barbearias selecionadas.",
    price: "16,50",
    tier: "basic"
  },
  {
    name: "Chavoso",
    description:
      "Aproveite o acesso a barbearias intermediárias com serviços de qualidade.",
    price: "23,90",
    tier: "intermediate"
  },
  {
    name: "Jogador",
    description:
      "Desfrute de uma experiência premium com acesso exclusivo às melhores barbearias!",
    price: "38,00",
    tier: "premium"
  }
];

const Planos = () => {
  const [planName, setPlanName] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedServices, setSelectedServices] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const router = useRouter();
  const { data } = useProfile(storageGet("uid") as string);
  const { data: products, isLoading: isLoadingProducts } = useAllProducts();

  const { getPortalUrl, getCheckoutUrl, getPlanName, loading } = usePayment();

  const selectedPlan = products?.find((curr) => {
    return (
      curr.benefits[0] === selectedTier &&
      Number(curr.benefits[1]) === selectedServices[0] &&
      Number(curr.benefits[2]) === selectedServices[1] &&
      Number(curr.benefits[3]) === selectedServices[2]
    );
  });

  const RedirectToCheckout = async () => {
    if (!selectedPlan) return;

    const checkoutUrl = await getCheckoutUrl(selectedPlan.priceId);
    router.push(checkoutUrl);
  };

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

  const handleSelectService = (index: number) => {
    const newSelectedServices = [...selectedServices];
    newSelectedServices[index] = newSelectedServices[index] === 0 ? 4 : 0;
    setSelectedServices(newSelectedServices as [number, number, number]);
  };

  useEffect(() => {
    if (data?.suspended) {
      router.replace("/meu-perfil/gerenciamento");
    }
  }, [data, router]);

  if (loading.getCheckoutUrl || loading.getPortalUrl)
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center">
        <LoadingOutlined className="text-6xl text-primary-amber" />
      </div>
    );

  const hasSelectedServices = selectedServices.some((service) => service === 4);

  return (
    <div>
      <div
        className="mb-2 flex w-16 cursor-pointer items-center gap-2 text-lg"
        onClick={() => router.push("/meu-perfil")}
      >
        <ArrowLeftOutlined /> Voltar
      </div>
      <Title className="mb-8">Monte seu plano ideal</Title>

      <div className="flex flex-col gap-12">
        <div>
          <Subtitle className="mb-4 text-2xl font-medium">
            Selecione o tier das barbearias
          </Subtitle>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {planCardData.map((plan, index) => {
              return (
                <PlanCard
                  tier={plan.name}
                  description={plan.description}
                  price={plan.price}
                  onClick={() =>
                    setSelectedTier((prev) =>
                      prev === plan.tier ? "" : plan.tier
                    )
                  }
                  key={index}
                  isSelected={selectedTier === plan.tier}
                />
              );
            })}
          </div>
        </div>
        <div>
          <Subtitle className="mb-4 text-2xl font-medium">
            Selecione os tipos de serviços
          </Subtitle>
          <div className="flex items-center gap-2">
            <div
              className={`w-fit cursor-pointer rounded-3xl border  px-4 py-2 text-xl ${
                selectedServices[0] === 4
                  ? "border-black bg-primary-amber text-white"
                  : "border-primary-amber"
              }`}
              onClick={() => handleSelectService(0)}
            >
              <p>Corte</p>
            </div>
            <div
              className={`w-fit cursor-pointer rounded-3xl border  px-4 py-2 text-xl ${
                selectedServices[1] === 4
                  ? "border-black bg-primary-amber text-white"
                  : "border-primary-amber"
              }`}
              onClick={() => handleSelectService(1)}
            >
              <p>Barba</p>
            </div>
            <div
              className={`w-fit cursor-pointer rounded-3xl border  px-4 py-2 text-xl ${
                selectedServices[2] === 4
                  ? "border-black bg-primary-amber text-white"
                  : "border-primary-amber"
              }`}
              onClick={() => handleSelectService(2)}
            >
              <p>Sobrancelha</p>
            </div>
          </div>
        </div>

        <div>
          <Subtitle className="mb-4 text-2xl font-medium">
            Plano Escolhido
          </Subtitle>
          <p className="text-xl font-medium">
            {" "}
            {!hasSelectedServices &&
              !selectedTier &&
              "Selecione o tier das barbearias e os tipos de serviço"}
            {!hasSelectedServices &&
              selectedTier &&
              "Selecione os tipos de serviço"}
            {!selectedTier &&
              hasSelectedServices &&
              "Selecione o tier das barbearias"}
            {selectedPlan && selectedPlan?.name}
          </p>
          <p>
            <span className="text-2xl font-bold text-primary-amber">
              R$ {selectedPlan?.price ? selectedPlan.price : "--,--"}
            </span>
            /mês
          </p>
        </div>

        <Button
          className="w-fit border-primary-amber py-3 text-xl font-medium hover:bg-primary-amber"
          onClick={RedirectToCheckout}
          disabled={!selectedPlan}
        >
          Assinar plano
        </Button>
      </div>
    </div>
  );
};

export default Planos;
