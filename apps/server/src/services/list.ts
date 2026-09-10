import { asc, eq } from "drizzle-orm";
import { listsTable } from "../schema/index.js";
import { db } from "./database.js";

export type ListColor =
  | "default"
  | "blue"
  | "green"
  | "violet"
  | "orange"
  | "rose";

export type TodoList = {
  id: string;
  name: string;
  color: ListColor;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

const COLORS = new Set<ListColor>([
  "default",
  "blue",
  "green",
  "violet",
  "orange",
  "rose",
]);

const toList = (row: typeof listsTable.$inferSelect): TodoList => ({
  id: row.id,
  name: row.name,
  color: COLORS.has(row.color as ListColor)
    ? (row.color as ListColor)
    : "default",
  sortOrder: row.sort_order,
  createdAt: row.created_at.getTime(),
  updatedAt: row.updated_at.getTime(),
});

const createId = () => crypto.randomUUID();

export const listLists = async (): Promise<TodoList[]> => {
  const rows = await db
    .select()
    .from(listsTable)
    .orderBy(asc(listsTable.sort_order), asc(listsTable.created_at));
  return rows.map(toList);
};

export const createList = async (input: {
  name: string;
  color?: ListColor;
}): Promise<TodoList> => {
  const name = input.name.trim();
  if (!name) throw new Error("List name is required");

  const existing = await listLists();
  const now = new Date();
  const id = createId();
  const color = input.color ?? "default";

  await db.insert(listsTable).values({
    id,
    name,
    color,
    sort_order: existing.length,
    created_at: now,
    updated_at: now,
  });

  const [row] = await db.select().from(listsTable).where(eq(listsTable.id, id));
  if (!row) throw new Error("Failed to create list");
  return toList(row);
};

export const updateList = async (input: {
  id: string;
  name?: string;
  color?: ListColor;
}): Promise<TodoList> => {
  const [existing] = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.id, input.id));
  if (!existing) throw new Error("List not found");

  const patch: Partial<typeof listsTable.$inferInsert> = {
    updated_at: new Date(),
  };

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw new Error("List name is required");
    patch.name = name;
  }

  if (input.color !== undefined) {
    patch.color = input.color;
  }

  await db.update(listsTable).set(patch).where(eq(listsTable.id, input.id));

  const [row] = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.id, input.id));
  if (!row) throw new Error("List not found");
  return toList(row);
};

export const deleteList = async (id: string): Promise<{ id: string }> => {
  const [existing] = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.id, id));
  if (!existing) throw new Error("List not found");

  await db.delete(listsTable).where(eq(listsTable.id, id));
  return { id };
};
