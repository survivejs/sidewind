import { BindState } from "./types";

function get(object: BindState, keyString: string) {
  const keys = keyString.split(".");
  let ret = object;

  keys.forEach(key => {
    ret = ret[key];
  });

  return ret;
}

export { get };
