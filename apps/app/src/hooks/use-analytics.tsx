import { useProject } from '@/hooks/use-project';
import { $getAnalyticsLogs, $getAnalyticsTimeSeries } from '@/lib/api';
import type { TimeSeriesResponse } from '@/server/route/analytics';
import type { LogsKey } from '@hexa/utils/analytics';
import { useQuery } from '@tanstack/react-query';
export interface TimeRange {
  start: Date;
  end: Date;
}

export function useTimeSeriesData(timeRange: TimeRange) {
  const { project } = useProject();

  return useQuery<TimeSeriesResponse>({
    queryKey: [
      'analytics',
      'time-series',
      project.id,
      timeRange.start,
      timeRange.end,
    ],
    queryFn: () =>
      $getAnalyticsTimeSeries({
        query: {
          projectId: project.id,
          start: timeRange.start.toISOString(),
          end: timeRange.end.toISOString(),
        },
      }),
  });
}

export function useLogsData(
  logType: LogsKey,
  timeRange: TimeRange,
  options: { enabled?: boolean } = { enabled: true }
) {
  const { project } = useProject();

  return useQuery({
    queryKey: [
      'analytics',
      'logs',
      logType,
      project.id,
      timeRange.start,
      timeRange.end,
    ],
    queryFn: () =>
      $getAnalyticsLogs({
        param: { type: logType },
        query: {
          projectId: project.id,
          start: timeRange.start.toISOString(),
          end: timeRange.end.toISOString(),
        },
      }),
    enabled: options.enabled,
  });
}

// Helper hook to get total stats
export function useAnalyticsTotals(timeRange: TimeRange) {
  const { data: timeSeriesData } = useTimeSeriesData(timeRange);
  const { data: referrerData } = useLogsData('referrer', timeRange);

  return {
    visits:
      timeSeriesData?.data?.reduce(
        (sum, item) => sum + Number.parseInt(item.visits, 10),
        0
      ) || 0,
    visitors:
      timeSeriesData?.data?.reduce(
        (sum, item) => sum + Number.parseInt(item.visitors, 10),
        0
      ) || 0,
    referrers: referrerData?.data?.length || 0,
  };
}
