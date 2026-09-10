import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestampAt = (title: string) =>
  integer(title, { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`);

export const listsTable = sqliteTable("lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull().default("default"),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: timestampAt("created_at"),
  updated_at: timestampAt("updated_at"),
});

export const todosTable = sqliteTable("todos", {
  id: text("id").primaryKey(),
  list_id: text("list_id").references(() => listsTable.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  notes: text("notes").notNull().default(""),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  priority: text("priority", {
    enum: ["none", "low", "medium", "high"],
  })
    .notNull()
    .default("none"),
  due_at: integer("due_at", { mode: "timestamp_ms" }),
  created_at: timestampAt("created_at"),
  updated_at: timestampAt("updated_at"),
});

export const settingsTable = sqliteTable("settings", {
  id: text("id").primaryKey(),
  group_name: text("group_name").notNull(),
  name: text("name").notNull(),
  content: text("content", { mode: "json" }).notNull(),
  created_at: timestampAt("created_at"),
  updated_at: timestampAt("updated_at"),
});
