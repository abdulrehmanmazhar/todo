try {
  process.loadEnvFile();
} catch {
  // Optional .env — missing file is fine in production SEA builds.
}

export const ENV = {
  MODE: process.env.NODE_ENV || "PRODUCTION",
} as const;
