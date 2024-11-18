'use client';

import { useContext } from '@/components/hooks/use-context';

export default function WorkspacePage() {
  const { slug } = useContext();
  return <>workspace page {slug}</>;
}
