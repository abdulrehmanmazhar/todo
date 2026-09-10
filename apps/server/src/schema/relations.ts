import { relations } from "drizzle-orm";
import { listsTable, todosTable } from "./tables.js";

export const listsRelations = relations(listsTable, ({ many }) => ({
  todos: many(todosTable),
}));

export const todosRelations = relations(todosTable, ({ one }) => ({
  list: one(listsTable, {
    fields: [todosTable.list_id],
    references: [listsTable.id],
  }),
}));
