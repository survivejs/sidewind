import * as path from "path";
import { build } from "gustwind";
import { getJson } from "./utils.ts";

async function main() {
  const siteMeta = await getJson("./meta.json");
  const projectRoot = path.join(path.fromFileUrl(import.meta.url), "..", "..");

  build({ ...siteMeta, projectRoot });
}

main();
