import { validateAllContent } from "./validateContent";

const result = validateAllContent();

if (result.valid) {
  console.log("All content validation passed. No errors found.");
} else {
  console.error(`Validation failed with ${result.errors.length} error(s):`);
  for (const error of result.errors) {
    console.error(`  - ${error}`);
  }
}

process.exit(result.valid ? 0 : 1);
