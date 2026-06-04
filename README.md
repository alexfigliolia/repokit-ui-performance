# Repokit UI Performance

A set of commands to add to your RepoKit configuration for optimizing web-based UI builds

## Installation

```bash
npm i -D @repokit/ui-performance
```

## Basic Usage

### Static Commmands

```typescript
// repokit.ts
import { RepoKitConfig } from "@repokit/core";
import { Compression, CriticalPath } from "@repokit/ui-performance";

export const RepoKit = new RepoKitConfig({
  project: "<your-project>",
  thirdParty: [CriticalPath, Compression],
});
```

### Customizeable Commmands

You can customize the name and embed your build paths to this libraries commands using the `buildCompressionCommand()` and `buildCriticalPathCommand()` functions.

Each allows you to specify an optional name to alias the command with as well as a build path with which to scope the commands.

```typescript
// repokit.ts
import { RepoKitConfig } from "@repokit/core";
import {
  buildCompressionCommand,
  buildCriticalPathCommand,
} from "@repokit/ui-performance";

const PRODUCTION_BUILD_PATH = join(__dirname, "dist");

export const RepoKit = new RepoKitConfig({
  project: "<your-project>",
  thirdParty: [
    buildCompressionCommand({
      commandName: "my-compression-command",
      buildPath: PRODUCTION_BUILD_PATH,
    }),
    buildCriticalPathCommand({
      commandName: "my-critical-path-command",
      buildPath: join(PRODUCTION_BUILD_PATH, "index.html"),
    }),
  ],
});
```

## Background

This library aims to provide wrappers around the tools published on `npm` under the `@ui-perf` workspace.

The `@ui-perf` workspace is designed to be a place to aggregate useful performance-related tools for modern web based user interfaces.
