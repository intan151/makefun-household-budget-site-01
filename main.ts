// HomeLedger entry — a Node 22 program (standard library only) that hands
// the household budget site in. It copies the static site in app/ and the
// screenshots/ folder next to this file into the output directory, then
// writes /output/dossier.json with the make.fun frontend library, which is
// the summary the judge reads: the screenshots, the first load's files and
// bytes, and the site's source. vendor/makefun-frontend.ts is the kit's copy
// and must stay unchanged — the scorer rebuilds the dossier with its own
// copy and compares the two byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Self-check before building: the hand-in is the site, so refuse to build a
// dossier from a folder that has no front page. This check prints and exits
// without writing anything, so a failed run leaves no partial output behind.
const indexFile = join(here, "app", "index.html");
if (!existsSync(indexFile) || !statSync(indexFile).isFile()) {
  console.error("HomeLedger: app/index.html is missing — nothing to hand in.");
  process.exit(1);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots, each at most 256 KiB; app/
// at most 993 files and directories and 16 MiB in all; the dossier text at
// most 160 KiB. Anything past those limits fails the gate, so buildDossier
// refuses it here first, with its own words.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
