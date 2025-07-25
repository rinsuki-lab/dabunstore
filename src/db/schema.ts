import { bigint, integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const postsTable = pgTable("posts", {
    internalId: uuid().notNull().primaryKey(),
    uuid: uuid().notNull().unique().default(sql`gen_random_uuid()`),
    content: text().notNull(),
})

export const tagsTable = pgTable("tags", {
    id: serial().notNull().primaryKey(),
    normalizedTitle: text().notNull().unique(),
    primaryTitle: text().notNull(),
})

export const postTagsTable = pgTable("post_tags", {
    id: serial().notNull().primaryKey(),
    postInternalId: uuid().notNull().references(() => postsTable.internalId),
    tagId: integer().references(() => tagsTable.id),
    title: text().notNull(),
})
