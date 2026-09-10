import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { sql } from "drizzle-orm";
import { databasePath, migrationsPath } from "../utils/paths.js";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { migrate } from "drizzle-orm/sqlite-proxy/migrator";

mkdirSync(dirname(databasePath), { recursive: true });
const databaseInstance = new DatabaseSync(databasePath);

export const db = drizzle(async (sql, params, method) => {
  const statement = databaseInstance.prepare(sql);

  if (method === "run") {
    statement.run(...params);
    return { rows: [] };
  }

  if (method === "get") {
    const row = statement.get(...params);
    return { rows: row === undefined ? [] : [Object.values(row)] };
  }

  const rows = statement.all(...params);
  return { rows: rows.map((row) => Object.values(row)) };
});

const runMigrations = async () => {
  await migrate(
    db,
    async (queries) => {
      for (const query of queries) {
        databaseInstance.exec(query);
      }
    },
    { migrationsFolder: migrationsPath },
  );
};

export const connectDatabase = async () => {
  try {
    await db.run(sql`SELECT 1`);
    await runMigrations();
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};
