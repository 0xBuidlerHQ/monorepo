import { z } from "zod";

const createZodSchemaFromObjectValues = (object: Object) =>
	// biome-ignore lint/suspicious/noExplicitAny: Needed.
	z.union(Object.values(object).map((value) => z.literal(value)) as any);

type NonEmptyArray<T> = [T, ...T[]];
const nonEmptyArray = <T>(arr: T[]): NonEmptyArray<T> => {
	if (arr.length <= 0) throw new Error("Array is empty");
	return arr as NonEmptyArray<T>;
};

const mergeDefaultsProps = <T extends {}>(props: T, defaults: Partial<T>): T => {
	return { ...defaults, ...props };
};

export { createZodSchemaFromObjectValues, nonEmptyArray, mergeDefaultsProps };
