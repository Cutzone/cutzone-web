import { BarberShopEntity } from "@/common/entities/barberShopEntity";

export const userMapper = (apiData: any): BarberShopEntity => {
  return {
    id: apiData.uid,
    owner: apiData.owner,
    cpf: apiData.cpf,
    rg: apiData.rg,
    cnpj: apiData.cnpj,
    bank: apiData.bank,
    bankAccount: apiData.bankAccount,
    bankAgency: apiData.bankAgency,
    pix: apiData.pix,
    name: apiData.name,
    email: apiData.email,
    createdAt: apiData.createdAt
  };
};
