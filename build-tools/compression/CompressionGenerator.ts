import { join } from "node:path";
import { PATH_ARG } from "@core/args";
import {
  COMMAND_DESCRIPTION,
  COMMAND_NAME,
  PATH_DESCRIPTION,
  SUB_COMMAND_DESCRIPTION,
  SUB_COMMAND_NAME,
} from "@core/compression/schema";
import type { ICommand, IRepoKitCommand } from "@repokit/core";
import { Generator } from "@tools/codegen";

export class CompressionGenerator extends Generator {
  public readonly SRC = join(__dirname, "../..", "src", "compression");
  public readonly OUT_FILE = join(this.SRC, "generated.ts");

  public toCode(
    staticCommand: IRepoKitCommand,
    dynamicCommand: IRepoKitCommand,
  ) {
    return `import { RepoKitCommand } from "@repokit/core";

      export const Compression = new RepoKitCommand(${JSON.stringify(staticCommand, null, 2)});\n\n
    
      export function buildCompressionCommand(config: { buildPath: string, commandName?: string }) {
        const command = new RepoKitCommand(${JSON.stringify(dynamicCommand, null, 2)});
        command.name = config.commandName ?? command.name;
        for (const key in command.commands) {
          command.commands[key]!.command = command.commands[key]!.command.replace(
            /<INJECT_BUILD_PATH>/g,
            config.buildPath,
          );
        }
        return command;
      }`;
  }

  public buildScripts(buildPath = false): IRepoKitCommand {
    const subCommand: ICommand = {
      command: this.buildCommand(buildPath),
      description: SUB_COMMAND_DESCRIPTION,
    };
    const command = {
      name: COMMAND_NAME,
      description: COMMAND_DESCRIPTION,
      commands: {
        [SUB_COMMAND_NAME]: subCommand,
      },
    };
    if (!buildPath) {
      subCommand.args = { [PATH_ARG]: PATH_DESCRIPTION };
    }
    return command;
  }

  private buildCommand(buildPath = false) {
    const [args, argsImport] = this.toInjectableArgs(buildPath);
    return `node -e 'import { compress } from "@ui-perf/build-compression";${argsImport}${args}compress(String([args["path"]]));' --`;
  }

  public toInjectableArgs(buildPath = false): [string, string] {
    if (!buildPath) {
      return [
        `const args = dynamicPathArgs();`,
        `import { dynamicPathArgs } from "@repokit/ui-performance/args";`,
      ];
    }
    return [`const args = { path: "<INJECT_BUILD_PATH>" };`, ""];
  }
}
