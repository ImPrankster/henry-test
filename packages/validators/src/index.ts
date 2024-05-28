import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().email(),
});

export const CreatePostSchema = z.object({
  name: z.string(),
  content: z.string(),
});
