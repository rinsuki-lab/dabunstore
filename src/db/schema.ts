import { bigint, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
    internalId: bigint({mode: "bigint"}).primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid().notNull().unique().generatedAlwaysAs("gen_random_uuid()"),
    content: text().notNull(),
})
