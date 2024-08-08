"use client";

import Title from "@/components/atoms/Title";
import useProfile from "@/hooks/queries/useProfile";
import { storageGet } from "@/store/services/storage";
import { useRouter } from "next/navigation";
import React from "react";

export default function Gerenciamento() {
  const { data: user, isLoading } = useProfile(storageGet("uid") as string);
  const route = useRouter();

  if (isLoading) return <div>Carregando...</div>;

  if (user?.suspended) {
    return (
      <div>
        <Title>{user?.name}</Title>
        <h1 className="mb-1 text-xl">Seu acesso a plataforma foi suspenso.</h1>
        <p className="mb-4">
          Status: <span className="font-bold text-yellow-500">Suspensa</span>
        </p>
        <div className="mb-8">
          <p>Tente entrar em contato conosco para obter mais informações.</p>
        </div>
      </div>
    );
  } else route.replace("/meu-perfil");
}
