import { z } from "zod";

export default z.object({
  name: z.string({}).nonempty("Insira um nome"),
  description: z.string({}).nonempty("Insira uma descrição"),
  price: z.coerce
    .number({
      required_error: "Insira o preço",
      invalid_type_error: "Insira um valor numérico"
    })
    .min(1, "Insira um preço válido"),
  averageServiceTime: z.coerce
    .number({
      required_error: "Insira a duração",
      invalid_type_error: "Insira um valor numérico"
    })
    .min(1, "Insira uma duração válida")
});
