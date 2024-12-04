import type { SelectLinkWithProjectType } from '@/server/schema/link';
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';

export const getDestUrl = (
  link: SelectLinkWithProjectType,
  cf: IncomingRequestCfProperties
) => {
  const rule = link.rules?.find((rule) => {
    return rule.conditions.every((condition) => {
      const continent = cf.continent ?? '';

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'EQ' &&
        condition.value === continent
      ) {
        return true;
      }

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'NEQ' &&
        condition.value !== continent
      ) {
        return true;
      }

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'IN' &&
        (condition.value as string[]).includes(continent)
      ) {
        return true;
      }

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'NOT_IN' &&
        !(condition.value as string[]).includes(continent)
      ) {
        return true;
      }

      return false;
    });
  });

  return rule?.destUrl ?? link.destUrl;
};
