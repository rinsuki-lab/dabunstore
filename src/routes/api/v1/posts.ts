import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { postsTable } from '../../../db/schema.js';
import { db } from '../../../db/index.js';
import { ulid, ulidToUUID } from 'ulid';
import { desc } from 'drizzle-orm';

type PostFromDB = typeof postsTable.$inferSelect;

function formatPostForAPI(post: PostFromDB) {
  return {
    id: post.uuid,
    content: post.content,
  };
}

export default new Hono().get('/', async (c) => {
  const allPosts = await db.select()
    .from(postsTable)
    .orderBy(desc(postsTable.internalId));
  
  const formattedPosts = allPosts.map(formatPostForAPI);
  
  return c.json({
    data: formattedPosts
  });
}).post(
  '/',
  zValidator('json', z.object({
    content: z.string().min(1, 'Content is required')
  })),
  async (c) => {
    const data = c.req.valid('json');
    
    const [newPost] = await db.insert(postsTable).values({
      internalId: ulidToUUID(ulid()),
      content: data.content
    }).returning();

    if (newPost == null) {
      return c.json({
        message: 'Failed to create post'
      }, 500);
    }
    
    return c.json({
      message: 'Post created successfully',
      data: formatPostForAPI(newPost)
    }, 201);
  }
);