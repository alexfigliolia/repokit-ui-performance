import { RepoKitCommand } from "@repokit/core";

/**
 * ### Critical Path
 *
 * A repokit command for static critical path analysis
 */
export const CriticalPath = new RepoKitCommand({
  name: "critical-path",
  description:
    "A set of commands for measuring the critical path of production UI builds.\n      Paths to production build entrypoints can take place in the form of:\n         1. https://my-app.com\n         2. /path/to/my-app/dist/main.html",
  commands: {
    "assert-css": {
      command:
        'node -e \'import { assertCriticalCss } from "@ui-perf/critical-path";import { dynamicPathAssertionArgs } from "@repokit/ui-performance/args";import { exit } from "node:process";const args: Record<string, string> = dynamicPathAssertionArgs();const result = assertCriticalCss(args.path, parseInt(args.bytes || "0"));if (!result) {  console.error("Assertion failed ❌");  exit(1);} else {  console.log("✅");}\' --',
      description:
        "Asserts that critical CSS is below the specified number of bytes",
      args: {
        "(--path | -p)":
          "An absolute path (local or remote) to a production build's main HTML file",
        "(--bytes | -b)":
          "The threshold number of bytes at which the assertion should fail",
      },
    },
    "assert-html": {
      command:
        'node -e \'import { assertCriticalHtml } from "@ui-perf/critical-path";import { dynamicPathAssertionArgs } from "@repokit/ui-performance/args";import { exit } from "node:process";const args: Record<string, string> = dynamicPathAssertionArgs();const result = assertCriticalHtml(args.path, parseInt(args.bytes || "0"));if (!result) {  console.error("Assertion failed ❌");  exit(1);} else {  console.log("✅");}\' --',
      description:
        "Asserts that critical HTML is below the specified number of bytes",
      args: {
        "(--path | -p)":
          "An absolute path (local or remote) to a production build's main HTML file",
        "(--bytes | -b)":
          "The threshold number of bytes at which the assertion should fail",
      },
    },
    "assert-javascript": {
      command:
        'node -e \'import { assertCriticalJavaScript } from "@ui-perf/critical-path";import { dynamicPathAssertionArgs } from "@repokit/ui-performance/args";import { exit } from "node:process";const args: Record<string, string> = dynamicPathAssertionArgs();const result = assertCriticalJavaScript(args.path, parseInt(args.bytes || "0"));if (!result) {  console.error("Assertion failed ❌");  exit(1);} else {  console.log("✅");}\' --',
      description:
        "Asserts that critical JavaScript is below the specified number of bytes",
      args: {
        "(--path | -p)":
          "An absolute path (local or remote) to a production build's main HTML file",
        "(--bytes | -b)":
          "The threshold number of bytes at which the assertion should fail",
      },
    },
    measure: {
      command:
        'node -e \'import { dynamicPathArgs } from "@repokit/ui-performance/args";import { cli } from "@ui-perf/critical-path";const args: Record<string, string> = dynamicPathArgs();void cli(String(args["path"]));\' --',
      description:
        "Logs the byte measurements of critical HTML, CSS, and JavaScript to stdout",
      args: {
        "(--path | -p)":
          "An absolute path (local or remote) to a production build's main HTML file",
      },
    },
  },
});

/**
 * ### buildCriticalPathCommand
 *
 * Customize your Critical Path command by generating it
 * with your desired name and build path
 */
export function buildCriticalPathCommand(config: {
  buildPath: string;
  commandName?: string;
}) {
  const command = new RepoKitCommand({
    name: "critical-path",
    description:
      "A set of commands for measuring the critical path of production UI builds.\n      Paths to production build entrypoints can take place in the form of:\n         1. https://my-app.com\n         2. /path/to/my-app/dist/main.html",
    commands: {
      "assert-css": {
        command:
          'node -e \'import { assertCriticalCss } from "@ui-perf/critical-path";import { knownPathAssertionArgs } from "@repokit/ui-performance/args";import { exit } from "node:process";const args: Record<string, string> = knownPathAssertionArgs();args.path = "<INJECT_PATH_STRING>";const result = assertCriticalCss(args.path, parseInt(args.bytes || "0"));if (!result) {  console.error("Assertion failed ❌");  exit(1);} else {  console.log("✅");}\' --',
        description:
          "Asserts that critical CSS is below the specified number of bytes",
        args: {
          "(--bytes | -b)":
            "The threshold number of bytes at which the assertion should fail",
        },
      },
      "assert-html": {
        command:
          'node -e \'import { assertCriticalHtml } from "@ui-perf/critical-path";import { knownPathAssertionArgs } from "@repokit/ui-performance/args";import { exit } from "node:process";const args: Record<string, string> = knownPathAssertionArgs();args.path = "<INJECT_PATH_STRING>";const result = assertCriticalHtml(args.path, parseInt(args.bytes || "0"));if (!result) {  console.error("Assertion failed ❌");  exit(1);} else {  console.log("✅");}\' --',
        description:
          "Asserts that critical HTML is below the specified number of bytes",
        args: {
          "(--bytes | -b)":
            "The threshold number of bytes at which the assertion should fail",
        },
      },
      "assert-javascript": {
        command:
          'node -e \'import { assertCriticalJavaScript } from "@ui-perf/critical-path";import { knownPathAssertionArgs } from "@repokit/ui-performance/args";import { exit } from "node:process";const args: Record<string, string> = knownPathAssertionArgs();args.path = "<INJECT_PATH_STRING>";const result = assertCriticalJavaScript(args.path, parseInt(args.bytes || "0"));if (!result) {  console.error("Assertion failed ❌");  exit(1);} else {  console.log("✅");}\' --',
        description:
          "Asserts that critical JavaScript is below the specified number of bytes",
        args: {
          "(--bytes | -b)":
            "The threshold number of bytes at which the assertion should fail",
        },
      },
      measure: {
        command:
          'node -e \'import { cli } from "@ui-perf/critical-path";const args = "<INJECT_BUILD_PATH>";void cli(String(args["path"]));\' --',
        description:
          "Logs the byte measurements of critical HTML, CSS, and JavaScript to stdout",
        args: {},
      },
    },
  });
  command.name = config.commandName ?? command.name;
  for (const key in command.commands) {
    command.commands[key]!.command = command.commands[key]!.command.replace(
      /"<INJECT_BUILD_PATH>"/g,
      `{ path: "${config.buildPath}" }`,
    ).replace(/"<INJECT_PATH_STRING>"/g, `"${config.buildPath}"`);
  }
  return command;
}
