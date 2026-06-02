import { existsSync, copyFileSync, symlinkSync, unlinkSync, lstatSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const example = join(root, ".env.example");
const rootEnv = join(root, ".env");

if (!existsSync(example)) {
  console.error("Missing .env.example at repo root");
  process.exit(1);
}

if (existsSync(rootEnv)) {
  console.log(".env already exists at root, leaving as-is");
} else {
  copyFileSync(example, rootEnv);
  console.log("Created .env from .env.example");
}

const targets = ["apps/web", "apps/server"];

for (const t of targets) {
  const dir = join(root, t);
  if (!existsSync(dir)) {
    console.warn(`Skip ${t}: directory not found`);
    continue;
  }
  const link = join(dir, ".env");
  // Replace an existing symlink, but never clobber a real file.
  if (existsSync(link) || isSymlink(link)) {
    if (isSymlink(link)) {
      unlinkSync(link);
    } else {
      console.log(`Skip ${t}/.env: real file exists`);
      continue;
    }
  }
  symlinkSync(relative(dir, rootEnv), link);
  console.log(`Linked ${t}/.env -> ${relative(dir, rootEnv)}`);
}

function isSymlink(p) {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}
