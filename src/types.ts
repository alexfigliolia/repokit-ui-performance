import type { ICommand } from "@repokit/core";

export type ICommandSchema = ICommand & {
  name: string;
  operation: (...args: any[]) => any;
};
