import { MIN_PASSWORD_LENGTH } from '@/lib/const';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_FILE_SIZE,
  MAX_PROFILE_FILE_SIZE_MB,
} from '@hexa/utils/const';
import { z } from 'zod';

// https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673
const avatarImage = z
  .custom<File>()
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
export type UpdateAvatarType = z.infer<typeof UpdateAvatarSchema>;

const code = z
  .string()
  .min(6, {
    message: 'Your verification code must be 6 characters.',
  })
  .max(6);

export const CodeSchema = z.object({
  code,
});
export type CodeType = z.infer<typeof CodeSchema>;

// Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
export const zNameString = z
  .string({
    message: 'Please enter your name',
  })
  .max(32, 'Name must be less than 32 characters');

const RESERVERD_SLUGS = ['new'];

export const zSlugString = z
  .string({ message: 'Please enter a slug' })
  .min(3, 'Min 3 characters')
  .max(32, 'Max 32 characters')
  .refine(
    (v) => /^[a-z0-9-]+$/.test(v),
    'Only lowercase letters, numbers and dash are allowed'
  )
  .refine((v) => !RESERVERD_SLUGS.includes(v), 'This slug is reserved keyword');

export const zOrgNameString = z
  .string({
    message: 'Please enter your organization name',
  })
  .max(32, 'Organization name must be less than 32 characters');

export const NameSchema = z.object({
  name: zNameString,
});

export type NameType = z.infer<typeof NameSchema>;

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

export const zEmailString = z.string().email('Please enter a valid email');

export const EmailSchema = z.object({
  email: zEmailString,
});

export type EmailType = z.infer<typeof EmailSchema>;

export const zPasswordString = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Please enter a valid password with at least ${MIN_PASSWORD_LENGTH} characters.`
  )
  .max(255);

export const PasswordSchema = z.object({
  password: zPasswordString,
});
export type PasswordType = z.infer<typeof PasswordSchema>;

export const EmptySchema = z.object({});
