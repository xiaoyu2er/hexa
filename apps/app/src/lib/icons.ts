import {
  // Browser icons
  ChromeIcon,
  MonitorIcon,
  SmartphoneIcon,
} from '@hexa/ui/icons';
import type { LucideIcon } from '@hexa/ui/icons';
import { UAParser } from 'ua-parser-js';

// Parser functions
function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  return {
    browser: parser.getBrowser().name || 'Unknown',
    os: parser.getOS().name || 'Unknown',
    device: parser.getDevice().type || 'desktop',
  };
}

// Add a type for the device stat types
export type DeviceStatType = 'browser' | 'os' | 'device';

// Icon getter functions
export function getBrowserIcon(_browser: string): LucideIcon {
  return ChromeIcon;
}

export function getOSIcon(_os: string): LucideIcon {
  return MonitorIcon;
}

export function getDeviceIcon(_device: string): LucideIcon {
  return SmartphoneIcon;
}

// Country flag emoji function
export function getFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.trim() === '') {
    return '🌐';
  }

  // Special cases and exceptions
  const specialCases: Record<string, string> = {
    UK: 'GB', // Convert UK to GB for proper flag display
    EU: '🇪🇺', // European Union flag
    UN: '🌐', // United Nations or Unknown
  };

  // Check for special cases first
  if (specialCases[countryCode.toUpperCase()]) {
    return specialCases[countryCode.toUpperCase()] as string;
  }

  // Convert country code to regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  try {
    return String.fromCodePoint(...codePoints);
  } catch (_e) {
    return '🌐';
  }
}

// Continent Icons mapping with proper names
export const CONTINENT_ICONS = {
  NA: { icon: '🌎', name: 'North America' },
  SA: { icon: '🌎', name: 'South America' },
  EU: { icon: '🌍', name: 'Europe' },
  AF: { icon: '🌍', name: 'Africa' },
  AS: { icon: '🌏', name: 'Asia' },
  OC: { icon: '🌏', name: 'Oceania' },
  AN: { icon: '🗺️', name: 'Antarctica' },
  Unknown: { icon: '🌐', name: 'Unknown' },
} as const;
