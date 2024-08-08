import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import Image from "next/image";
interface ServiceCardProps {
  service: BarberServicesEntity;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="flex w-64 flex-col items-center justify-between gap-1 rounded-xl bg-white px-4 pb-6 pt-3 text-center shadow-lg">
      <div className="relative h-24 w-24 overflow-hidden rounded">
        <Image src={service.photo} alt="service" fill className="cover" />
      </div>
      <h2 className="text-xl text-primary-amber">{service.name}</h2>
      <p className="mb-1 text-sm text-gray-500">{service.description}</p>
      <p className="font-bold">R$ {service.price}</p>
      <div className="flex flex-wrap items-center justify-evenly gap-1">
        {service.category.map((categoria, i) => {
          return (
            <div
              key={i}
              className="rounded-full bg-primary-amber px-2 py-1 text-xs text-white"
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCard;
