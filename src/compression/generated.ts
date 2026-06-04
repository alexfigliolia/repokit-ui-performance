import { RepoKitCommand } from "@repokit/core";

export const Compression = new RepoKitCommand({
  name: "ui-compression",
  description: "Static compression for production UI builds",
  commands: {
    compress: {
      command:
        'node -e \'import { compress } from "@ui-perf/build-compression";import { dynamicPathArgs } from "@repokit/ui-performance/args";const args = dynamicPathArgs();compress(String([args["path"]]));\' --',
      description:
        "Compresses files recursively in a target directory using brotli, gzip, deflate, and zstandard at their highest compression-yielding settings",
      args: {
        "(--path | -p)": "An absolute path to a build directory",
      },
    },
  },
});

export function buildCompressionCommand(config: {
  buildPath: string;
  commandName?: string;
}) {
  const command = new RepoKitCommand({
    name: "ui-compression",
    description: "Static compression for production UI builds",
    commands: {
      compress: {
        command:
          'node -e \'import { compress } from "@ui-perf/build-compression";const args = { path: "<INJECT_BUILD_PATH>" };compress(String([args["path"]]));\' --',
        description:
          "Compresses files recursively in a target directory using brotli, gzip, deflate, and zstandard at their highest compression-yielding settings",
      },
    },
  });
  command.name = config.commandName ?? command.name;
  for (const key in command.commands) {
    command.commands[key]!.command = command.commands[key]!.command.replace(
      /<INJECT_BUILD_PATH>/g,
      config.buildPath,
    );
  }
  return command;
}
