import { DeviceTypeTips } from '@/components/tips/device-type-tips';
import type { RuleField } from '@hexa/const/rule/field';

interface RuleValueTipsProps {
  fieldType: RuleField;
}

export const RuleValueTips = ({ fieldType }: RuleValueTipsProps) => {
  if (fieldType === 'DEVICE_TYPE') {
    return <DeviceTypeTips />;
  }
  return null;
};
