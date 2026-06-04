import { compress } from "@ui-perf/build-compression";

// INJECT_ARGS
const args: Record<string, string> = {};
// INJECT_ARGS

compress(String(args["path"]));
