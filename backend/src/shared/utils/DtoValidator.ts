import { z } from "zod";
import { ZodErrorFormatter } from "./ZodErrorFormatter";

export class DtoValidator {
  public static validate<T>(
    schema: z.ZodSchema<T>,
    object?: Record<string, any>
  ): Result<T, string> {
    if (!object) {
      return {
        error: JSON.stringify({
          message: "Invalid request body",
          issues: {
            field: "body",
            received: "undefined",
            expected: schema?.toJSONSchema()?.required?.join(", "),
          },
        }),
      };
    }

    const result = schema.safeParse(object);

    if (!result.success) {
      return { error: ZodErrorFormatter.formatError(result.error) };
    }

    return { result: result.data };
  }
}
