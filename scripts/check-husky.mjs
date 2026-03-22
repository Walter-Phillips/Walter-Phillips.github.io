#!/usr/bin/env node
/**
 * Lints and formats the repo so you pass the Husky pre-commit hook.
 * Runs ESLint --fix and Prettier --write, then verifies with the same checks
 * lint-staged uses. Use before committing.
 *
 * Usage:
 *   node scripts/check-husky.mjs              # fix + verify
 *   node scripts/check-husky.mjs "feat: add X"  # fix + verify + validate message
 *   npm run check:husky
 *   npm run check:husky -- "feat: my message"
 */

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");

function run(cmd, description) {
  console.log(`\n▶ ${description}...`);
  try {
    execSync(cmd, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true,
    });
    console.log(`  ✓ ${description}`);
  } catch {
    console.error(`  ✗ ${description} failed`);
    process.exit(1);
  }
}

// Lint and format so the repo passes the pre-commit hook (same as lint-staged)
run("npm run format", "Prettier (format)");
run("npx eslint . --fix --max-warnings=0", "ESLint (lint + fix)");

// Optionally validate commit message (same as commit-msg hook)
const message = process.argv[2];
if (message !== undefined) {
  const tmpFile = join(tmpdir(), `commitlint-${Date.now()}.txt`);
  try {
    writeFileSync(tmpFile, message, "utf8");
    run(`npx --no -- commitlint --edit "${tmpFile}"`, "Commit message (commitlint)");
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
      // ignore
    }
  }
} else {
  console.log(
    '\nTip: pass a commit message to validate it: npm run check:husky -- "feat: your message"',
  );
}

console.log("\n✓ All Husky checks passed.\n");
