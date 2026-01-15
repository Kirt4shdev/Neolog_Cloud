import type { z } from "zod";

export class ZodErrorFormatter {
  public static formatError(error: z.ZodError): string {
    const firstIssue = error.issues[0];
    const fieldName = firstIssue.path[0];

    // Devolver un objeto con el mensaje de error y los detalles del error
    // Solo devolvemos la primera issue
    return JSON.stringify({
      message: firstIssue.message,
      issues: {
        field: fieldName,
        received: firstIssue.message.split("received ")[1],
        // @ts-ignore
        expected: firstIssue.expected,
        code: firstIssue.code,
      },
    });
  }
}
