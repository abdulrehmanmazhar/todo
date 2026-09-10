import { readFileSync } from "node:fs";
import { Channel } from "./protocol/channel.js";
import type { NeutralinoAuth } from "./services/transport.js";
import { connectNeutralinoTransport } from "./services/transport.js";
import { connectDatabase } from "./services/database.js";
import { registerExtensionLifecycle } from "./services/lifecycle.js";
import {
  createList,
  deleteList,
  listLists,
  updateList,
  type ListColor,
} from "./services/list.js";
import {
  clearCompletedTodos,
  createTodo,
  deleteTodo,
  listTodos,
  updateTodo,
  type TodoPriority,
} from "./services/todo.js";

const LIST_COLORS = new Set<ListColor>([
  "default",
  "blue",
  "green",
  "violet",
  "orange",
  "rose",
]);

const PRIORITIES = new Set<TodoPriority>(["none", "low", "medium", "high"]);

const readAuth = (): NeutralinoAuth => {
  const authData = readFileSync(process.stdin.fd, "utf-8");
  if (!authData) throw new Error("No auth data found");
  return JSON.parse(authData) as NeutralinoAuth;
};

const log = (message: string, type: "INFO" | "ERROR" = "INFO") => {
  const line = `[${type}]: ${message}`;
  if (type === "INFO") console.log(line);
  else console.error(line);
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, field: string): string => {
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  return value;
};

const asOptionalString = (
  value: unknown,
  field: string,
): string | undefined => {
  if (value === undefined) return undefined;
  return asString(value, field);
};

const asNullableString = (
  value: unknown,
  field: string,
): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return asString(value, field);
};

const asOptionalBoolean = (
  value: unknown,
  field: string,
): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new Error(`${field} must be a boolean`);
  return value;
};

const asOptionalNumber = (
  value: unknown,
  field: string,
): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${field} must be a number`);
  }
  return value;
};

const asNullableNumber = (
  value: unknown,
  field: string,
): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return asOptionalNumber(value, field) ?? null;
};

const asListColor = (value: unknown): ListColor | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !LIST_COLORS.has(value as ListColor)) {
    throw new Error("color is invalid");
  }
  return value as ListColor;
};

const asPriority = (value: unknown): TodoPriority | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !PRIORITIES.has(value as TodoPriority)) {
    throw new Error("priority is invalid");
  }
  return value as TodoPriority;
};

const main = async () => {
  await connectDatabase();

  const auth = readAuth();
  const transport = connectNeutralinoTransport(auth);

  const channel = new Channel(transport);
  channel.start();

  registerExtensionLifecycle(channel, transport, {
    exitCode: 1,
    log,
  });

  const snapshot = async () => {
    const [lists, todos] = await Promise.all([listLists(), listTodos()]);
    return { lists, todos };
  };

  const publish = async () => {
    const data = await snapshot();
    await channel.emit("data.changed", data);
    return data;
  };

  channel.handle("app.bootstrap", async () => snapshot());

  channel.handle("lists.list", async () => listLists());

  channel.handle("lists.create", async (params) => {
    const record = asRecord(params);
    const input: { name: string; color?: ListColor } = {
      name: asString(record.name, "name"),
    };
    const color = asListColor(record.color);
    if (color !== undefined) input.color = color;
    const list = await createList(input);
    await publish();
    return list;
  });

  channel.handle("lists.update", async (params) => {
    const record = asRecord(params);
    const input: {
      id: string;
      name?: string;
      color?: ListColor;
    } = { id: asString(record.id, "id") };

    const name = asOptionalString(record.name, "name");
    if (name !== undefined) input.name = name;

    const color = asListColor(record.color);
    if (color !== undefined) input.color = color;

    const list = await updateList(input);
    await publish();
    return list;
  });

  channel.handle("lists.delete", async (params) => {
    const result = await deleteList(asString(asRecord(params).id, "id"));
    await publish();
    return result;
  });

  channel.handle("todos.list", async () => listTodos());

  channel.handle("todos.create", async (params) => {
    const record = asRecord(params);
    const input: Parameters<typeof createTodo>[0] = {
      title: asString(record.title, "title"),
    };

    const notes = asOptionalString(record.notes, "notes");
    if (notes !== undefined) input.notes = notes;

    const listId = asNullableString(record.listId, "listId");
    if (listId !== undefined) input.listId = listId;

    const priority = asPriority(record.priority);
    if (priority !== undefined) input.priority = priority;

    const dueAt = asNullableNumber(record.dueAt, "dueAt");
    if (dueAt !== undefined) input.dueAt = dueAt;

    const todo = await createTodo(input);
    await publish();
    return todo;
  });

  channel.handle("todos.update", async (params) => {
    const record = asRecord(params);
    const input: Parameters<typeof updateTodo>[0] = {
      id: asString(record.id, "id"),
    };

    const title = asOptionalString(record.title, "title");
    if (title !== undefined) input.title = title;

    const notes = asOptionalString(record.notes, "notes");
    if (notes !== undefined) input.notes = notes;

    const listId = asNullableString(record.listId, "listId");
    if (listId !== undefined) input.listId = listId;

    const completed = asOptionalBoolean(record.completed, "completed");
    if (completed !== undefined) input.completed = completed;

    const priority = asPriority(record.priority);
    if (priority !== undefined) input.priority = priority;

    const dueAt = asNullableNumber(record.dueAt, "dueAt");
    if (dueAt !== undefined) input.dueAt = dueAt;

    const todo = await updateTodo(input);
    await publish();
    return todo;
  });

  channel.handle("todos.delete", async (params) => {
    const result = await deleteTodo(asString(asRecord(params).id, "id"));
    await publish();
    return result;
  });

  channel.handle("todos.clearCompleted", async (params) => {
    const record = asRecord(params);
    const listId =
      "listId" in record
        ? asNullableString(record.listId, "listId")
        : undefined;
    const result = await clearCompletedTodos(listId);
    await publish();
    return result;
  });

  transport.socket.onerror = () => log("Connection error!", "ERROR");
  transport.socket.onopen = () => log("Connected");
  transport.socket.onclose = () => {
    channel.stop();
    log("Disconnected");
    process.exit(1);
  };
};

main().catch((error) => {
  console.error("Error in main execution:", error);
  process.exit(1);
});
