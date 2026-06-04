import { cli } from "@ui-perf/critical-path";

// INJECT_ARGS
const args: Record<string, string> = {};
// INJECT_ARGS

cli(String(args["path"]));
