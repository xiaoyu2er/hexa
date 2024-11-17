import { z } from 'zod';

export const DELETE_USER_CONFIRMATION = 'confirm delete account';
export const DeleteUserSchema = z.object({
  confirm: z
    .string()
    .refine(
      (v) => v === DELETE_USER_CONFIRMATION,
      "Please type 'confirm delete account' to delete your account."
    ),
});

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
