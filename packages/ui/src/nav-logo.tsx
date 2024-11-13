import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const NavLogo = () => {
  return (
    <Avatar className="box-content h-8 w-8 dark:border dark:border-gray-300">
      <AvatarImage
        src="https://dubassets.com/avatars/cly4x47ur000ftlbgbn7ilmx7"
        alt="Hexa"
      />
      <AvatarFallback delayMs={200}>Hexa</AvatarFallback>
    </Avatar>
  );
};
