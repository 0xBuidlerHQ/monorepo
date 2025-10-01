import { z } from 'zod';

declare const createZodSchemaFromObjectValues: (object: Object) => z.ZodUnion<any>;
type NonEmptyArray<T> = [T, ...T[]];
declare const nonEmptyArray: <T>(arr: T[]) => NonEmptyArray<T>;
declare const mergeDefaultsProps: <T extends {}>(props: T, defaults: Partial<T>) => T;

export { createZodSchemaFromObjectValues, mergeDefaultsProps, nonEmptyArray };
