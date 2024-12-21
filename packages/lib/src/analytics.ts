export const BlobToKeyMap = {
  blob1: 'shortUrl',
  blob2: 'destUrl',
  blob3: 'projectId',
  blob4: 'orgId',
  blob5: 'visitId',
  blob6: 'referrer',
  blob7: 'ip',
  blob8: 'source',
  blob9: 'language',
  blob10: 'query',
  blob11: 'userAgent',
  blob12: 'browser',
  blob13: 'os',
  blob14: 'device',
  blob15: 'engine',
  blob16: 'location',
  blob17: 'coordinates',
  // Indexes — (strings) — Used as a sampling key.
  index1: 'linkId',
} as const;

// Map from key to blob
export const KeyToBlobMap = Object.entries(BlobToKeyMap).reduce(
  (acc, [k, v]) => {
    acc[v] = k;
    return acc;
  },
  {} as Record<LogsKey, string>
);

export type BlobKey = keyof typeof BlobToKeyMap;

export type LogsKey =
  // Direct blob mappings (blob1-blob11)
  | 'shortUrl' // blob1
  | 'destUrl' // blob2
  | 'projectId' // blob3
  | 'orgId' // blob4
  | 'visitId' // blob5
  | 'referrer' // blob6
  | 'ip' // blob7
  | 'source' // blob8
  | 'language' // blob9
  | 'query' // blob10
  | 'userAgent' // blob11

  // Browser fields (blob12)
  | 'browserName'
  | 'browserVersion'
  | 'browserMajor'
  | 'browserType'

  // OS fields (blob13)
  | 'osName'
  | 'osVersion'
  | 'cpu'

  // Device fields (blob14)
  | 'deviceType'
  | 'deviceVendor'
  | 'deviceModel'

  // Engine fields (blob15)
  | 'engineName'
  | 'engineVersion'

  // Location fields (blob16)
  | 'continent' // Fixed 2 chars
  | 'isEuCountry' // Fixed 1 char
  | 'country' // Fixed 2 chars
  | 'regionCode' // Fixed 2 chars
  | 'region' // Variable length
  | 'city' // Variable length
  | 'postalCode' // Variable length
  | 'metroCode' // Variable length
  | 'timezone' // Variable length

  // Coordinates fields (blob17)
  | 'coordinates'
  | 'latitude'
  | 'longitude'

  // Special fields
  | 'linkId' // index1
  | (typeof BlobToKeyMap)[keyof typeof BlobToKeyMap];

/**
 * Get the SQL for the blobs
 * @param key - The key to get
 * @returns The SQL for the blobs
 */
