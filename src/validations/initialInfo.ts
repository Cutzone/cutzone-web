import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];

export default z.object({
  description: z
    .string({ required_error: "Insira uma descrição da barbearia" })
    .nonempty("Insira uma descrição da barbearia"),
  mainPhoto: z.any(),
  style: z.string({
    required_error: "Insira uma descrição da estilidade da barbearia"
  })
});
