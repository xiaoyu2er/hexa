'use client';
import AnalyticsTimePicker from '@/components/analytics/analytics-time-picker';
import {
  CONTINENT_ICONS,
  getBrowserIcon,
  getDeviceIcon,
  getFlagEmoji,
  getOSIcon,
} from '@/lib/icons';
import type { LogsData } from '@hexa/server/route/analytics';
import { useState } from 'react';
import { LogsChart, type Tab } from './logs-chart';

import type { TimeRange } from '@/hooks/use-analytics';
import { getLocalTimeZone, today } from '@internationalized/date';

// URL Stats Configuration
const urlTabs: Tab[] = [
  {
    logKey: 'shortUrl',
    label: 'Short Links',
    key: 'shortUrl',
  },
  {
    logKey: 'destUrl',
    label: 'Destination URLs',
    key: 'destUrl',
  },
];

// Geo Stats Configuration
const geoTabs: Tab[] = [
  {
    logKey: 'country',
    key: 'country',
    label: 'Countries',
    icon: getFlagEmoji,
  },
  {
    logKey: 'region',
    key: 'region',
    label: 'Regions',
    icon: (_: string, data: LogsData) => getFlagEmoji(data.country),
  },
  {
    logKey: 'city',
    key: 'city',
    label: 'Cities',
    icon: (_: string, data: LogsData) => getFlagEmoji(data.country),
  },
  {
    logKey: 'continent',
    key: 'continent',
    label: 'Continents',
    icon: (value: string) =>
      CONTINENT_ICONS[value as keyof typeof CONTINENT_ICONS]?.icon ||
      CONTINENT_ICONS.Unknown.icon,
  },
];

// Device Stats Configuration
const deviceTabs: Tab[] = [
  {
    logKey: 'deviceType',
    label: 'Devices',
    icon: getDeviceIcon,
    key: 'device',
  },
  {
    logKey: 'browserName',
    label: 'Browsers',
    icon: getBrowserIcon,
    key: 'browser',
  },
  {
    logKey: 'osName',
    label: 'Operating Systems',
    icon: getOSIcon,
    key: 'os',
  },
  {
    logKey: 'source',
    label: 'Triggers',
    key: 'trigger',
  },
];

// Referrer Stats Configuration
const referrerTabs: Tab[] = [
  {
    logKey: 'referrer',
    label: 'Referrers',
    key: 'referrer',
  },
  {
    logKey: 'source',
    label: 'Sources',
    key: 'source',
  },
];

export function AnalyticsPage() {
  const [date, setDate] = useState<TimeRange>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ days: 7 }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Analytics</h1>
        <AnalyticsTimePicker dateRange={date} onUpdate={setDate} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* URLs Section */}

        <LogsChart title="URLs" tabs={urlTabs} timeRange={date} />

        {/* Geographic Section */}

        <LogsChart title="Geographic" tabs={geoTabs} timeRange={date} />

        {/* Devices Section */}

        <LogsChart title="Devices" tabs={deviceTabs} timeRange={date} />

        {/* Referrers Section */}

        <LogsChart
          title="Traffic Sources"
          tabs={referrerTabs}
          timeRange={date}
        />
      </div>
    </div>
  );
}
