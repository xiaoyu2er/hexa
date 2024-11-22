import { z } from 'zod';

export const DELETE_USER_CONFIRMATION = 'Confirm delete account';

export const DeleteUserSchema = z.object({
  confirm: z
    .string()
    .refine(
      (v) => v === DELETE_USER_CONFIRMATION,
      `Please type '${DELETE_USER_CONFIRMATION}' to delete your account.`
    ),
});

export type DeleteUserType = z.infer<typeof DeleteUserSchema>;
