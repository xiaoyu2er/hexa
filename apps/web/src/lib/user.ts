import type { User } from "lucia";

export const getAvatarFallbackUrl = (user: User | null) => {
  return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user?.id}`;
};

export const getAvatarFallbackName = (user: User | null) => {
  return (user?.name ?? "HX")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
