import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { postsTable, tagsTable, postTagsTable } from '../../../db/schema.js';
import { db } from '../../../db/index.js';
import { ulid, ulidToUUID } from 'ulid';
import { desc, inArray, eq } from 'drizzle-orm';
import { parseText } from '../../../shared/parse-text.js';
import { extractTags } from '../../../shared/extract-tags.js';
import { normalizeTag } from '../../../shared/normalize-tag.js';

type PostFromDB = typeof postsTable.$inferSelect;

function formatPostForAPI(post: PostFromDB) {
  return {
    id: post.uuid,
    content: post.content,
  };
}

export default new Hono().get('/', zValidator("query", z.object({
  tag: z.string().optional(),
}).optional()), async (c) => {
  const { tag } = c.req.valid("query") ?? {};
  
  if (tag != null) {
    const postsWithTag = await db.select({
      post: postsTable
    })
      .from(postsTable)
      .innerJoin(postTagsTable, eq(postTagsTable.postInternalId, postsTable.internalId))
      .innerJoin(tagsTable, eq(tagsTable.id, postTagsTable.tagId))
      .where(eq(tagsTable.normalizedTitle, normalizeTag(tag)))
      .orderBy(desc(postsTable.internalId));
    
    return c.json({
      data: postsWithTag.map(i => formatPostForAPI(i.post))
    });
  }
  
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
    
    const parsedContent = parseText(data.content);
    const { hashtags } = extractTags(parsedContent);
    
    const result = await db.transaction(async (tx) => {
      const postId = ulidToUUID(ulid());
      
      const [newPost] = await tx.insert(postsTable).values({
        internalId: postId,
        content: data.content
      }).returning();

      if (newPost == null) {
        throw new Error('Failed to create post');
      }
      
      if (hashtags.length > 0) {
        const normalizedTitles = hashtags.map(h => h.normalized);
        const existingTags = await tx.select()
          .from(tagsTable)
          .where(inArray(tagsTable.normalizedTitle, normalizedTitles));
        
        const existingTagMap = new Map(existingTags.map(tag => [tag.normalizedTitle, tag.id]));
        const tagsToCreate = hashtags.filter(h => !existingTagMap.has(h.normalized));
        
        if (tagsToCreate.length) {
          const newTags = await tx.insert(tagsTable).values(
            tagsToCreate.map(h => ({
              normalizedTitle: h.normalized,
              primaryTitle: h.original
            }))
          ).returning();

          for (const tag of newTags) {
            existingTagMap.set(tag.normalizedTitle, tag.id)
          }
        }
        
        await tx.insert(postTagsTable).values(hashtags.map(hashtag => ({
          postInternalId: postId,
          tagId: existingTagMap.get(hashtag.normalized)!,
          title: hashtag.original
        })));
      }
      
      return newPost;
    });
    
    return c.json({
      message: 'Post created successfully',
      data: formatPostForAPI(result)
    }, 201);
  }
);