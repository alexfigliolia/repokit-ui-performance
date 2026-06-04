import { exit } from "node:process";

// INJECT_ARGS
const args: Record<string, string> = {};
// INJECT_ARGS

// INJECT_API_CALL
const result = () => {
  console.log(args);
  return true;
};
// INJECT_API_CALL

if (!result) {
  console.error("Assertion failed ❌");
  exit(1);
} else {
  console.log("✅");
}
