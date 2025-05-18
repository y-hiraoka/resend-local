import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const databaseClient = drizzle(process.env.DATABASE_URL!, { schema });
