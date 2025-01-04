import { generateSlug } from 'random-word-slugs';

export function generateProjectSlug() {
  return generateSlug();
}

export function getSlugByName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}
