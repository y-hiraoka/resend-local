import { hc } from "hono/client";
import { serverApp } from "@/server/dashboard-api-app";

export const dashboardAPIClient = hc<typeof serverApp>("/");
