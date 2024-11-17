import { OwnerTypeSchema } from '@/features/workspace-owner/schema';
import { MIN_PASSWORD_LENGTH } from '@/lib/const';
import { DISABLE_CLOUDFLARE_TURNSTILE } from '@/lib/env';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_FILE_SIZE,
  MAX_PROFILE_FILE_SIZE_MB,
} from '@hexa/utils/const';
import { z } from 'zod';

export const cfTurnstileResponse = DISABLE_CLOUDFLARE_TURNSTILE
  ? z.nullable(z.string().optional())
  : z.string().min(1, 'Please complete the challenge.');

// https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673
export const avatarImage = z
  .any()
  .refine((file) => !!file, 'Image is required.')
  .refine(
    (file) => file.size <= MAX_PROFILE_FILE_SIZE,
    `Max file size is ${MAX_PROFILE_FILE_SIZE_MB}MB.`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    `${ACCEPTED_IMAGE_TYPES.map((t) => t.replace('image/', '')).join(
      ', '
    )} files are accepted.`
  );

export const UpdateAvatarSchema = z.object({
  image: avatarImage,
});
export type UpdateAvatarInput = z.infer<typeof UpdateAvatarSchema>;

export const code = z
  .string()
  .min(6, {
    message: 'Your verification code must be 6 characters.',
  })
  .max(6);

// Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
export const name = z
  .string()
  .min(3, 'Please enter a valid name')
  .max(40, 'name must be 3 to 40 characters')
  .refine((username) => isValidUsername(username), {
    message:
      'Name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  });

function isValidUsername(username: string) {
  const usernameRegex = /^(?!-)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(?<!-)$/;
  return usernameRegex.test(username);
}

// Example usage
// console.log(isValidUsername("valid-username")); // true
// console.log(isValidUsername("-invalid")); // false
// console.log(isValidUsername("invalid-")); // false
// console.log(isValidUsername("in-valid")); // true
// console.log(isValidUsername("validusername")); // true
// console.log(isValidUsername("in--valid")); // false
// console.log(isValidUsername("in-valid-name")); // true

export const email = z.string().email('Please enter a valid email');

export const password = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Please enter a valid password with at least ${MIN_PASSWORD_LENGTH} characters.`
  )
  .max(255);

export const token = z.string().min(1, 'Invalid token');

export const SelectOwnerSchema = z.object({
  id: z.string(),
  type: OwnerTypeSchema,
  name: z.string(),
  avatarUrl: z.string().nullable(),
  desc: z.string().nullable(),
  role: z.string().nullable(),
});
export type SelectOwnerType = z.infer<typeof SelectOwnerSchema>;

export const EmptySchema = z.object({});
