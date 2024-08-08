import { Timestamp } from "./timestamp";

export interface BarberShopEntity {
  id: string;
  flags?: boolean[];
  owner: string;
  name: string;
  email: string;
  cellphone?: string;
  cep?: string;
  address?: string;
  neighborhood?: string;
  state?: string;
  city?: string;
  number?: string;
  rg: string;
  cpf: string;
  cnpj?: string;
  bank: string;
  bankAccount: string;
  bankAgency: string;
  pix: string;
  createdAt: Date | Timestamp;
  description?: string;
  mainPhoto?: string;
  image?: string; // from normal user (debito tecnico)
  photos?: string[];
  workDays?: boolean[];
  startTimeWork?: string;
  endTimeWork?: string;
  lunchBreakInterval?: boolean;
  lunchBreakIntervalStart?: string;
  lunchBreakIntervalEnd?: string;
  aproved?: boolean;
  aprovedAt?: Date | Timestamp;
  rejected?: boolean;
  rejectedAt?: Date | Timestamp;
  reason?: string;
  rating?: number;
  tier?: string;
  cancelTime?: number;
  maxAppointmentTime?: number;
  latitude?: number;
  longitude?: number;
  suspended?: boolean;
  style?: string;
  status?:
    | "creating"
    | "awaiting approval"
    | "approved"
    | "rejected"
    | "suspended";
}
