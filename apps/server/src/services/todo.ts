import { and, asc, eq, isNotNull } from "drizzle-orm";
import { todosTable } from "../schema/index.js";
import { db } from "./database.js";

export type TodoPriority = "none" | "low" | "medium" | "high";

export type Todo = {
  id: string;
  listId: string | null;
  title: string;
  notes: string;
  completed: boolean;
  priority: TodoPriority;
  dueAt: number | null;
  createdAt: number;
  updatedAt: number;
};

const PRIORITIES = new Set<TodoPriority>(["none", "low", "medium", "high"]);

const toTodo = (row: typeof todosTable.$inferSelect): Todo => ({
  id: row.id,
  listId: row.list_id,
  title: row.title,
  notes: row.notes,
  completed: row.completed,
  priority: PRIORITIES.has(row.priority as TodoPriority)
    ? (row.priority as TodoPriority)
    : "none",
  dueAt: row.due_at ? row.due_at.getTime() : null,
  createdAt: row.created_at.getTime(),
  updatedAt: row.updated_at.getTime(),
});

const createId = () => crypto.randomUUID();

export const listTodos = async (): Promise<Todo[]> => {
  const rows = await db
    .select()
    .from(todosTable)
    .orderBy(asc(todosTable.created_at));
  return rows.map(toTodo).reverse();
};

export const createTodo = async (input: {
  title: string;
  notes?: string;
  listId?: string | null;
  priority?: TodoPriority;
  dueAt?: number | null;
}): Promise<Todo> => {
  const title = input.title.trim();
  if (!title) throw new Error("Todo title is required");

  const now = new Date();
  const id = createId();

  await db.insert(todosTable).values({
    id,
    list_id: input.listId ?? null,
    title,
    notes: (input.notes ?? "").trim(),
    completed: false,
    priority: input.priority ?? "none",
    due_at: input.dueAt == null ? null : new Date(input.dueAt),
    created_at: now,
    updated_at: now,
  });

  const [row] = await db.select().from(todosTable).where(eq(todosTable.id, id));
  if (!row) throw new Error("Failed to create todo");
  return toTodo(row);
};

export const updateTodo = async (input: {
  id: string;
  title?: string;
  notes?: string;
  listId?: string | null;
  completed?: boolean;
  priority?: TodoPriority;
  dueAt?: number | null;
}): Promise<Todo> => {
  const [existing] = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, input.id));
  if (!existing) throw new Error("Todo not found");

  const patch: Partial<typeof todosTable.$inferInsert> = {
    updated_at: new Date(),
  };

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Todo title is required");
    patch.title = title;
  }

  if (input.notes !== undefined) {
    patch.notes = input.notes.trim();
  }

  if (input.listId !== undefined) {
    patch.list_id = input.listId;
  }

  if (input.completed !== undefined) {
    patch.completed = input.completed;
  }

  if (input.priority !== undefined) {
    patch.priority = input.priority;
  }

  if (input.dueAt !== undefined) {
    patch.due_at = input.dueAt == null ? null : new Date(input.dueAt);
  }

  await db.update(todosTable).set(patch).where(eq(todosTable.id, input.id));

  const [row] = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, input.id));
  if (!row) throw new Error("Todo not found");
  return toTodo(row);
};

export const deleteTodo = async (id: string): Promise<{ id: string }> => {
  const [existing] = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id));
  if (!existing) throw new Error("Todo not found");

  await db.delete(todosTable).where(eq(todosTable.id, id));
  return { id };
};

export const clearCompletedTodos = async (listId?: string | null) => {
  const completed = await db
    .select({ id: todosTable.id, listId: todosTable.list_id })
    .from(todosTable)
    .where(eq(todosTable.completed, true));

  const targets =
    listId === undefined
      ? completed
      : listId === null
        ? completed.filter((row) => row.listId === null)
        : completed.filter((row) => row.listId === listId);

  for (const row of targets) {
    await db.delete(todosTable).where(eq(todosTable.id, row.id));
  }

  return { deleted: targets.length };
};

export const countOpenTodos = async () => {
  const rows = await db
    .select({ id: todosTable.id })
    .from(todosTable)
    .where(eq(todosTable.completed, false));
  return rows.length;
};

export const hasDueTodos = async () => {
  const rows = await db
    .select({ id: todosTable.id })
    .from(todosTable)
    .where(and(eq(todosTable.completed, false), isNotNull(todosTable.due_at)));
  return rows.length > 0;
};
