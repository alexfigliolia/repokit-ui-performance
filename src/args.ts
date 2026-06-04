import { parseArgs } from "node:util";

export const PATH_ARG = "(--path | -p)";
export const BYTES_ARG = "(--bytes | -b)";

export const dynamicPathAssertionArgs = () => {
  return parseArgs({
    strict: false,
    options: {
      path: {
        default: "",
        type: "string",
        short: "p",
      },
      bytes: {
        default: "0",
        type: "string",
        short: "b",
      },
    },
  }).values;
};

export const dynamicPathArgs = () => {
  return parseArgs({
    strict: false,
    options: {
      path: {
        default: "",
        type: "string",
        short: "p",
      },
    },
  }).values;
};

export const knownPathAssertionArgs = () => {
  return parseArgs({
    strict: false,
    options: {
      bytes: {
        default: "0",
        type: "string",
        short: "b",
      },
    },
  }).values;
};
