import { writeFile } from "node:fs/promises";
import type { IRepoKitCommand } from "@repokit/core";

export abstract class Generator {
  public abstract readonly SRC: string;
  public abstract readonly OUT_FILE: string;
  public abstract readonly COMMAND_DOC: string;
  public abstract readonly GENERATE_COMMAND_DOC: string;

  public async run() {
    await writeFile(
      this.OUT_FILE,
      this.createExports(
        ...this.toCode(
          await this.buildScripts(false),
          await this.buildScripts(true),
        ),
      ),
    );
  }

  public abstract toCode(
    staticCommand: IRepoKitCommand,
    dynamicCommand: IRepoKitCommand,
  ): [string, string];

  public createExports(staticCommand: string, dynamicCommand: string) {
    return `import { RepoKitCommand } from "@repokit/core";

      ${this.toJSDoc(this.COMMAND_DOC)}
      ${staticCommand}
    
      ${this.toJSDoc(this.GENERATE_COMMAND_DOC)}
      ${dynamicCommand}
      `;
  }

  public abstract buildScripts(
    buildPath: boolean,
  ): IRepoKitCommand | Promise<IRepoKitCommand>;

  public abstract toInjectableArgs(
    buildPath?: boolean | ((...args: any[]) => any),
  ): [string, string];

  private toJSDoc(doc: string) {
    const result: string[] = [];
    let count = 0;
    const words: string[] = [];
    const tokens = doc.match(/([#]+|\b\w+\b|\n)/g) ?? [];
    function empty() {
      count = 0;
      result.push(words.join(" "));
      words.length = 0;
    }
    for (const word of tokens) {
      if (word === "\n") {
        empty();
        result.push("");
      } else if (count + word.length >= 50) {
        empty();
        count = word.length;
        words.push(word);
      } else {
        words.push(word);
        count += word.length;
      }
    }
    empty();
    return `/**\n* ${result.join("\n* ")}\n*/`;
  }
}
