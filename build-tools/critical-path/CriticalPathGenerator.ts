import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  dynamicPathArgs,
  dynamicPathAssertionArgs,
  knownPathAssertionArgs,
  PATH_ARG,
} from "@core/args";
import * as Schemas from "@core/critical-path/schema";
import { type ICommandSchema } from "@core/types";
import type { ICommand, IRepoKitCommand } from "@repokit/core";
import { Generator } from "@tools/codegen";

export class CriticalPathGenerator extends Generator {
  public readonly SRC = join(__dirname, "../..", "src", "critical-path");
  public readonly OUT_FILE = join(this.SRC, "generated.ts");
  public static readonly ASSERTION_SOURCES = [
    Schemas.HTML_SCHEMA,
    Schemas.CSS_SCHEMA,
    Schemas.JAVASCRIPT_SCHEMA,
    Schemas.MEASURE_SCHEMA,
  ] as const;
  public static readonly MEASURE_SOURCES = [Schemas.MEASURE_SCHEMA] as const;

  public toCode(
    staticCommand: IRepoKitCommand,
    dynamicCommand: IRepoKitCommand,
  ) {
    return `import { RepoKitCommand } from "@repokit/core";

      export const CriticalPath = new RepoKitCommand(${JSON.stringify(staticCommand, null, 2)});\n\n
    
      export function buildCriticalPathCommand(config: { buildPath: string, commandName?: string }) {
        const command = new RepoKitCommand(${JSON.stringify(dynamicCommand, null, 2)});
        command.name = config.commandName ?? command.name;
        for (const key in command.commands) {
          command.commands[key]!.command = command.commands[key]!.command.replace(
            /\"<INJECT_BUILD_PATH>\"/g,
            \`{ path: \"\${config.buildPath}\" }\`,
          ).replace(
            /\"<INJECT_PATH_STRING>\"/g,
            \`\"\${config.buildPath}\"\`,
          )
        }
        return command;
      }`;
  }

  public async buildScripts(buildPath = false) {
    const injections = await Promise.all([
      ...CriticalPathGenerator.ASSERTION_SOURCES.map(source =>
        this.buildAssertion(source, buildPath),
      ),
      ...CriticalPathGenerator.MEASURE_SOURCES.map(source =>
        this.buildMeasurement(source, buildPath),
      ),
    ]);
    injections.sort((a, b) => a.name.localeCompare(b.name));
    return {
      name: Schemas.COMMAND_NAME,
      description: Schemas.COMMAND_DESCRIPTION,
      commands: injections.reduce<Record<string, ICommand>>((acc, schema) => {
        const { name, operation: _, ...command } = schema;
        acc[name] = command;
        return acc;
      }, {}),
    };
  }

  private readonly buildAssertion = this.commandBuilder(
    async (schema: ICommandSchema, buildPath) => {
      const script = (
        await readFile(join(this.SRC, "assertion.ts"))
      ).toString();
      const argsInjection = buildPath
        ? knownPathAssertionArgs
        : dynamicPathAssertionArgs;
      schema.command = `node -e 'import { ${schema.operation.name} } from "@ui-perf/critical-path";import { ${argsInjection.name} } from "@repokit/ui-performance/args";${script
        .replace(/\n/g, "")
        .replace(
          /(\/\/\sINJECT_API_CALL[.\s\S]*\/\/\sINJECT_API_CALL)/g,
          `const result = ${schema.operation.name}(args.path, parseInt(args.bytes || "0"));`,
        )
        .replace(
          /(\/\/\sINJECT_ARGS[.\s\S]*\/\/\sINJECT_ARGS)/g,
          `const args: Record<string, string> = ${argsInjection.name}();${argsInjection === knownPathAssertionArgs ? `args.path = "<INJECT_PATH_STRING>";` : ""}`,
        )}' --`;
      return schema;
    },
  );

  private readonly buildMeasurement = this.commandBuilder(
    async (schema: ICommandSchema, buildPath) => {
      const script = (await readFile(join(this.SRC, "measure.ts"))).toString();
      const [argsInjection, argsImport] = this.toInjectableArgs(
        buildPath ? undefined : dynamicPathArgs,
      );
      schema.command = `node -e '${argsImport}${script
        .replace(/\n/g, "")
        .replace(
          /(\/\/\sINJECT_ARGS[.\s\S]*\/\/\sINJECT_ARGS)/g,
          argsInjection,
        )}' --`;
      return schema;
    },
  );

  private commandBuilder(
    func: (
      schema: ICommandSchema,
      buildPath: boolean,
    ) => Promise<ICommandSchema>,
  ) {
    return async (schema: ICommandSchema, buildPath: boolean) => {
      const { operation, ...rest } = schema;
      const clone = structuredClone(rest);
      const result = await func({ ...clone, operation }, buildPath);
      if (buildPath && PATH_ARG in (result.args ?? {})) {
        delete result?.args?.[PATH_ARG];
      }
      return result;
    };
  }

  public toInjectableArgs(
    injection?: (...args: any[]) => any,
  ): [string, string] {
    if (injection && typeof injection === "function") {
      return [
        `const args: Record<string, string> = ${injection.name}();`,
        `import { ${injection.name} } from "@repokit/ui-performance/args";`,
      ];
    }
    return ['const args = "<INJECT_BUILD_PATH>";', ""];
  }
}
