import { build } from "gustwind";
import { getJson } from "./utils.ts";

async function main() {
  const siteMeta = await getJson("./meta.json");

  build(siteMeta);
}

main();
