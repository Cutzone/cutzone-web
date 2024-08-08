import { BarberServicesEntity } from "./barberServicesEntity";
import { BarberShopEntity } from "./barberShopEntity";
import { CollaboratorEntity } from "./collaborator";
import { Timestamp } from "./timestamp";

export interface AppoitmentCompanyEntity {
  id: string;
  companyId: string;
  startTime: Date | string | Timestamp;
  endTime: Date | string | Timestamp;
  status: string;
  idService: string;
  idClient: string;
  idEmployee: string;
  client?: any;
  service?: BarberServicesEntity;
  employee?: CollaboratorEntity;
  company?: BarberShopEntity;
  total?: number;
}
