import xss from "xss";
import type { Request, Response, NextFunction } from "express";

function cleanXSS(obj: any): any {
  if (typeof obj === "string") return xss(obj);
  if (Array.isArray(obj)) return obj.map(cleanXSS);

  if (obj !== null && typeof obj === "object") {
    const cleanObj: any = {};

    for (const key in obj) {
      cleanObj[key] = cleanXSS(obj[key]);
    }

    return cleanObj;
  }

  return obj;
}

export function xssMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // req.body se puede reasignar directamente
  if (req?.body) req.body = cleanXSS(req.body);

  // req.query y req.params son de solo lectura, hay que modificar las propiedades individuales
  if (req?.query) {
    const cleanedQuery = cleanXSS(req.query);
    for (const key in cleanedQuery) {
      (req.query as any)[key] = cleanedQuery[key];
    }
  }

  if (req?.params) {
    const cleanedParams = cleanXSS(req.params);
    for (const key in cleanedParams) {
      (req.params as any)[key] = cleanedParams[key];
    }
  }

  next();
}
