'use client';

import { InputField } from '@/components/form/input-field';
import { RuleConditions } from '@/components/link/rule-conditions';
import type { RulesFormType } from '@/server/schema/link';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { Card } from '@hexa/ui/card';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@hexa/ui/icons';
import { useState } from 'react';
import type { FieldArrayWithId, useForm } from 'react-hook-form';

export const RuleCard = ({
  field,
  ruleIndex,
  form,
  onRemove,
}: {
  field: FieldArrayWithId<RulesFormType, 'rules', 'id'>;
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
  onRemove: () => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card key={field.id} className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium"># {ruleIndex + 1}</h4>
            <Badge variant="secondary">
              {field.conditions?.length || 0} conditions
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => {
                setIsCollapsed((prev) => !prev);
              }}
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            <InputField
              form={form}
              name={`rules.${ruleIndex}.destUrl`}
              label="Destination URL"
            />
            <RuleConditions ruleIndex={ruleIndex} form={form} />
          </>
        )}
      </div>
    </Card>
  );
};
