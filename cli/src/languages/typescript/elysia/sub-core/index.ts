import { removePath, rewriteFile, writeFile } from "@utils/index.ts";

/**
 * Deployment configuration - files and scripts to remove for each option
 */
export const DEPLOYMENT_CONFIG = {
  vercel: {
    name: "Vercel (Serverless)",
    files: ["deploy/vercel", "api", "vercel.json", ".vercel"],
    scripts: ["vercel:dev", "vercel:deploy", "vercel:deploy:prod"],
    gitignorePatterns: ["# Vercel build output", "api/index.js"],
  },
  pm2: {
    name: "PM2 (VPS)",
    files: ["deploy/pm2", "ecosystem.config.cjs", "logs", ".env.pm2.example"],
    scripts: [
      "pm2:start",
      "pm2:start:prod",
      "pm2:stop",
      "pm2:reload",
      "pm2:logs",
      "pm2:monit",
      "deploy:pm2",
      "deploy:pm2:setup",
    ],
    gitignorePatterns: ["# PM2", "logs/", "dist/"],
  },
  pulumi: {
    name: "Pulumi/Kubernetes",
    files: ["infra"],
    scripts: [
      "infra:install",
      "infra:preview",
      "infra:dev",
      "infra:prod",
      "infra:destroy:dev",
      "infra:destroy:prod",
      "infra:check",
    ],
    gitignorePatterns: [],
  },
} as const;

export type DeploymentOption = keyof typeof DEPLOYMENT_CONFIG;

/**
 * Prompts user to select which deployment options to KEEP
 * Returns array of deployment options to exclude (remove)
 */
export const promptDeploymentOptions = (): DeploymentOption[] => {
  console.log("\n📦 Deployment Options");
  console.log("Select which deployment methods to keep in your project:\n");

  const options: DeploymentOption[] = ["vercel", "pm2", "pulumi"];
  const selected: DeploymentOption[] = [];

  for (const opt of options) {
    const config = DEPLOYMENT_CONFIG[opt];
    const answer = prompt(`  Keep ${config.name}? (y/N): `) || "n";
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      selected.push(opt);
    }
  }

  // Return the ones NOT selected (to be removed)
  return options.filter((opt) => !selected.includes(opt));
};

/**
 * Removes deployment files for excluded options
 */
export const cleanupDeploymentFiles = async (
  projectPath: string,
  excludedDeployments: DeploymentOption[],
): Promise<void> => {
  for (const deployment of excludedDeployments) {
    const config = DEPLOYMENT_CONFIG[deployment];
    console.log(`  Removing ${config.name} files...`);

    for (const file of config.files) {
      await removePath(`${projectPath}/${file}`);
    }
  }

  // If all deployments removed, also remove the deploy folder
  const allDeployments: DeploymentOption[] = ["vercel", "pm2", "pulumi"];
  if (allDeployments.every((d) => excludedDeployments.includes(d))) {
    await removePath(`${projectPath}/deploy`);
  } else {
    // Clean up empty deploy folder files if some deployments removed
    // Remove CLEANUP.md and DEPLOYMENT_COMPARISON.md only if all options are kept
    // Actually keep these for reference
  }
};

/**
 * Removes npm scripts for excluded deployments from package.json
 */
export const cleanupPackageJsonScripts = async (
  projectPath: string,
  excludedDeployments: DeploymentOption[],
): Promise<void> => {
  const pkgPath = `${projectPath}/package.json`;

  try {
    const content = await Deno.readTextFile(pkgPath);
    const pkg = JSON.parse(content);

    if (!pkg.scripts) return;

    const scriptsToRemove = new Set<string>();
    for (const deployment of excludedDeployments) {
      const config = DEPLOYMENT_CONFIG[deployment];
      for (const script of config.scripts) {
        scriptsToRemove.add(script);
      }
    }

    for (const script of scriptsToRemove) {
      delete pkg.scripts[script];
    }

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  } catch (error) {
    console.error(`  Warning: Could not update package.json: ${error}`);
  }
};

/**
 * Updates .gitignore to remove patterns for excluded deployments
 */
export const cleanupGitignore = async (
  projectPath: string,
  excludedDeployments: DeploymentOption[],
): Promise<void> => {
  const gitignorePath = `${projectPath}/.gitignore`;

  try {
    const content = await Deno.readTextFile(gitignorePath);
    const lines = content.split("\n");

    const patternsToRemove = new Set<string>();
    for (const deployment of excludedDeployments) {
      const config = DEPLOYMENT_CONFIG[deployment];
      for (const pattern of config.gitignorePatterns) {
        patternsToRemove.add(pattern);
      }
    }

    const filteredLines = lines.filter(
      (line) => !patternsToRemove.has(line.trim()),
    );

    await writeFile(gitignorePath, filteredLines.join("\n"));
  } catch (error) {
    console.error(`  Warning: Could not update .gitignore: ${error}`);
  }
};

/**
 * Updates README to reflect selected deployments
 */
export const updateReadmeDeploymentSection = async (
  projectPath: string,
  excludedDeployments: DeploymentOption[],
): Promise<void> => {
  const readmePath = `${projectPath}/README.md`;

  try {
    let content = await Deno.readTextFile(readmePath);

    // Remove sections for excluded deployments
    if (excludedDeployments.includes("vercel")) {
      // Remove Vercel-related content (simplified)
      content = content.replace(/### Option \d+: Vercel[\s\S]*?(?=###|## )/g, "");
    }
    if (excludedDeployments.includes("pm2")) {
      content = content.replace(/### Option \d+: PM2[\s\S]*?(?=###|## )/g, "");
    }
    if (excludedDeployments.includes("pulumi")) {
      content = content.replace(
        /### Option \d+: Pulumi[\s\S]*?(?=###|## )/g,
        "",
      );
    }

    await writeFile(readmePath, content);
  } catch (error) {
    console.error(`  Warning: Could not update README: ${error}`);
  }
};

/**
 * Main function to run all cleanup operations
 */
export const runDeploymentCleanup = async (
  projectPath: string,
  excludedDeployments: DeploymentOption[],
): Promise<void> => {
  if (excludedDeployments.length === 0) {
    console.log("\n✅ Keeping all deployment options");
    return;
  }

  console.log("\n🧹 Cleaning up deployment files...");

  await cleanupDeploymentFiles(projectPath, excludedDeployments);
  await cleanupPackageJsonScripts(projectPath, excludedDeployments);
  await cleanupGitignore(projectPath, excludedDeployments);
  await updateReadmeDeploymentSection(projectPath, excludedDeployments);

  console.log("✅ Deployment cleanup complete");
};
