import { Hono } from "hono";

export const serverApp = new Hono().get("/hello", (c) => c.text("Hello Hono!"));
