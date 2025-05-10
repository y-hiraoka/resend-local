import { serverApp } from "@/server/app";
import { handle } from "hono/vercel";

export const GET = handle(serverApp);
export const POST = handle(serverApp);
export const PUT = handle(serverApp);
export const PATCH = handle(serverApp);
export const DELETE = handle(serverApp);
export const HEAD = handle(serverApp);
export const OPTIONS = handle(serverApp);
