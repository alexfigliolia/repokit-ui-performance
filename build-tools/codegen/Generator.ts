import { writeFile } from "node:fs/promises";
import type { IRepoKitCommand } from "@repokit/core";

export abstract class Generator {
  public abstract readonly SRC: string;
  public abstract readonly OUT_FILE: string;

  public async run() {
    await writeFile(
      this.OUT_FILE,
      this.toCode(
        await this.buildScripts(false),
        await this.buildScripts(true),
      ),
    );
  }

  public abstract toCode(
    staticCommand: IRepoKitCommand,
    dynamicCommand: IRepoKitCommand,
  ): string;

  public abstract buildScripts(
    buildPath: boolean,
  ): IRepoKitCommand | Promise<IRepoKitCommand>;

  public abstract toInjectableArgs(
    buildPath?: boolean | ((...args: any[]) => any),
  ): [string, string];
}
