import { BYTES_ARG, PATH_ARG } from "@core/args";
import type { ICommandSchema } from "@core/types";
import {
  assertCriticalCss,
  assertCriticalHtml,
  assertCriticalJavaScript,
  measureCriticalPath,
} from "@ui-perf/critical-path";

export const COMMAND_NAME = "critical-path";
export const COMMAND_DESCRIPTION =
  "A set of commands for measuring the critical path of production UI builds.\n      Paths to production build entrypoints can take place in the form of:\n         1. https://my-app.com\n         2. /path/to/my-app/dist/main.html";

export const MEASURE_SCHEMA: ICommandSchema = {
  operation: measureCriticalPath,
  name: "measure",
  command: "<INJECT_SCRIPT>",
  description:
    "Logs the byte measurements of critical HTML, CSS, and JavaScript to stdout",
  args: {
    [PATH_ARG]:
      "An absolute path (local or remote) to a production build's main HTML file",
  },
};

export const HTML_SCHEMA: ICommandSchema = {
  operation: assertCriticalHtml,
  name: "assert-html",
  command: "<INJECT_SCRIPT>",
  description:
    "Asserts that critical HTML is below the specified number of bytes",
  args: {
    [PATH_ARG]:
      "An absolute path (local or remote) to a production build's main HTML file",
    [BYTES_ARG]:
      "The threshold number of bytes at which the assertion should fail",
  },
};

export const JAVASCRIPT_SCHEMA: ICommandSchema = {
  operation: assertCriticalJavaScript,
  name: "assert-javascript",
  command: "<INJECT_SCRIPT>",
  description:
    "Asserts that critical JavaScript is below the specified number of bytes",
  args: {
    [PATH_ARG]:
      "An absolute path (local or remote) to a production build's main HTML file",
    [BYTES_ARG]:
      "The threshold number of bytes at which the assertion should fail",
  },
};

export const CSS_SCHEMA: ICommandSchema = {
  operation: assertCriticalCss,
  name: "assert-css",
  command: "<INJECT_SCRIPT>",
  description:
    "Asserts that critical CSS is below the specified number of bytes",
  args: {
    [PATH_ARG]:
      "An absolute path (local or remote) to a production build's main HTML file",
    [BYTES_ARG]:
      "The threshold number of bytes at which the assertion should fail",
  },
};
