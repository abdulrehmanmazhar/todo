import os from "node:os";
import { dirname, join } from "node:path";
import { ENV } from "../config/env.js";

const appName = "todo";

const appDataPath =
  process.platform === "win32"
    ? join(os.homedir(), "AppData", "Roaming")
    : process.platform === "darwin"
      ? join(os.homedir(), "Library", "Application Support")
      : join(os.homedir(), ".local", "share");

export const appDataRoot = join(appDataPath, appName);
export const databasePath = join(appDataRoot, "database.db");

/** Package root in dev; directory containing the SEA binary in production. */
export const serverRoot =
  ENV.MODE === "PRODUCTION"
    ? dirname(process.execPath)
    : join(dirname(process.argv[1] as string), "..");

export const migrationsPath = join(serverRoot, "migrations");
