import * as path from "path";
import { serve } from "gustwind";
import { getJson } from "./utils.ts";

async function main() {
  const siteMeta = await getJson("./meta.json");
  const projectRoot = path.join(path.fromFileUrl(import.meta.url), "..", "..");

  serve({ ...siteMeta, projectRoot });
}

main();
