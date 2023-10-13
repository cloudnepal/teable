import { z } from 'zod';

export const asc = z.literal('asc');

export const desc = z.literal('desc');

export type IOrder = z.infer<typeof orders>;

const orders = z.union([asc, desc]);

export const sortItemSchema = z.object({
  fieldId: z.string(),
  order: orders,
});

export const sortSchema = z.object({
  sortObjs: sortItemSchema.array(),
  shouldAutoSort: z.boolean(),
});

export const sortStringSchema = z.string().transform((val, ctx) => {
  let jsonValue;
  try {
    jsonValue = JSON.parse(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid JSON string',
    });
    return z.NEVER;
  }
  return sortSchema.parse(jsonValue);
});

export type ISortItem = z.infer<typeof sortItemSchema>;

export type ISort = z.infer<typeof sortSchema>;

export const manualSortRoSchema = z.object({
  sortObjs: sortItemSchema.array(),
});

export type IManualSortRo = z.infer<typeof manualSortRoSchema>;

export function mergeWithDefaultSort(
  defaultViewSort: string | null,
  querySort?: ISort['sortObjs']
) {
  if (!defaultViewSort && !querySort) {
    return [];
  }

  const parseSort = sortStringSchema.safeParse(defaultViewSort);

  const viewSort = parseSort.success ? parseSort.data : undefined;

  // should clear sort query when sort manually
  if (!viewSort?.shouldAutoSort && !querySort?.length) {
    return [];
  }

  let mergeSort = viewSort?.sortObjs || [];

  if (querySort?.length) {
    // merge the same fieldId item, query first
    const map = new Map(mergeSort.map((sortItem) => [sortItem.fieldId, sortItem]));
    querySort.forEach((sortItem) => map.set(sortItem.fieldId, sortItem));
    mergeSort = Array.from(map.values());
  }

  return mergeSort;
}