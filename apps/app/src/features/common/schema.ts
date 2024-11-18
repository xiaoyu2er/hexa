import { MIN_PASSWORD_LENGTH } from '@/lib/const';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_FILE_SIZE,
  MAX_PROFILE_FILE_SIZE_MB,
} from '@hexa/utils/const';
import { z } from 'zod';

// https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673
const avatarImage = z
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
const name = z
  .string()
  .min(3, 'Please enter a valid name')
  .max(40, 'name must be 3 to 40 characters')
  .refine((username) => isValidUsername(username), {
    message:
      'Name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.',
  });
export const NameSchema = z.object({
  name,
});
export type NameType = z.infer<typeof NameSchema>;

function isValidUsername(username: string) {
  const usernameRegex = /^(?!-)[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(?<!-)$/;
  return usernameRegex.test(username);
}

const displayName = z
  .string()
  // .min(1, "Please enter a name")
  .max(32, 'Name must be less than 32 characters');
// .nullable();

export const DisplayNameSchema = z.object({
  displayName,
});

// Example usage
// console.log(isValidUsername("valid-username")); // true
// console.log(isValidUsername("-invalid")); // false
// console.log(isValidUsername("invalid-")); // false
// console.log(isValidUsername("in-valid")); // true
// console.log(isValidUsername("validusername")); // true
// console.log(isValidUsername("in--valid")); // false
// console.log(isValidUsername("in-valid-name")); // true

const email = z.string().email('Please enter a valid email');

export const EmailSchema = z.object({
  email,
});

export type EmailType = z.infer<typeof EmailSchema>;

const password = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Please enter a valid password with at least ${MIN_PASSWORD_LENGTH} characters.`
  )
  .max(255);

export const PasswordSchema = z.object({
  password,
});
export type PasswordType = z.infer<typeof PasswordSchema>;

export const EmptySchema = z.object({});
