import { command } from "@utils/index.ts";

/**
 * Phoenix Project Configuration Options
 */
export interface PhoenixOptions {
  projectType: "api" | "full";
  database: "postgres" | "mysql" | "sqlite3" | "mssql" | "none";
  dashboard: boolean;
  mailer: boolean;
}

/**
 * Validates if a name follows Elixir naming conventions
 * Must start with a letter and contain only lowercase letters, numbers, and underscores
 */
export const isValidElixirName = (name: string): boolean => {
  return /^[a-z][a-z0-9_]*$/.test(name);
};

/**
 * Sanitizes a project name to follow Elixir naming conventions
 * Converts to lowercase, replaces hyphens with underscores, removes invalid chars
 */
export const sanitizeElixirName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/-/g, "_") // Replace hyphens with underscores
    .replace(/[^a-z0-9_]/g, "") // Remove invalid characters
    .replace(/^[^a-z]+/, ""); // Ensure starts with a letter
};

/**
 * Prompts for a valid Elixir project name
 */
export const promptValidElixirName = (initialName: string): string => {
  if (isValidElixirName(initialName)) {
    return initialName;
  }

  const sanitized = sanitizeElixirName(initialName);
  console.log(`\n⚠️  Elixir requires lowercase names with underscores (no hyphens).`);
  console.log(`   "${initialName}" → "${sanitized}"`);

  const useInput = prompt(`\n  Use "${sanitized}"? (Y/n): `) || "y";
  if (useInput.toLowerCase() === "n") {
    const customName = prompt("  Enter a valid name (lowercase, underscores): ") || sanitized;
    return isValidElixirName(customName) ? customName : sanitized;
  }

  return sanitized;
};

/**
 * Checks if Elixir/Mix is installed
 */
export const checkMixInstalled = async (): Promise<boolean> => {
  const { success } = await command("mix", ["--version"]);
  return success;
};

/**
 * Gets the Mix version string
 */
export const getMixVersion = async (): Promise<string> => {
  const { output } = await command("mix", ["--version"]);
  return output.trim();
};

/**
 * Shows installation instructions for Elixir
 */
export const showElixirInstallInstructions = (): void => {
  console.log("❌ Elixir/Mix is not installed.\n");
  console.log("Install Elixir first:\n");
  console.log("  macOS:   brew install elixir");
  console.log("  Ubuntu:  sudo apt install elixir erlang");
  console.log("  Windows: choco install elixir");
  console.log("\n  Or visit: https://elixir-lang.org/install.html\n");
  console.log("After installing Elixir, install Phoenix:");
  console.log("  mix archive.install hex phx_new");
};

/**
 * Prompts user to configure Phoenix project options
 */
export const promptPhoenixOptions = (): PhoenixOptions => {
  console.log("\n📦 Phoenix Project Configuration\n");

  // Project type
  console.log("  Project types: api, full");
  const typeInput = prompt("  Project type? (api): ") || "api";
  const projectType = (["api", "full"].includes(typeInput)
    ? typeInput
    : "api") as PhoenixOptions["projectType"];

  // Database
  console.log("\n  Databases: postgres, mysql, sqlite3, mssql, none");
  const dbInput = prompt("  Database? (postgres): ") || "postgres";
  const database = (
    ["postgres", "mysql", "sqlite3", "mssql", "none"].includes(dbInput)
      ? dbInput
      : "postgres"
  ) as PhoenixOptions["database"];

  // Dashboard (default: yes for full, no for api)
  const defaultDashboard = projectType === "full" ? "y" : "n";
  const dashboardPrompt =
    projectType === "full"
      ? "  Include LiveDashboard? (Y/n): "
      : "  Include LiveDashboard? (y/N): ";
  const dashboardInput = prompt(dashboardPrompt) || defaultDashboard;
  const dashboard = dashboardInput.toLowerCase() === "y";

  // Mailer
  const mailerInput = prompt("  Include Mailer? (y/N): ") || "n";
  const mailer = mailerInput.toLowerCase() === "y";

  return {
    projectType,
    database,
    dashboard,
    mailer,
  };
};

/**
 * Builds mix phx.new arguments from options
 */
export const buildPhoenixArgs = (
  name: string,
  options: PhoenixOptions,
): string[] => {
  const args: string[] = ["phx.new", name];

  // API-only: no HTML, LiveView, or assets
  if (options.projectType === "api") {
    args.push("--no-html", "--no-live", "--no-assets");
  }

  // Database
  if (options.database === "none") {
    args.push("--no-ecto");
  } else {
    args.push("--database", options.database);
  }

  // Dashboard
  if (!options.dashboard) {
    args.push("--no-dashboard");
  }

  // Mailer
  if (!options.mailer) {
    args.push("--no-mailer");
  }

  return args;
};

/**
 * Displays summary of selected options
 */
export const displayPhoenixSummary = (options: PhoenixOptions): void => {
  console.log("\n✨ Selected configuration:");
  console.log(
    `   Type:      ${options.projectType === "api" ? "API Only" : "Full UI with LiveView"}`,
  );
  console.log(
    `   Database:  ${options.database === "none" ? "None (no Ecto)" : options.database}`,
  );
  console.log(`   Dashboard: ${options.dashboard ? "Yes" : "No"}`);
  console.log(`   Mailer:    ${options.mailer ? "Yes" : "No"}`);
  console.log("");
};
