// src/utils/index.ts
import { z } from "zod";
var createZodSchemaFromObjectValues = (object) => (
  // biome-ignore lint/suspicious/noExplicitAny: Needed.
  z.union(Object.values(object).map((value) => z.literal(value)))
);
var nonEmptyArray = (arr) => {
  if (arr.length <= 0) throw new Error("Array is empty");
  return arr;
};
var mergeDefaultsProps = (props, defaults) => {
  return { ...defaults, ...props };
};

export {
  createZodSchemaFromObjectValues,
  nonEmptyArray,
  mergeDefaultsProps
};
//# sourceMappingURL=chunk-H5CDUHVA.js.map