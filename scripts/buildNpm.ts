import { build } from "https://deno.land/x/dnt@0.7.0/mod.ts";

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "sidewind",
    version: Deno.args[0],
    description: "Tailwind but for state",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/survivejs/sidewind.git",
    },
    bugs: {
      url: "https://github.com/survivejs/sidewind/issues",
    },
    homepage: "https://sidewind.js.org/",
    keywords: ["tailwind", "state", "state-management"],
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
