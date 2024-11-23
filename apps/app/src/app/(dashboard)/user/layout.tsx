import type { ReactNode } from 'react';

export default function UserSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-y-4 px-3 py-4 lg:px-10">
      {children}
    </div>
  );
}
