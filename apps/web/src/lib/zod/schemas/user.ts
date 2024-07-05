import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_FILE_SIZE,
  MAX_PROFILE_FILE_SIZE_MB,
} from "@hexa/utils/const";

const name = z
  .string()
  .min(1, "Please enter a name")
  .max(32, "Name must be less than 32 characters");

export const UpdateUserNameSchema = z.object({
  name,
});

export type UpdateUserNameInput = z.infer<typeof UpdateUserNameSchema>;

// https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673
const avatarImage = z
  .any()
  .refine((file) => !!file, "Image is required.")
  .refine(
    (file) => file.size <= MAX_PROFILE_FILE_SIZE,
    `Max file size is ${MAX_PROFILE_FILE_SIZE_MB}MB.`,
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    `${ACCEPTED_IMAGE_TYPES.map((t) => t.replace("image/", "")).join(", ")} files are accepted.`,
  );

export const UpdateAvatarSchema = z.object({
  image: avatarImage,
});

export type UpdateAvatarInput = z.infer<typeof UpdateAvatarSchema>;

export const DELETE_USER_CONFIRMATION = "confirm delete account";
export const DeleteUserSchema = z.object({
  confirm: z
    .string()
    .refine(
      (v) => v === DELETE_USER_CONFIRMATION,
      "Please type 'confirm delete account' to delete your account.",
    ),
});

export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
