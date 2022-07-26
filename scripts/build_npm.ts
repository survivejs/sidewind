import { build, emptyDir } from "https://deno.land/x/dnt@0.28.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
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
