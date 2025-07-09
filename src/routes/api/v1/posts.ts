import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { postsTable } from '../../../db/schema.js';
import { db } from '../../../db/index.js';

const posts = new Hono();

export default posts.post(
  '/',
  zValidator('json', z.object({
    content: z.string().min(1, 'Content is required')
  })),
  async (c) => {
    const data = c.req.valid('json');
    
    const [newPost] = await db.insert(postsTable).values({
      content: data.content
    }).returning();
    
    return c.json({
      message: 'Post created successfully',
      data: newPost
    }, 201);
  }
);