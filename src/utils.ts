import { BindState } from "./types";

function get(object: BindState, keyString: string) {
  const keys = keyString.split(".");
  let ret = object;

  keys.forEach(key => {
    ret = ret[key];
  });

  return ret;
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
    [getter]:
      value._type === "query"
        ? [].slice.call(document.querySelectorAll(value._value))
        : value,
  };
}

export { get, getValues };
