import { getBlobSQL } from '@hexa/lib';
import type { LogsKey } from '@hexa/lib';
import authProject from '@hexa/server/middleware/project';
import { ProjectIdSchema } from '@hexa/server/schema/project';
import { queryAnalytics } from '@hexa/server/service/analytics';
import type { Context } from '@hexa/server/types';
// @ts-ignore
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

// Base types for analytics responses
interface AnalyticsResponseMeta {
  meta: Array<{ name: string; type: string }>;
  rows: number;
  rows_before_limit_at_least: number;
}

// Time Series Types
export interface TimeSeriesData {
  date: string;
  visitors: string;
  visits: string;
}

export interface TimeSeriesResponse extends AnalyticsResponseMeta {
  data: TimeSeriesData[];
}

// Logs Analytics Types
export interface LogsData {
  value: string;
  count: string;
  country?: string;
}

export interface LogsResponse extends AnalyticsResponseMeta {
  data: LogsData[];
}

// Request Schema
const TimeRangeSchema = z.object({
  start: z.string(),
  end: z.string(),
});

// Type guard for LogsKey
export function isValidLogsKey(key: string): key is LogsKey {
  // return key in KeyToBlobMap;
  return true;
}

// Analytics Query Parameters
export interface AnalyticsQueryParams {
  projectId: string;
  start: string;
  end: string;
}

// Analytics Routes Configuration
export interface AnalyticsRouteConfig {
  type: LogsKey;
  query: AnalyticsQueryParams;
}

// Response transformers
export function transformTimeSeriesResponse(
  data: TimeSeriesResponse
): TimeSeriesData[] {
  return data.data.map((item) => ({
    date: item.date,
    visitors: item.visitors,
    visits: item.visits,
  }));
}

export function transformLogsResponse(data: LogsResponse): LogsData[] {
  return data.data.map((item) => ({
    value: item.value,
    count: item.count,
    country: item.country,
  }));
}

const analytics = new Hono<Context>()
  .get(
    '/analytics/all',
    zValidator('query', ProjectIdSchema.merge(TimeRangeSchema)),
    authProject('query'),
    async (c) => {
      const _env = c.env;
      // const { start, end } = c.req.valid('query');
      // const { startDays, endDays } = getDateIntervals(start, end);

      const query = `
        /* Analytics overview query
         * Extracts location data and aggregates visit counts
         * Groups by all location dimensions
         */
        SELECT
          -- Device information
          ${getBlobSQL('deviceVendor')} as deviceVendor,
          ${getBlobSQL('deviceModel')} as deviceModel,
          ${getBlobSQL('deviceType')} as deviceType,
          -- Engine information
          ${getBlobSQL('engineName')} as engineName,
          ${getBlobSQL('engineVersion')} as engineVersion,
          ${getBlobSQL('cpu')} as cpu,
          -- Browser information
          ${getBlobSQL('browserName')} as browserName,
          ${getBlobSQL('browserVersion')} as browserVersion,
          ${getBlobSQL('browserType')} as browserType,
          -- OS information
          ${getBlobSQL('osName')} as osName,
          ${getBlobSQL('osVersion')} as osVersion,
          -- Location information
          ${getBlobSQL('continent')} as continent,      -- Two-letter continent code
          ${getBlobSQL('isEuCountry')} as isEuCountry, -- EU country flag (0/1)
          ${getBlobSQL('country')} as country,         -- Two-letter country code
          ${getBlobSQL('regionCode')} as regionCode,   -- Two-letter region code
          ${getBlobSQL('region')} as region,           -- Full region name
          ${getBlobSQL('city')} as city,               -- City name
          ${getBlobSQL('postalCode')} as postalCode,   -- Postal/ZIP code
          ${getBlobSQL('metroCode')} as metroCode,     -- Metro area code
          ${getBlobSQL('timezone')} as timezone,       -- Timezone string
          
          -- Metrics
          SUM(_sample_interval) as visits              -- Total number of visits
        FROM ${process.env.REDIRECT_DATASET}
        GROUP BY 
          deviceVendor, deviceModel, deviceType,
          engineName, engineVersion, cpu,
          browserName, browserVersion, browserType,
          osName, osVersion, 
          continent, isEuCountry, country, 
          regionCode, region, city, 
          postalCode, metroCode, timezone
        LIMIT 10
      `;

      const data = (await queryAnalytics(query)) as TimeSeriesResponse;
      return c.json(data);
    }
  )
  .get(
    '/analytics/logs/:type',
    zValidator('query', ProjectIdSchema.merge(TimeRangeSchema)),
    authProject('query'),
    async (c) => {
      const _env = c.env;
      const _linkId = `'url_kmwyedewyuvpel55q7wu4z2dh6mgs'`;
      const { type } = c.req.param() as { type: LogsKey };
      const { start, end } = c.req.valid('query');
      const { startDays } = getDateIntervals(start, end);

      // if (!isValidLogsKey(type)) {
      //   return c.json({ error: 'Invalid analytics type' }, 400);
      // }

      const countrySelect =
        type === 'city' || type === 'region'
          ? `, ${getBlobSQL('country')} as country`
          : '';

      const query = `
        SELECT 
          ${getBlobSQL(type)} as value,
          SUM(_sample_interval) as count
          ${countrySelect}
        FROM ${process.env.REDIRECT_DATASET}
        WHERE timestamp >= NOW() - INTERVAL '${startDays}' DAY 
        AND timestamp <= NOW()
        GROUP BY value${countrySelect ? ', country' : ''}
        ORDER BY count DESC
        LIMIT 10
      `;

      const data = (await queryAnalytics(query)) as LogsResponse;
      return c.json(data);
    }
  );

function getDateIntervals(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const nowDate = new Date();

  const startDays = Math.ceil(
    (nowDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const endDays = Math.ceil(
    (nowDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { startDays, endDays };
}

export default analytics;
