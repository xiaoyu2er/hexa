export const getAvatarFallbackName = (name: string | null | undefined) => {
  return (name ?? "HX")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
