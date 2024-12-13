import { AcceptLanguageTips } from '@/components/tips/accept-language-tips';
import { CookieTips } from '@/components/tips/cookie-tips';
import { CountryTips } from '@/components/tips/country-tips';
import { DeviceTypeTips } from '@/components/tips/device-type-tips';
import { QueryTips } from '@/components/tips/query-tips';
import { SourceTips } from '@/components/tips/source-tips';
import { UserAgentTips } from '@/components/tips/user-agent-tips';
import type { RuleField } from '@hexa/const/rule/field';

interface RuleValueTipsProps {
  fieldType: RuleField;
}

export const RuleValueTips = ({ fieldType }: RuleValueTipsProps) => {
  if (fieldType === 'DEVICE_TYPE') {
    return <DeviceTypeTips />;
  }
  if (fieldType === 'COUNTRY') {
    return <CountryTips />;
  }
  if (fieldType === 'ACCEPT_LANGUAGE') {
    return <AcceptLanguageTips />;
  }
  if (fieldType === 'QUERY') {
    return <QueryTips />;
  }
  if (fieldType === 'COOKIE') {
    return <CookieTips />;
  }
  if (fieldType === 'SOURCE') {
    return <SourceTips />;
  }
  if (fieldType === 'USER_AGENT') {
    return <UserAgentTips />;
  }
  return null;
};
