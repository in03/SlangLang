#!/usr/bin/env node
const fs = require("fs");
const vm = require("vm");
const transpile = require("../compiler");

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: aussie <file.slang>");
  process.exit(1);
}

const source = fs.readFileSync(inputFile, "utf8");
const jsCode = transpile(source);

try {
  vm.runInThisContext(jsCode, { filename: inputFile });
} catch (err) {
  console.error("Error running slang:", err);
  process.exit(1);
}
