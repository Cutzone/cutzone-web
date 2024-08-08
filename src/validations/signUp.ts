import email from "@/common/validation/email";
import name from "@/common/validation/name";
import password from "@/common/validation/password";
import phone from "@/common/validation/phone";
import { z } from "zod";

export default z
  .object({
    owner: z
      .string({ required_error: "Insira um nome" })
      .nonempty("Insira um nome"),
    name,
    email,
    cellphone: z
      .string({ required_error: "Insira um telefone" })
      .nonempty("Insira um telefone"),
    cpf: z
      .string({ required_error: "Insira um CPF" })
      .nonempty("Insira um CPF"),
    cnpj: z.string(),
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
      .nonempty("Insira uma chave"),
    rg: z.string({ required_error: "Insira um RG" }).nonempty("Insira um RG"),
    address: z
      .string({ required_error: "Insira seu logradouro" })
      .nonempty("Insira seu logradouro"),
    cep: z.string({ required_error: "Insira seu CEP" }),
    number: z
      .string({ required_error: "Insira seu número" })
      .nonempty("Insira seu número"),
    neighborhood: z
      .string({ required_error: "Insira seu bairro" })
      .nonempty("Insira seu bairro"),
    city: z
      .string({ required_error: "Insira sua cidade" })
      .nonempty("Insira sua cidade"),
    state: z
      .string({ required_error: "Insira sua UF" })
      .nonempty("Insira seu estado"),
    password,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não são iguais",
    path: ["confirmPassword"]
  });
