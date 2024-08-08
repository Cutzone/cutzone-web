import { Timestamp } from "./timestamp";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  createdAt: Date;
  role: string;
  barbaCredit: number;
  corteCredit: number;
  sobrancelhaCredit: number;
  suspended?: boolean;
  favorites?: string[];
  tokens?: string[];
  subscriptionPeriodEnd: null | Date | Timestamp;
}
