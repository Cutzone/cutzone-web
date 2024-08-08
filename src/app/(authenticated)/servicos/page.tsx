"use client";

import useBarberShop from "@/hooks/queries/useBarberShop";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storageGet } from "@/store/services/storage";
import useAllServices from "@/hooks/queries/useAllServices";
import ServiceCard from "./ServiceCard";
import Title from "@/components/atoms/Title";
import Button from "@/components/atoms/Button/button";
import ServiceModal from "./serviceModal";

function Servicos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const route = useRouter();
  const { data: barberShopData } = useBarberShop(storageGet("uid") as string);
  const { data, isLoading } = useAllServices(storageGet("uid") as string);

  useEffect(() => {
    if (barberShopData?.flags?.includes(false) || barberShopData?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [barberShopData, route]);

  return (
    <div>
      <Title className="mb-6">Seus serviços</Title>
      <div className="mb-8">
        <Button
          borderColor="border-primary-amber"
          hover="hover:bg-primary-amber"
          onClick={() => setIsDialogOpen(true)}
        >
          Adicionar serviço
        </Button>
      </div>
      <div className="grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1600px]:grid-cols-5">
        {data?.map((service) => {
          return <ServiceCard key={service.id} service={service} />;
        })}
      </div>
      <ServiceModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        type="create"
        url=""
      />
    </div>
  );
}

export default Servicos;
