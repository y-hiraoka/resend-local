import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getEmails } from "./usecases/get-emails";

export const serverApp = new Hono()

  .basePath("/dashboard-api")

  .get(
    "/emails",
    zValidator(
      "query",
      z.object({
        offset: z.coerce.number().default(0),
        limit: z.coerce.number().default(10),
      }),
    ),
    async (c) => {
      return c.json(await getEmails(c.req.valid("query")));
    },
  );
