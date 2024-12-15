import { InputField } from '@/components/form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RulesFormType } from '@hexa/const/rule';
import { Badge } from '@hexa/ui/badge';
import { Card } from '@hexa/ui/card';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  GripVerticalIcon,
  TrashIcon,
} from '@hexa/ui/icons';
import { cn } from '@hexa/utils/cn';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
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
            <button
              type="button"
              {...listeners}
              {...attributes}
              aria-label="Drag rule"
              className="cursor-grab p-1 hover:bg-muted"
            >
              <GripVerticalIcon className="h-4 w-4" />
            </button>
            <h4 className="font-medium"># {ruleIndex + 1}</h4>
            <Badge variant="secondary">
              {field.conditions?.length || 0} conditions
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="light"
              size="sm"
              isIconOnly
              aria-label="Toggle rule details"
              className="w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDownIcon className="h-5 w-5" />
              ) : (
                <ChevronUpIcon className="h-5 w-5" />
              )}
            </Button>
            <Dropdown
              classNames={{
                content: 'min-w-[140px]',
              }}
            >
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className="h-8 w-8 p-0"
                  isIconOnly
                  aria-label="Open menu"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions">
                <DropdownItem
                  onClick={onRemove}
                  className="text-destructive"
                  startContent={<TrashIcon className="mr-2 h-4 w-4" />}
                >
                  Delete rule
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
