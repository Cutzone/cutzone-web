import email from "@/common/validation/email";
import name from "@/common/validation/name";
import password from "@/common/validation/password";
import { z } from "zod";

export default z
  .object({
    name,
    email,
    phone: z
      .string({
        required_error: "Insira seu telefone"
      })
      .nonempty("Insira seu telefone"),
    cpf: z
      .string({
        required_error: "Insira seu CPF"
      })
      .nonempty("Insira seu CPF"),
    password,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não são iguais",
    path: ["confirmPassword"]
  });
