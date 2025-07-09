import { serve } from '@hono/node-server';
import { Hono } from "hono";
import routes from './routes/index.js';

const app = new Hono();

app.get("/", async c => {
    return c.text("Hello, World!");
})

app.route('/', routes);

serve(app)