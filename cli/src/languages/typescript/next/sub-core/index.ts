/**
 * T3 Stack Configuration Options
 */
export interface T3Options {
  trpc: boolean;
  orm: "prisma" | "drizzle" | "none";
  nextAuth: boolean;
  tailwind: boolean;
  dbProvider: "mysql" | "postgres" | "planetscale" | "sqlite";
  appRouter: boolean;
}

/**
 * Default T3 options (recommended stack)
 */
export const DEFAULT_T3_OPTIONS: T3Options = {
  trpc: true,
  orm: "drizzle",
  nextAuth: false,
  tailwind: true,
  dbProvider: "postgres",
  appRouter: true,
};

/**
 * Prompts user to configure T3 stack options
 */
export const promptT3Options = (): T3Options => {
  console.log("\n📦 T3 Stack Configuration\n");

  // Router
  const appRouterInput = prompt("  Use App Router? (Y/n): ") || "y";
  const appRouter = appRouterInput.toLowerCase() !== "n";

  // API
  const trpcInput = prompt("  Add tRPC? (Y/n): ") || "y";
  const trpc = trpcInput.toLowerCase() !== "n";

  // ORM
  console.log("\n  ORM Options: prisma, drizzle, none");
  const ormInput = prompt("  Add ORM? (drizzle): ") || "drizzle";
  const orm = (["prisma", "drizzle", "none"].includes(ormInput)
    ? ormInput
    : "drizzle") as T3Options["orm"];

  // Database Provider (only if ORM selected)
  let dbProvider: T3Options["dbProvider"] = "sqlite";
  if (orm !== "none") {
    console.log("\n  Database: postgres, mysql, sqlite, planetscale");
    const dbInput = prompt("  Database provider? (postgres): ") || "postgres";
    dbProvider = (
      ["postgres", "mysql", "sqlite", "planetscale"].includes(dbInput)
        ? dbInput
        : "postgres"
    ) as T3Options["dbProvider"];
  }

  // Authentication
  const authInput = prompt("\n  Add NextAuth.js? (y/N): ") || "n";
  const nextAuth = authInput.toLowerCase() === "y";

  // Styling
  const tailwindInput = prompt("  Add Tailwind CSS? (Y/n): ") || "y";
  const tailwind = tailwindInput.toLowerCase() !== "n";

  return {
    trpc,
    orm,
    nextAuth,
    tailwind,
    dbProvider,
    appRouter,
  };
};

/**
 * Builds CLI arguments from T3 options
 */
export const buildT3Args = (
  name: string,
  options: T3Options,
): string[] => {
  const args: string[] = [
    "create",
    "t3-app@latest",
    name,
    "--CI",
    "--noGit",
    "--noInstall",
    "-y",
  ];

  // Router
  if (options.appRouter) {
    args.push("--appRouter");
  }

  // API
  if (options.trpc) {
    args.push("--trpc");
  }

  // ORM
  if (options.orm === "prisma") {
    args.push("--prisma");
  } else if (options.orm === "drizzle") {
    args.push("--drizzle");
  }

  // Database (only if ORM is selected)
  if (options.orm !== "none") {
    args.push(`--dbProvider=${options.dbProvider}`);
  }

  // Authentication
  if (options.nextAuth) {
    args.push("--nextAuth");
  }

  // Styling
  if (options.tailwind) {
    args.push("--tailwind");
  }

  return args;
};

/**
 * Displays summary of selected options
 */
export const displayT3Summary = (options: T3Options): void => {
  console.log("\n✨ Selected stack:");
  console.log(`   Router:   ${options.appRouter ? "App Router" : "Pages Router"}`);
  console.log(`   API:      ${options.trpc ? "tRPC" : "None"}`);
  console.log(`   ORM:      ${options.orm === "none" ? "None" : options.orm}`);
  if (options.orm !== "none") {
    console.log(`   Database: ${options.dbProvider}`);
  }
  console.log(`   Auth:     ${options.nextAuth ? "NextAuth.js" : "None"}`);
  console.log(`   Styling:  ${options.tailwind ? "Tailwind CSS" : "None"}`);
  console.log("");
};
