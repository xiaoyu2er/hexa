import { PaginationSchema } from '@/server/schema/common';
import { zSortEnum } from '@/server/schema/common';
import { zDomain } from '@/server/schema/domain';
import type { SelectProjectType } from '@/server/schema/project';
import { linkTable } from '@/server/table/link';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

// https://developers.cloudflare.com/ruleset-engine/rules-language/operators/#comparison-operators
// https://openflagr.github.io/flagr/api_docs/#operation/createFlag

export const zRuleOperatorEnum = z.enum([
  'EQ',
  'NEQ',
  'LT',
  'LE',
  'GT',
  'GE',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
  'IN',
  'NOT_IN',
]);

export const zRuleFieldEnum = z.enum([
  // ===== Request Headers =====
  'REFERER',
  'IP',
  'SOURCE',
  'LANGUAGE',
  'QUERY',
  'SOURCE',

  // ====== User agent ======
  'USER_AGENT',
  // Browser
  'BROWSER_NAME',
  'BROWSER_VERSION',
  'BROWSER_MAJOR',
  'BROWSER_TYPE',
  // Device
  'DEVICE_TYPE',
  'DEVICE_VENDOR',
  'DEVICE_MODEL',
  // OS
  'OS_NAME',
  'OS_VERSION',
  // CPU
  'CPU',
  // ======== Location ========
  'CONTINENT',
  'COUNTRY',
  'IS_EU_COUNTRY',
  'REGION_CODE',
  'LATITUDE',
  'LONGITUDE',
  'TIMEZONE',
  'POSTAL_CODE',
]);

export type RuleOperator = z.infer<typeof zRuleOperatorEnum>;

export const LinkRuleConditionSchema = z.object({
  field: zRuleFieldEnum,
  operator: zRuleOperatorEnum,
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.array(z.number()),
  ]),
});
export type LinkRuleCondition = Simplify<
  z.infer<typeof LinkRuleConditionSchema>
>;

export const LinkRuleSchema = z.object({
  conditions: z.array(LinkRuleConditionSchema),
  destUrl: z.string().url(),
});
export type LinkRule = Simplify<z.infer<typeof LinkRuleSchema>>;

// Link schemas
export const InsertLinkSchema = createInsertSchema(linkTable, {
  destUrl: z.string().url('Please enter a valid URL'),
  slug: z
    .string({ message: 'Slug is required' })
    .min(1, 'Slug is required')
    .max(100),
  title: z.string().optional(),
  desc: z.string().optional(),
  projectId: z.string(),
  domain: zDomain,
  rules: z.array(LinkRuleSchema).optional(),
});

export const UpdateLinkSchema = InsertLinkSchema.merge(
  z.object({ id: z.string() })
);

export type InsertLinkType = Simplify<z.infer<typeof InsertLinkSchema>>;
export type UpdateLinkType = Simplify<z.infer<typeof UpdateLinkSchema>>;
export const SelectLinkSchema = createSelectSchema(linkTable, {
  destUrl: z.string().url(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  rules: z.array(LinkRuleSchema),
});

export type SelectLinkType = Simplify<z.infer<typeof SelectLinkSchema>>;
export type SelectLinkWithProjectType = SelectLinkType & {
  project: SelectProjectType;
};
export const LinkColumnOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Destination URL', value: 'destUrl' },
  { label: 'Domain', value: 'domain' },
  { label: 'Slug', value: 'slug' },
];

// UI options matching sortable columns
export const LinkSortableColumnOptions = [
  { label: 'Created Date', value: 'createdAt' },
] as const satisfies Array<{
  label: string;
  value: keyof SelectLinkType;
}>;
// Add type for valid sort columns
export const SortableColumns = [
  'createdAt',
  //  'clicks'
] as const;

export type SortableColumn = (typeof SortableColumns)[number];
// Type guard to check if a string is a valid sortable column
export function isSortableColumn(
  column: string | undefined
): column is SortableColumn {
  return (
    column !== undefined && SortableColumns.includes(column as SortableColumn)
  );
}
export const zOrgInviteSortingItem = z
  .string()
  .regex(/^[a-zA-Z]+:(asc|desc)$/, {
    message: 'Sort must be in format: field:(asc|desc)',
  })
  .refine(
    (val) => {
      const [field] = val.split(':');
      return isSortableColumn(field);
    },
    {
      message: `Sort field must be one of: ${SortableColumns.join(', ')}`,
    }
  );

export const LinkSortingSchema = z.object({
  // sortClicks: zSortEnum.optional(),
  sortCreatedAt: zSortEnum.optional(),
});

export type LinkSortingType = z.infer<typeof LinkSortingSchema>;

// Transform function to convert sort params
export function transformSortParams(params: LinkSortingType) {
  return Object.entries(params)
    .filter(([field, sort]) => field.startsWith('sort') && sort !== undefined)
    .map(([field, sort]) => ({
      column:
        field.replace(/^sort/, '').charAt(0).toLowerCase() +
        field.replace(/^sort/, '').slice(1),
      sort,
    }))
    .filter((item): item is { column: SortableColumn; sort: 'asc' | 'desc' } =>
      SortableColumns.includes(item.column as SortableColumn)
    );
}

