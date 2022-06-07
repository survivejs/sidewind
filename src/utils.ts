import type { BindState, ExtendedHTMLElement } from "./types";
import getParents from "./get-parents";

function get(object: BindState, keyString: string) {
  const keys = keyString.split(".");
  let ret = object;

  keys.forEach((key) => {
    // @ts-ignore TODO: Improve the type here
    ret = ret[key];
  });

  return ret;
}

function getLevel(element: ExtendedHTMLElement) {
  return (
    getParents(element, "x-recurse").length +
    (element.hasAttribute("x-recurse") ? 1 : 0)
  );
}

function getTemplates(element: ExtendedHTMLElement) {
  return element.querySelectorAll(":scope > *[x-template]");
}

function getValues(data: BindState, getter: string | null): BindState {
  if (!getter) {
    return {};
  }

  const value = data[getter];

  if (!value) {
    console.error("Failed to get value", data, getter);

    return {};
  }

  return {
    [getter]: value,
  };
}

function isObject(obj: unknown) {
  // @ts-ignore nodeName is ok check to do
  return typeof obj === "object" && obj && !obj.nodeName;
}

export { get, getLevel, getTemplates, getValues, isObject };
