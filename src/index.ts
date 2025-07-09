import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from "hono";
import routes from './routes/index.js';

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();

app.use('*', async (c, next) => {
    c.set('db', db);
    await next();
});

app.get("/", async c => {
    return c.text("Hello, World!");
})

app.route('/', routes);

serve(app)