import { Channel } from "./protocol/channel";
import type { ChannelMessage } from "./protocol/types";
import { createId } from "./protocol/types";
import {
  createMemoryTransport,
  createNeutralinoTransport,
  isNeutralinoRuntime,
} from "./transport";

export type ListColor =
  | "default"
  | "blue"
  | "green"
  | "violet"
  | "orange"
  | "rose";

export type TodoPriority = "none" | "low" | "medium" | "high";

export type TodoList = {
  id: string;
  name: string;
  color: ListColor;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

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

export type DataSnapshot = {
  lists: TodoList[];
  todos: Todo[];
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const createMemoryBackend = (reply: (message: ChannelMessage) => void) => {
  let lists: TodoList[] = [];
  let todos: Todo[] = [];

  const snapshot = (): DataSnapshot => ({ lists, todos });

  const publish = () => {
    reply({ type: "event", name: "data.changed", payload: snapshot() });
  };

  return async (message: ChannelMessage) => {
    if (message.type !== "request") return;

    const ok = (result?: unknown) =>
      reply(
        result === undefined
          ? { type: "response", id: message.id, ok: true }
          : { type: "response", id: message.id, ok: true, result },
      );

    const fail = (error: unknown) =>
      reply({
        type: "response",
        id: message.id,
        ok: false,
        error: {
          message: error instanceof Error ? error.message : "Request failed",
          code: "HANDLER_ERROR",
        },
      });

    try {
      switch (message.method) {
        case "app.bootstrap":
          return ok(snapshot());

        case "app.shutdown":
          return ok({
            accepted: true,
            reason: String(asRecord(message.params).reason ?? "unknown"),
          });

        case "lists.list":
          return ok(lists);

        case "lists.create": {
          const record = asRecord(message.params);
          const name = String(record.name ?? "").trim();
          if (!name) throw new Error("List name is required");
          const now = Date.now();
          const list: TodoList = {
            id: createId(),
            name,
            color: (record.color as ListColor) || "default",
            sortOrder: lists.length,
            createdAt: now,
            updatedAt: now,
          };
          lists = [...lists, list];
          publish();
          return ok(list);
        }

        case "lists.update": {
          const record = asRecord(message.params);
          const id = String(record.id ?? "");
          const current = lists.find((list) => list.id === id);
          if (!current) throw new Error("List not found");
          const name =
            record.name === undefined
              ? current.name
              : String(record.name).trim();
          if (!name) throw new Error("List name is required");
          const updated: TodoList = {
            ...current,
            name,
            color:
              record.color === undefined
                ? current.color
                : (record.color as ListColor),
            updatedAt: Date.now(),
          };
          lists = lists.map((list) => (list.id === id ? updated : list));
          publish();
          return ok(updated);
        }

        case "lists.delete": {
          const id = String(asRecord(message.params).id ?? "");
          if (!lists.some((list) => list.id === id)) {
            throw new Error("List not found");
          }
          lists = lists.filter((list) => list.id !== id);
          todos = todos.map((todo) =>
            todo.listId === id ? { ...todo, listId: null } : todo,
          );
          publish();
          return ok({ id });
        }

        case "todos.list":
          return ok(todos);

        case "todos.create": {
          const record = asRecord(message.params);
          const title = String(record.title ?? "").trim();
          if (!title) throw new Error("Todo title is required");
          const now = Date.now();
          const todo: Todo = {
            id: createId(),
            listId:
              record.listId === undefined
                ? null
                : (record.listId as string | null),
            title,
            notes: String(record.notes ?? "").trim(),
            completed: false,
            priority: (record.priority as TodoPriority) || "none",
            dueAt:
              record.dueAt === undefined || record.dueAt === null
                ? null
                : Number(record.dueAt),
            createdAt: now,
            updatedAt: now,
          };
          todos = [todo, ...todos];
          publish();
          return ok(todo);
        }

        case "todos.update": {
          const record = asRecord(message.params);
          const id = String(record.id ?? "");
          const current = todos.find((todo) => todo.id === id);
          if (!current) throw new Error("Todo not found");

          const title =
            record.title === undefined
              ? current.title
              : String(record.title).trim();
          if (!title) throw new Error("Todo title is required");

          const updated: Todo = {
            ...current,
            title,
            notes:
              record.notes === undefined
                ? current.notes
                : String(record.notes).trim(),
            listId:
              record.listId === undefined
                ? current.listId
                : (record.listId as string | null),
            completed:
              record.completed === undefined
                ? current.completed
                : Boolean(record.completed),
            priority:
              record.priority === undefined
                ? current.priority
                : (record.priority as TodoPriority),
            dueAt:
              record.dueAt === undefined
                ? current.dueAt
                : record.dueAt === null
                  ? null
                  : Number(record.dueAt),
            updatedAt: Date.now(),
          };
          todos = todos.map((todo) => (todo.id === id ? updated : todo));
          publish();
          return ok(updated);
        }

        case "todos.delete": {
          const id = String(asRecord(message.params).id ?? "");
          if (!todos.some((todo) => todo.id === id)) {
            throw new Error("Todo not found");
          }
          todos = todos.filter((todo) => todo.id !== id);
          publish();
          return ok({ id });
        }

        case "todos.clearCompleted": {
          const record = asRecord(message.params);
          const before = todos.length;
          if (!("listId" in record)) {
            todos = todos.filter((todo) => !todo.completed);
          } else if (record.listId === null) {
            todos = todos.filter(
              (todo) => !(todo.completed && todo.listId === null),
            );
          } else {
            const listId = String(record.listId);
            todos = todos.filter(
              (todo) => !(todo.completed && todo.listId === listId),
            );
          }
          publish();
          return ok({ deleted: before - todos.length });
        }

        default:
          return reply({
            type: "response",
            id: message.id,
            ok: false,
            error: {
              message: `Unknown method: ${message.method}`,
              code: "METHOD_NOT_FOUND",
            },
          });
      }
    } catch (error) {
      fail(error);
    }
  };
};

export const channel = (() => {
  if (isNeutralinoRuntime()) {
    const next = new Channel(createNeutralinoTransport());
    next.start();
    return next;
  }

  const memory = createMemoryTransport();
  const next = new Channel(memory);
  next.start();
  memory.attachHandler((message, reply) => {
    void createMemoryBackend(reply)(message);
  });
  return next;
})();

export const todosApi = {
  bootstrap: () => channel.request<DataSnapshot>("app.bootstrap"),

  listLists: () => channel.request<TodoList[]>("lists.list"),
  createList: (input: { name: string; color?: ListColor }) =>
    channel.request<TodoList>("lists.create", input),
  updateList: (input: { id: string; name?: string; color?: ListColor }) => {
    const params: { id: string; name?: string; color?: ListColor } = {
      id: input.id,
    };
    if (input.name !== undefined) params.name = input.name;
    if (input.color !== undefined) params.color = input.color;
    return channel.request<TodoList>("lists.update", params);
  },
  deleteList: (id: string) =>
    channel.request<{ id: string }>("lists.delete", { id }),

  listTodos: () => channel.request<Todo[]>("todos.list"),
  createTodo: (input: {
    title: string;
    notes?: string;
    listId?: string | null;
    priority?: TodoPriority;
    dueAt?: number | null;
  }) => channel.request<Todo>("todos.create", input),
  updateTodo: (input: {
    id: string;
    title?: string;
    notes?: string;
    listId?: string | null;
    completed?: boolean;
    priority?: TodoPriority;
    dueAt?: number | null;
  }) => channel.request<Todo>("todos.update", input),
  deleteTodo: (id: string) =>
    channel.request<{ id: string }>("todos.delete", { id }),
  clearCompleted: (listId?: string | null) => {
    if (listId === undefined) {
      return channel.request<{ deleted: number }>("todos.clearCompleted");
    }
    return channel.request<{ deleted: number }>("todos.clearCompleted", {
      listId,
    });
  },

  onDataChanged: (handler: (data: DataSnapshot) => void) =>
    channel.on("data.changed", (payload) => {
      const data = payload as DataSnapshot | undefined;
      if (data && Array.isArray(data.lists) && Array.isArray(data.todos)) {
        handler(data);
      }
    }),
};
