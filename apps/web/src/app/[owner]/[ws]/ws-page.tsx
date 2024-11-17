'use client';

import { useContext } from '@/lib/queries/context';

export default function WorkspacePage() {
  const { slug } = useContext();
  return <>workspace page {slug}</>;
}
