import { z } from "zod";

export default z
  .string()
  .nonempty({ message: "Insira seu telefone" })
  .min(7, { message: "Deve ter no mínimo 7 caracteres" })
  .regex(/^[0-9]+$/, { message: "Deve conter apenas números" })
  .transform((value) => value.replace(/\s+/g, ""));
