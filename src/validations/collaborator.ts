import email from "@/common/validation/email";
import name from "@/common/validation/name";
import password from "@/common/validation/password";
import phone from "@/common/validation/phone";
import { z } from "zod";

export default z.object({
  name,
  age: z.coerce
    .number({
      required_error: "Insira sua idade",
      invalid_type_error: "Insira um valor numérico"
    })
    .min(12, "Insira uma idade válida")
    .max(200, "Insira uma idade válida"),
  email,
  pix: z
    .string({
      required_error: "Insira sua chave PIX",
    })
    .min(1, "Insira um CPF ou número válido"),
  profession: z.string({}).nonempty("Insira sua profissão")
  // desempenho: z.coerce
  //   .number({
  //     required_error: "Insira seu desempenho",
  //     invalid_type_error: "Insira um valor numérico"
  //   })
  //   .refine((data) => data >= 0 && data <= 5, {
  //     message: "Insira um valor entre 0 e 5"
  //   })
});
