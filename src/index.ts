import { serve } from '@hono/node-server';
import { Hono } from "hono";
import routes from './routes/index.js';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

app.route('/', routes);

app.use("/assets/*", serveStatic({ root: "./dist/frontend/" }))
app.use("*", serveStatic({ path: "./dist/frontend/index.html" }))

serve(app)