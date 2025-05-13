import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const databaseClient = drizzle(process.env.DB_FILE_NAME!, { schema });
