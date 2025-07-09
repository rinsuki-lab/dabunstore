import { serve } from '@hono/node-server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from "hono";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();

app.get("/", async c => {
    return c.text("Hello, World!");
})

serve(app)