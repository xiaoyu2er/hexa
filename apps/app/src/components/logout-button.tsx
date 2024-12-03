'use client';

import { $logout } from '@/lib/api';
import { Button } from '@hexa/ui/button';
import { LogOut } from '@hexa/ui/icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const { mutateAsync: execLogout, isPending } = useMutation({
    mutationFn: $logout,
    onSuccess() {
      router.push('/');
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={execLogout}
      className="h-9 w-9"
      aria-label="Logout"
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
