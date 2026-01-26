import type { z } from "zod";

export function parseZodErrors<T extends Record<string, any>>(
  error: z.ZodError,
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  error.issues.forEach((issue) => {
    if (issue.path[0]) {
      fieldErrors[issue.path[0] as keyof T] = issue.message;
    }
  });

  return fieldErrors;
}