export const LinkQueryFilterSchema = z.object({
  filterDomain: z
    .union([z.array(zDomain), zDomain])
    .optional()
    .transform((val) =>
      (Array.isArray(val) ? val : [val]).filter(
        (status) => status !== undefined
      )
    ),

  search: z.string().optional(),
});
export type LinkQueryFilterType = Simplify<
  z.infer<typeof LinkQueryFilterSchema>
>;

export const LinkQuerySchema = PaginationSchema.merge(
  LinkQueryFilterSchema
).merge(LinkSortingSchema);

export type LinkQueryType = Simplify<z.infer<typeof LinkQuerySchema>>;

// 'EQ',
// 'NEQ',
// 'LT',
// 'LE',
// 'GT',
// 'GE',
// 'CONTAINS',
// 'NOT_CONTAINS',
// 'REG',
// 'NREG',
// 'IN',
// 'NOT_IN',

export const RULE_OPERATOR_LABEL_MAP: Record<
  RuleOperator,
  { label: string; value: RuleOperator }
> = {
  EQ: { label: 'Equals', value: 'EQ' },
  NEQ: { label: 'Not equals', value: 'NEQ' },
  LT: { label: 'Less than', value: 'LT' },
  LE: { label: 'Less than or equal', value: 'LE' },
  GT: { label: 'Greater than', value: 'GT' },
  GE: { label: 'Greater than or equal', value: 'GE' },
  CONTAINS: { label: 'Contains', value: 'CONTAINS' },
  NOT_CONTAINS: { label: 'Not contains', value: 'NOT_CONTAINS' },
  REG: { label: 'Matches regex', value: 'REG' },
  NREG: { label: 'Not matches regex', value: 'NREG' },
  IN: { label: 'In', value: 'IN' },
  NOT_IN: { label: 'Not in', value: 'NOT_IN' },
};

export const getFieldOperatorLabels = (field?: RuleField) => {
  if (!field) {
    return [];
  }
  return RULE_FIELD_OPERATOR_MAP[field].map((operator) => {
    return RULE_OPERATOR_LABEL_MAP[operator];
  });
};

export const getValueInputType = (
  field?: RuleField,
  operator?: RuleOperator
) => {
  if (!field) {
    return 'text';
  }
  if (!operator) {
    return 'text';
  }
  switch (operator) {
    case 'IN':
    case 'NOT_IN':
      return 'multi-select';
    case 'EQ':
    case 'NEQ':
      return field === 'CONTINENT' ? 'select' : 'text';
    default:
      return 'text';
  }
};

export const getValueOptions = (field?: RuleField, operator?: RuleOperator) => {
  if (!field) {
    return [];
  }
  if (!operator) {
    return [];
  }
  if (field === 'CONTINENT') {
    switch (operator) {
      case 'IN':
      case 'NOT_IN':
      case 'EQ':
      case 'NEQ':
        return getContinentLabels();
      default:
        return [];
    }
  }
  return [];
};

export const getContinentLabels = () => {
  return [
    { label: 'North America', value: 'NA' },
    { label: 'South America', value: 'SA' },
    { label: 'Europe', value: 'EU' },
    { label: 'Africa', value: 'AF' },
    { label: 'Asia', value: 'AS' },
    { label: 'Oceania', value: 'OC' },
    { label: 'Antarctica', value: 'AN' },
  ];
};

export const RULE_OPERATORS: { label: string; value: RuleOperator }[] = [
  ...Object.values(RULE_OPERATOR_LABEL_MAP),
];

export type RuleField = z.infer<typeof zRuleFieldEnum>;

export const RULE_FIELD_OPERATOR_MAP: Record<RuleField, RuleOperator[]> = {
  REFERER: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  IP: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  SOURCE: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  LANGUAGE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  QUERY: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  USER_AGENT: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  BROWSER_NAME: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  BROWSER_VERSION: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  BROWSER_MAJOR: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  BROWSER_TYPE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  DEVICE_TYPE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  DEVICE_VENDOR: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  DEVICE_MODEL: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  OS_NAME: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  OS_VERSION: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  CPU: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  CONTINENT: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
  COUNTRY: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  IS_EU_COUNTRY: ['EQ', 'NEQ'],
  REGION_CODE: ['EQ', 'NEQ'],
  LATITUDE: ['EQ', 'NEQ', 'LT', 'LE', 'GT', 'GE'],
  LONGITUDE: ['EQ', 'NEQ', 'LT', 'LE', 'GT', 'GE'],
  TIMEZONE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  POSTAL_CODE: [
    'EQ',
    'NEQ',
    'IN',
    'NOT_IN',
    'CONTAINS',
    'NOT_CONTAINS',
    'REG',
    'NREG',
  ],
};

export const RULE_FIELDS: { label: string; value: RuleField }[] = [
  // { label: 'Country', value: 'COUNTRY' },
  { label: 'Continent', value: 'CONTINENT' },
  // { label: 'Device', value: 'DEVICE_TYPE' },
  // { label: 'Browser', value: 'BROWSER_NAME' },
  // { label: 'Language', value: 'LANGUAGE' },
  // { label: 'Query param', value: 'QUERY' },
];

export const RulesSchema = z.object({
  rules: z.array(LinkRuleSchema),
});

export type RulesFormType = z.infer<typeof RulesSchema>;
