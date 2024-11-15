import name from "@/common/validation/name";
import { z } from "zod";

export default z.object({
  name,
  cellphone: z
    .string({ required_error: "Insira um telefone" })
    .nonempty("Insira um telefone")
    .refine((data) => data.length >= 14, {
      message: "Insira um telefone válido"
    }),
  address: z
    .string({ required_error: "Insira seu logradouro" })
    .nonempty("Insira seu logradouro"),
  cep: z.string({
    required_error: "Insira seu CEP"
  }),
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
    .nonempty("Insira seu estado")
});
