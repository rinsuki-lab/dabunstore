import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/node-postgres';
import { postsTable } from '../../../db/schema.js';
import { db } from '../../../db/index.js';

const posts = new Hono();

export default posts.post('/', async (c) => {
  const body = await c.req.json();
  
  if (!body.content) {
    return c.json({ error: 'Content is required' }, 400);
  }
  
  const [newPost] = await db.insert(postsTable).values({
    content: body.content
  }).returning();
  
  return c.json({
    message: 'Post created successfully',
    data: newPost
  }, 201);
});