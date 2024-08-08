import email from "@/common/validation/email";
import password from "@/common/validation/password";
import { z } from "zod";

export default z.object({
  email,
  password
});
