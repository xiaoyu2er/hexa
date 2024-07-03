import { z } from "zod";

const name = z
  .string()
  .min(1, "Please enter a name")
  .max(32, "Name must be less than 32 characters");

export const UpdateUserNameSchema = z.object({
  name,
});

export type UpdateUserNameInput = z.infer<typeof UpdateUserNameSchema>;
