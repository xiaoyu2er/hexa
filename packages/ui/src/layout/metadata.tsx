import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: NEXT_PUBLIC_APP_NAME,
  description: 'Infinite Possibilities with a Single Link',
  icons: {
    icon: [
      { url: 'https://hexacdn.com/favicon.ico' },
      {
        url: 'https://hexacdn.com/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: 'https://hexacdn.com/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: 'https://hexacdn.com/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: 'https://hexacdn.com/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: 'https://hexacdn.com/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};
