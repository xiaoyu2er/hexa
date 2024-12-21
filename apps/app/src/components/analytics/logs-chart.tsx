'use client';

import { type TimeRange, useLogsData } from '@/hooks/use-analytics';
import type { LogsKey } from '@hexa/lib';
import type { LogsData } from '@hexa/server/route/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@hexa/ui/card';
import { BarChart2Icon } from '@hexa/ui/icons';
import type { LucideIcon } from '@hexa/ui/icons';
import { Tab as NextUITab, Tabs } from '@nextui-org/react';
import { Skeleton } from '@nextui-org/react';
import { useState } from 'react';

export interface Tab {
  logKey: string;
  key: string;
  label: string;
  icon?: (value: string, data: LogsData) => LucideIcon | string;
  transform?: (data: LogsData[]) => LogsData[];
}

interface LogsChartProps {
  timeRange: TimeRange;
  title: string;
  tabs: Tab[];
}

const LoadingSkeleton = () => {
  const rows = Array.from({ length: 10 }, (_, idx) => ({
    barWidth: 100 - idx * 10,
  }));

  return (
    <div className="space-y-1">
      {rows.map((row, idx) => (
        <div key={idx} className="relative rounded-md">
          <div
            className="absolute inset-0 bg-blue-50/50"
            style={{
              width: `${row.barWidth}%`,
              borderTopRightRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem',
            }}
          />
          <div className="relative z-10 flex items-center justify-between px-2 py-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export function LogsChart({ timeRange, title, tabs }: LogsChartProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? '');

  const activeTabConfig = tabs.find((tab) => tab.key === activeTab);

  const { data: logsData, isLoading } = useLogsData(
    activeTabConfig?.logKey as LogsKey,
    timeRange,
    {
      enabled: !!activeTabConfig,
    }
  );

  const renderData = (data: LogsData[]) => {
    const transformedData = activeTabConfig?.transform
      ? activeTabConfig.transform(data)
      : data;

    const total = transformedData.reduce(
      (sum, item) => sum + Number(item.count),
      0
    );

    return transformedData.map((item) => {
      const percentage = Math.round((Number(item.count) / total) * 100);
      const IconOrEmoji = activeTabConfig?.icon?.(item.value, item);

      return (
        <div
          key={item.value || 'unknown'}
          className="group relative rounded-md"
        >
          <div
            className="absolute inset-0 bg-blue-50 transition-colors duration-200 group-hover:bg-blue-100"
            style={{
              width: `${percentage}%`,
              borderTopRightRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem',
            }}
          />
          <div className="relative z-10 flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              {IconOrEmoji &&
                (typeof IconOrEmoji === 'string' ? (
                  <span className="text-lg">{IconOrEmoji}</span>
                ) : (
                  <IconOrEmoji className="h-4 w-4 text-muted-foreground" />
                ))}
              <span className="text-sm">
                {!item.value || item.value.trim() === ''
                  ? 'Unknown'
                  : item.value}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {Number(item.count).toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm">
                ({percentage}%)
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Tabs
          selectedKey={tabs?.[0]?.key ?? ''}
          className="space-y-4"
          onSelectionChange={(key) => setActiveTab(key as string)}
        >
          {tabs.map((tab) => (
            <NextUITab key={tab.key} value={tab.key} title={tab.label}>
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <div className="space-y-1">
                    {logsData && renderData(logsData.data)}
                  </div>
                </>
              )}
            </NextUITab>
          ))}
        </Tabs>
        <div className="absolute top-2 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <BarChart2Icon className="h-4 w-4" />
          <span>Clicks</span>
        </div>
      </CardContent>
    </Card>
  );
}
