import type { SelectLinkWithProjectType } from '@/server/schema/link';
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';

export const getDestUrl = (
  link: SelectLinkWithProjectType,
  cf: IncomingRequestCfProperties
) => {
  const rule = link.rules?.find((rule) => {
    return rule.conditions.every((condition) => {
      // request value
      const value = cf.continent ?? '';

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'EQ' &&
        condition.value === value
      ) {
        return true;
      }

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'NEQ' &&
        condition.value !== value
      ) {
        return true;
      }

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'IN' &&
        (condition.value as string[]).includes(value)
      ) {
        return true;
      }

      if (
        condition.field === 'CONTINENT' &&
        condition.operator === 'NOT_IN' &&
        !(condition.value as string[]).includes(value)
      ) {
        return true;
      }

      return false;
    });
  });

  return rule?.destUrl ?? link.destUrl;
};
