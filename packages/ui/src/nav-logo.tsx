import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const NavLogo = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={"https://dubassets.com/avatars/cly4x47ur000ftlbgbn7ilmx7"}
        alt={"Hexa"}
      />
      <AvatarFallback delayMs={200}>Hexa</AvatarFallback>
    </Avatar>
  );
};
