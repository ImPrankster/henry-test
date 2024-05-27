import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().email(),
});
