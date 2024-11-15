import { z } from "zod";

export const financeFormSchema = z.object({
  bank: z
    .string({ required_error: "Insira um nome" })
    .nonempty("Insira um nome"),
  bankAccount: z
    .string({ required_error: "Insira uma conta" })
    .nonempty("Insira uma conta"),
  bankAgency: z
    .string({ required_error: "Insira uma agência" })
    .nonempty("Insira um agência"),
  pix: z
    .string({ required_error: "Insira uma chave" })
    .nonempty("Insira uma chave")
});

export type FinanceForm = z.infer<typeof financeFormSchema>;
