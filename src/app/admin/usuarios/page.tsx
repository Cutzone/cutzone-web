"use client";

import useAllUsers from "@/hooks/queries/useAllUsers";
import { columns } from "./columns";
import AdminInfoPage from "@/components/organisms/AdminInfoPage";
import { twMerge } from "tailwind-merge";
import useUsersByPlan from "@/hooks/queries/useUsersByPlan";

const Card = ({
  className,
  name,
  quantity
}: {
  className: string;
  name: string;
  quantity: number;
}) => {
  return (
    <div className={twMerge("h-full w-full rounded p-4", className)}>
      <div className="">
        <h3 className="mb-4 text-lg font-medium">{name}</h3>
        <div className="flex h-full items-center justify-center">
          <div className="flex items-end">
            <p className="text-3xl font-bold">{quantity}</p>
            <p className="ml-2">cliente{quantity === 1 ? "" : "s"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Usuarios = () => {
  const { data, isLoading, isFetching, dataUpdatedAt, refetch } = useAllUsers();
  const {
    data: dataByPlan,
    isLoading: isLoadingByPlan,
    refetch: refetchPlans
  } = useUsersByPlan();
  const customersCount = data?.length;

  const handleRefetch = () => {
    refetch();
    refetchPlans();
    console.log("teste");
  };

  if (isLoadingByPlan) return <div>Carregando...</div>;

  return (
    <AdminInfoPage
      columns={columns}
      data={data || []}
      isLoading={isLoading}
      title="Usuarios"
      isFetching={isFetching}
      dataUpdatedAt={dataUpdatedAt}
      onRefetch={handleRefetch}
    >
      <div className="mb-8 grid h-32 w-full grid-cols-4 gap-2">
        <Card
          className="bg-[#CD7F32]/80"
          name="Plano Cria"
          quantity={dataByPlan.standardTier?.length || 0}
        />
        <Card
          className="bg-[#C0C0C0]/80"
          name="Plano Chavoso"
          quantity={dataByPlan.basicTier?.length || 0}
        />
        <Card
          className="bg-[#FFD700]/80"
          name="Plano Jogador"
          quantity={dataByPlan.premiumTier?.length || 0}
        />
        <Card
          className="bg-secondary-amber/80"
          name="Total de clientes"
          quantity={customersCount || 0}
        />
      </div>
    </AdminInfoPage>
  );
};

export default Usuarios;
