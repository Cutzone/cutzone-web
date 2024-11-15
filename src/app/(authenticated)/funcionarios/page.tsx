"use client";

import useAllColaborators from "@/hooks/queries/useAllColaborators";
import CollaboratorCard from "./collaboratorCard";
import Title from "@/components/atoms/Title";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storageGet } from "@/store/services/storage";
import Button from "@/components/atoms/Button/button";
import CollaboratorModal from "./collaboratorModal";

function Funcionarios() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: collaborators, isLoading } = useAllColaborators(
    storageGet("uid") as string
  );

  const route = useRouter();
  const { data } = useBarberShop(storageGet("uid") as string);

  useEffect(() => {
    if (data?.flags?.includes(false) || data?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [data, route]);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <Title className="mb-6">Seus funcionários</Title>
      <div className="mb-8">
        <Button
          borderColor="border-primary-amber"
          hover="hover:bg-primary-amber"
          onClick={() => setIsDialogOpen(true)}
        >
          Adicionar colaborador
        </Button>
      </div>
      <div className="grid grid-cols-1 justify-items-center gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1600px]:grid-cols-5">
        {collaborators?.map((collaborator) => {
          return (
            <CollaboratorCard
              key={collaborator.id}
              collaborator={collaborator}
            />
          );
        })}
      </div>
      <CollaboratorModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        type="create"
        url=""
      />
    </div>
  );
}

export default Funcionarios;
