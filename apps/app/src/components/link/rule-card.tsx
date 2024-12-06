import { InputField } from '@/components/form/input-field';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RulesFormType } from '@hexa/const/rule';
import { Badge } from '@hexa/ui/badge';
import { Button } from '@hexa/ui/button';
import { Card } from '@hexa/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@hexa/ui/dropdown-menu';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  GripVerticalIcon,
  TrashIcon,
} from '@hexa/ui/icons';
import { cn } from '@hexa/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { useForm } from 'react-hook-form';
import type { FieldArrayWithId } from 'react-hook-form';
import { RuleConditions } from './rule-conditions';

interface RuleCardProps {
  id: string;
  field: FieldArrayWithId<RulesFormType, 'rules', 'id'>;
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
  onRemove: () => void;
}

export function RuleCard({
  id,
  field,
  ruleIndex,
  form,
  onRemove,
}: RuleCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group overflow-hidden p-4',
        isDragging && 'shadow-lg ring-2 ring-primary/50'
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              {...listeners}
              {...attributes}
              variant="ghost"
              size="sm"
              className="cursor-grab p-1 hover:bg-muted"
            >
              <GripVerticalIcon className="h-4 w-4" />
            </Button>
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
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={onRemove}
                  className="text-destructive"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            >
              <div className="space-y-4">
                <RuleConditions ruleIndex={ruleIndex} form={form} />
                <InputField
                  form={form}
                  name={`rules.${ruleIndex}.destUrl`}
                  label="Destination URL"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
