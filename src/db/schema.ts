import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const postsTable = pgTable("posts", {
    internalId: uuid().notNull().primaryKey(),
    uuid: uuid().notNull().unique().default(sql`gen_random_uuid()`),
    content: text().notNull(),
})
