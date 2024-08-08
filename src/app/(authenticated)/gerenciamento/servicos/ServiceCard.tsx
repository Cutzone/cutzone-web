import Image from "next/image";
import React from "react";
import { DeleteOutlined } from "@ant-design/icons";

interface ServiceCardProps {
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  index: number;
  handleDeleteService: any;
  categorias: string[];
  imageURL: string;
}

const ServiceCard = ({
  nome,
  descricao,
  preco,
  duracao,
  index,
  handleDeleteService,
  categorias,
  imageURL
}: ServiceCardProps) => {
  return (
    <div className=" relative mb-4  flex w-full max-w-xl gap-4 break-all rounded-xl border border-primary-amber px-4 py-3 shadow-lg">
      <div className="relative h-20 w-20 shrink-0 self-center overflow-hidden rounded-xl border border-primary-amber bg-gray-500 sm:h-44 sm:w-44">
        <Image src={imageURL} fill className="contain" alt="serviço" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-bold text-primary-amber sm:text-lg">
          {nome}
        </h2>
        <p className="text-xs text-gray-500 sm:text-sm">{descricao}</p>
        <p>{duracao} min</p>
        <p className="text-base font-bold sm:text-lg">R$ {preco}</p>
        <div className="flex flex-wrap gap-2">
          {categorias.map((categoria) => {
            return (
              <div
                className="rounded-full border-2 border-primary-amber bg-primary-amber px-1 py-[2px] text-xs text-white first-letter:uppercase"
                key={categoria}
              >
                <p>{categoria}</p>
              </div>
            );
          })}
        </div>
      </div>
      <p
        className="absolute left-4 top-1 cursor-pointer items-center text-2xl font-bold text-red-500 transition-all hover:text-red-700 sm:right-4"
        onClick={() => handleDeleteService(index)}
      >
        <DeleteOutlined />
      </p>
    </div>
  );
};

export default ServiceCard;
