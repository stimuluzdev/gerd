/**
 * React Project Configuration Options
 */
export interface ReactOptions {
  bundler: "bun" | "vite";
  // Vite-specific options
  template?: "react" | "react-ts" | "react-swc" | "react-swc-ts";
  packageManager?: "npm" | "pnpm" | "bun";
}

/**
 * Prompts user to configure React project options
 */
export const promptReactOptions = (): ReactOptions => {
  console.log("\n📦 React Project Configuration\n");

  // Bundler choice
  console.log("  Bundler options: bun, vite");
  const bundlerInput = prompt("  Bundler? (vite): ") || "vite";
  const bundler = (["bun", "vite"].includes(bundlerInput)
    ? bundlerInput
    : "vite") as ReactOptions["bundler"];

  if (bundler === "bun") {
    return { bundler };
  }

  // Vite-specific options
  console.log("\n  📦 Vite Options");
  console.log("  Templates: react, react-ts, react-swc, react-swc-ts");
  const templateInput = prompt("  Template? (react-ts): ") || "react-ts";
  const template = (
    ["react", "react-ts", "react-swc", "react-swc-ts"].includes(templateInput)
      ? templateInput
      : "react-ts"
  ) as ReactOptions["template"];

  console.log("  Package managers: npm, pnpm, bun");
  const pmInput = prompt("  Package manager? (pnpm): ") || "pnpm";
  const packageManager = (["npm", "pnpm", "bun"].includes(pmInput)
    ? pmInput
    : "pnpm") as ReactOptions["packageManager"];

  return {
    bundler,
    template,
    packageManager,
  };
};

/**
 * Builds Bun init arguments
 */
export const buildBunArgs = (name: string): string[] => {
  return ["init", "--react", name];
};

/**
 * Builds Vite create arguments based on package manager
 */
export const buildViteArgs = (
  name: string,
  options: ReactOptions,
): { cmd: string; args: string[] } => {
  const template = options.template || "react-ts";
  const pm = options.packageManager || "pnpm";

  switch (pm) {
    case "npm":
      return {
        cmd: "npm",
        args: ["create", "vite@latest", name, "--", "--template", template],
      };
    case "pnpm":
      return {
        cmd: "pnpm",
        args: ["create", "vite@latest", name, "--template", template],
      };
    case "bun":
      return {
        cmd: "bun",
        args: ["create", "vite", name, "--template", template],
      };
    default:
      return {
        cmd: "pnpm",
        args: ["create", "vite@latest", name, "--template", template],
      };
  }
};

/**
 * Displays summary of selected options
 */
export const displayReactSummary = (options: ReactOptions): void => {
  console.log("\n✨ Selected configuration:");
  console.log(`   Bundler:  ${options.bundler === "bun" ? "Bun" : "Vite"}`);
  if (options.bundler === "vite") {
    console.log(`   Template: ${options.template}`);
    console.log(`   Package:  ${options.packageManager}`);
  }
  console.log("");
};

/**
 * Returns the install and dev commands based on bundler/pm choice
 */
export const getNextSteps = (
  name: string,
  options: ReactOptions,
): string[] => {
  if (options.bundler === "bun") {
    return [
      `cd ${name}`,
      "bun install",
      "bun dev",
    ];
  }

  const pm = options.packageManager || "pnpm";
  const installCmd = pm === "npm" ? "npm install" : `${pm} install`;
  const devCmd = pm === "npm" ? "npm run dev" : `${pm} dev`;

  return [
    `cd ${name}`,
    installCmd,
    devCmd,
  ];
};
