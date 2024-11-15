import { z } from "zod";
export default z.object({
  description: z
    .string({ required_error: "Insira uma descrição da barbearia" })
    .nonempty("Insira uma descrição da barbearia"),
  mainPhoto: z.any(),
  style: z.string({
    required_error: "Insira uma descrição da estilidade da barbearia"
  })
});
