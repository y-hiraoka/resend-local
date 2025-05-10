import { MiddlewareHandler } from "hono";
import { ResendResponseError } from "../response-helper";

export const bearerTokenMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (typeof token !== "string") {
    throw new ResendResponseError(401, "missing_api_key", "Missing API key");
  }

  if (!token.startsWith("re_")) {
    throw new ResendResponseError(401, "invalid_api_key", "API key is invalid");
  }

  return next();
};
