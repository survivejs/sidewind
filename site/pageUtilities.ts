import md from "./transforms/markdown.ts";
import type { Context } from "https://deno.land/x/gustwind@v0.39.4/breezewind/types.ts";
import type { Routes } from "https://deno.land/x/gustwind@v0.39.4/types.ts";

function init({ routes }: { routes: Routes }) {
  async function processMarkdown(_: Context, input: string) {
    return (await md(input)).content;
  }

  function trim(_: Context, str: string, char: string) {
    if (!str) {
      throw new Error("No string to trim!");
    }

    // Exception for /
    if (str === char) {
      return str;
    }

    // Adapted from https://www.sitepoint.com/trimming-strings-in-javascript/
    return str.replace(new RegExp("^[" + char + "]+"), "").replace(
      new RegExp("[" + char + "]+$"),
      "",
    );
  }

  function validateUrl(_: Context, url: string) {
    if (!url) {
      return;
    }

    if (routes[url]) {
      return url === "/" ? "/" : `/${url}/`;
    }

    // TODO: This would be a good spot to check the url doesn't 404
    // To keep this fast, some kind of local, time-based cache would
    // be good to have to avoid hitting the urls all the time.
    if (url.startsWith("http")) {
      return url;
    }

    throw new Error(`Failed to find matching url for "${url}"`);
  }

  return { processMarkdown, trim, validateUrl };
}

export { init };
