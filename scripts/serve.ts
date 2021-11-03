import { serve } from "gustwind";
import { getJson } from "./utils.ts";

async function main() {
  const siteMeta = await getJson("./meta.json");

  serve(siteMeta);
}

main();
