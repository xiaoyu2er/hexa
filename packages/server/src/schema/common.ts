import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_FILE_SIZE,
  MAX_PROFILE_FILE_SIZE_MB,
  MIN_PASSWORD_LENGTH,
} from '@hexa/const';
import { z } from 'zod';

// https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673
const zAvatarImage = z
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
  image: zAvatarImage,
});
export type UpdateAvatarType = z.infer<typeof UpdateAvatarSchema>;

const zCodeMsg = 'Your verification code must be 6 characters.';
const zPasscode = z
  .string()
  .min(6, {
    message: zCodeMsg,
  })
  .max(6, {
    message: zCodeMsg,
  });

export const PasscodeSchema = z.object({
  code: zPasscode,
});
export type PasscodeType = z.infer<typeof PasscodeSchema>;

// Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
export const zName = z
  .string()
  .min(1, 'Please enter the name')
  .max(32, 'Name must be less than 32 characters');

const RESERVERD_SLUGS = ['new'];

export const zSlug = z
  .string({ message: 'Please enter a slug' })
  .min(3, 'Min 3 characters')
  .max(32, 'Max 32 characters')
  .refine(
    (v) => /^[a-z0-9-]+$/.test(v),
    'Only lowercase letters, numbers and dash are allowed'
  )
  .refine((v) => !RESERVERD_SLUGS.includes(v), 'This slug is reserved keyword');

export const zOrgName = z
  .string({
    message: 'Please enter the organization name',
  })
  .max(32, 'Organization name must be less than 32 characters');

export const NameSchema = z.object({
  name: zName,
});

export type NameType = z.infer<typeof NameSchema>;

export const zEmail = z.string().email('Please enter a valid email');

export const EmailSchema = z.object({
  email: zEmail,
});

export type EmailType = z.infer<typeof EmailSchema>;

export const zPassword = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Please enter a valid password with at least ${MIN_PASSWORD_LENGTH} characters.`
  )
  .max(255);

export const PasswordSchema = z.object({
  password: zPassword,
});
export type PasswordType = z.infer<typeof PasswordSchema>;

export const EmptySchema = z.object({});

export const PaginationSchema = z.object({
  pageIndex: z.string().transform((v) => Number.parseInt(v)),
  pageSize: z.string().transform((v) => Number.parseInt(v)),
});
export type PaginationType = z.infer<typeof PaginationSchema>;

export const zSortEnum = z.enum(['asc', 'desc']);

export const zDatetime = z.string().datetime();
