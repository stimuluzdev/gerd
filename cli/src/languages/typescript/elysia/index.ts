import type { Command, CoreType } from "@utils/commands.ts";
import { scaffold } from "./core/index.ts";
import { promptDeploymentOptions, runDeploymentCleanup } from "./sub-core/index.ts";
import { createCommand } from "@utils/index.ts";

const Core = { create: scaffold } as CoreType;

/**
 * Standalone cleanup command for removing unwanted deployment options
 * from an existing elysia-kit project
 */
const cleanupDeployments = createCommand(async () => {
  console.log("🧹 Elysia-Kit Deployment Cleanup");
  console.log("Run this from your project root to remove unused deployment options.\n");

  const excludedDeployments = promptDeploymentOptions();
  await runDeploymentCleanup(".", excludedDeployments);
});

const SubCore: Command[] = [
  {
    name: "create",
    call: scaffold,
  },
  {
    name: "cleanup-deployments",
    call: cleanupDeployments,
  },
];

export { Core, SubCore };
