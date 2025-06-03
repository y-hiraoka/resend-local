import { LibsqlError } from "@libsql/client";

export const isUniqueError = (error: unknown): boolean => {
  if (error instanceof Error) {
    if (error.cause instanceof LibsqlError) {
      return error.cause.code === "SQLITE_CONSTRAINT_UNIQUE";
    }

    if (error instanceof LibsqlError) {
      return error.code === "SQLITE_CONSTRAINT_UNIQUE";
    }
  }

  return false;
};