export function getBlobSQL(key: LogsKey) {
  // Special case for linkId which uses index1
  if (key === 'linkId') {
    return 'index1';
  }

  // Direct blob mappings (blob1-blob11)
  if (
    key === 'shortUrl' || // blob1
    key === 'destUrl' || // blob2
    key === 'projectId' || // blob3
    key === 'orgId' || // blob4
    key === 'visitId' || // blob5
    key === 'referrer' || // blob6
    key === 'ip' || // blob7
    key === 'source' || // blob8
    key === 'language' || // blob9
    key === 'query' || // blob10
    key === 'userAgent' // blob11
  ) {
    return KeyToBlobMap[key];
  }

  // ====== BROWSER (blob12) ======
  // Format: "NAME=Chrome&VERSION=131.0.0.0&MAJOR=131&TYPE="
  if (key === 'browserName') {
    const blob = KeyToBlobMap.browser;
    return `substring(${blob}, position('NAME=' in ${blob}) + 5, position('&VERSION=' in ${blob}) - position('NAME=' in ${blob}) - 5)`;
  }

  if (key === 'browserVersion') {
    const blob = KeyToBlobMap.browser;
    return `substring(${blob}, position('VERSION=' in ${blob}) + 8, position('&MAJOR=' in ${blob}) - position('VERSION=' in ${blob}) - 8)`;
  }

  if (key === 'browserType') {
    const blob = KeyToBlobMap.browser;
    return `substring(${blob}, position('TYPE=' in ${blob}) + 5)`;
  }

  // ====== OS (blob13) ======
  // Format: "NAME=macOS&VERSION=10.15.7&CPU="
  if (key === 'osName') {
    const blob = KeyToBlobMap.os;
    return `substring(${blob}, position('NAME=' in ${blob}) + 5, position('&VERSION=' in ${blob}) - position('NAME=' in ${blob}) - 5)`;
  }

  if (key === 'osVersion') {
    const blob = KeyToBlobMap.os;
    return `substring(${blob}, position('VERSION=' in ${blob}) + 8, position('&CPU=' in ${blob}) - position('VERSION=' in ${blob}) - 8)`;
  }

  if (key === 'cpu') {
    const blob = KeyToBlobMap.os;
    return `substring(${blob}, position('CPU=' in ${blob}) + 4)`; // Takes rest of string after CPU=
  }

  // ====== DEVICE (blob14) ======
  // Format: "TYPE=desktop&VENDOR=Apple&MODEL=Macintosh"
  if (key === 'deviceType') {
    const blob = KeyToBlobMap.device;
    return `substring(${blob}, position('TYPE=' in ${blob}) + 5, position('&VENDOR=' in ${blob}) - position('TYPE=' in ${blob}) - 5)`;
  }

  if (key === 'deviceVendor') {
    const blob = KeyToBlobMap.device;
    return `substring(${blob}, position('VENDOR=' in ${blob}) + 7, position('&MODEL=' in ${blob}) - position('VENDOR=' in ${blob}) - 7)`;
  }

  if (key === 'deviceModel') {
    const blob = KeyToBlobMap.device;
    return `substring(${blob}, position('MODEL=' in ${blob}) + 6)`;
  }

  // ====== ENGINE (blob15) ======
  // Format: "NAME=Blink&VERSION=131.0.0.0"
  if (key === 'engineName') {
    const blob = KeyToBlobMap.engine;
    return `substring(${blob}, position('NAME=' in ${blob}) + 5, position('&VERSION=' in ${blob}) - position('NAME=' in ${blob}) - 5)`;
  }

  if (key === 'engineVersion') {
    const blob = KeyToBlobMap.engine;
    return `substring(${blob}, position('VERSION=' in ${blob}) + 8)`;
  }

  // ====== LOCATION (blob16) ======
  // Format: "CONTINENT=NA&IS_EU_COUNTRY=0&COUNTRY=US&REGION_CODE=CA&REGION=California&CITY=Los Angeles&POSTAL_CODE=90025&METRO_CODE=803&TIMEZONE=America/Los_Angeles"
  // Fixed-length fields
  if (key === 'continent') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('CONTINENT=' in ${blob}) + 10, 2)`; // Always 2 chars
  }

  if (key === 'isEuCountry') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('IS_EU_COUNTRY=' in ${blob}) + 14, 1)`; // Always 1 char
  }

  if (key === 'country') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('&COUNTRY=' in ${blob}) + 9, 2)`; // Always 2 chars
  }

  if (key === 'regionCode') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('REGION_CODE=' in ${blob}) + 12, 2)`; // Always 2 chars
  }

  // Variable-length fields
  if (key === 'region') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('REGION=' in ${blob}) + 7, position('&CITY=' in ${blob}) - position('REGION=' in ${blob}) - 7)`;
  }

  if (key === 'city') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('CITY=' in ${blob}) + 5, position('&POSTAL_CODE=' in ${blob}) - position('CITY=' in ${blob}) - 5)`;
  }

  if (key === 'postalCode') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('POSTAL_CODE=' in ${blob}) + 12, position('&METRO_CODE=' in ${blob}) - position('POSTAL_CODE=' in ${blob}) - 12)`;
  }

  if (key === 'metroCode') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('METRO_CODE=' in ${blob}) + 11, position('&TIMEZONE=' in ${blob}) - position('METRO_CODE=' in ${blob}) - 11)`;
  }

  if (key === 'timezone') {
    const blob = KeyToBlobMap.location;
    return `substring(${blob}, position('TIMEZONE=' in ${blob}) + 9)`; // Takes rest of string
  }

  // ====== COORDINATES (blob17) ======
  // Format: "34.03800,-118.45440"
  if (key === 'latitude') {
    const blob = KeyToBlobMap.coordinates;
    return `substring(${blob}, 1, position(',' in ${blob}) - 1)`;
  }

  if (key === 'longitude') {
    const blob = KeyToBlobMap.coordinates;
    return `substring(${blob}, position(',' in ${blob}) + 1)`;
  }

  // Default case: return the raw blob mapping
  return `${KeyToBlobMap[key]}`;
}
