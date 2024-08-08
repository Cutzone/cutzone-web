import { z } from "zod";

export default z.object({
  phone: z
    .string({
      required_error: "Insira seu telefone"
    })
    .nonempty("Insira seu telefone"),
  cpf: z
    .string({
      required_error: "Insira seu CPF"
    })
    .nonempty("Insira seu CPF")
});
