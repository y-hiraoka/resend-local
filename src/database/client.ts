import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const databaseClient = drizzle<typeof schema>(process.env.DB_FILE_NAME!);
