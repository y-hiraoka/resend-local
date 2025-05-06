import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onClose: () => console.log("Connection closed"),
      onMessage: (event, ws) => {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server!");
      },
    };
  }),
);

const server = serve({
  fetch: app.fetch,
  port: 1234,
});
injectWebSocket(server);

app.use("*", serveStatic({ root: "./dist/client" }));

export type ServerApp = typeof app;
