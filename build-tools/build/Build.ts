import { ChildProcess } from "@figliolia/child-process";
import { CompressionGenerator } from "@tools/compression";
import { CriticalPathGenerator } from "@tools/critical-path";

export class Build {
  public static readonly PRE_PROCESSORS = [
    CriticalPathGenerator,
    CompressionGenerator,
  ];
  public static readonly POST_PROCESSORS = ["pnpm lint", "pnpm tsdown"];

  public static async build() {
    for (const Processor of this.PRE_PROCESSORS) {
      await new Processor().run();
    }
    for (const command of this.POST_PROCESSORS) {
      await new ChildProcess(command).handler;
    }
  }
}
