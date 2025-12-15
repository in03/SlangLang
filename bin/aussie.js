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
const sourceLines = source.split(/\r?\n/);

function formatError(err, source) {
  console.error("\n\x1b[31m✗ Parse Error\x1b[0m\n");
  
  // Try to extract line/column info from nearley error (different formats)
  let line = null, col = null;
  
  // Try "at line X col Y" format
  let lineMatch = err.message.match(/at line (\d+) col (\d+)/);
  if (lineMatch) {
    line = parseInt(lineMatch[1]);
    col = parseInt(lineMatch[2]);
  }
  
  // Try to find line info from error object if present
  if (!line && err.token && err.token.line) {
    line = err.token.line;
    col = err.token.col || 1;
  }
  
  // Search for source context in the error message if no line found
  if (!line) {
    // Try to find the token value in the source
    const tokenMatch = err.message.match(/Unexpected (\w+) token: "([^"]+)"/);
    if (tokenMatch) {
      const tokenValue = tokenMatch[2];
      // Find first occurrence of this token in source
      for (let i = 0; i < sourceLines.length; i++) {
        const idx = sourceLines[i].indexOf(tokenValue);
        if (idx !== -1) {
          line = i + 1;
          col = idx + 1;
          break;
        }
      }
    }
  }
  
  if (line && !isNaN(line)) {
    // Show context (3 lines before and after)
    const start = Math.max(0, line - 3);
    const end = Math.min(sourceLines.length, line + 2);
    
    for (let i = start; i < end; i++) {
      const lineNum = (i + 1).toString().padStart(4);
      const prefix = (i + 1 === line) ? "\x1b[31m→\x1b[0m" : " ";
      const lineContent = sourceLines[i] || "";
      console.error(`${prefix} ${lineNum} | ${lineContent}`);
      
      if (i + 1 === line && col) {
        // Show caret pointing to error column
        const padding = " ".repeat(8 + col);
        console.error(`${padding}\x1b[31m^\x1b[0m`);
      }
    }
  }
  
  // Show the unexpected token
  const tokenMatch = err.message.match(/Unexpected (\w+) token: "([^"]+)"/);
  if (tokenMatch) {
    console.error(`\n\x1b[33mUnexpected:\x1b[0m ${tokenMatch[1]} "${tokenMatch[2]}"`);
  }
  
  // Provide helpful hints based on token type
  if (tokenMatch) {
    const tokType = tokenMatch[1];
    const tokValue = tokenMatch[2];
    
    if (tokType === "BLOODY_ITEM") {
      console.error(`\n\x1b[36mHint:\x1b[0m "bloody ${tokValue}" looks like a list item.`);
      console.error(`      If you meant a string, add "mate" at the end: bloody ${tokValue} mate`);
      console.error(`      List items (bloody X,) only work inside esky: declarations.`);
    } else if (tokType === "SLANG_STRING") {
      console.error(`\n\x1b[36mHint:\x1b[0m Slang strings need to end with "mate".`);
    }
  }
  
  // Show simplified expected tokens
  const expectMatch = err.message.match(/Instead, I was expecting to see one of the following:/);
  if (expectMatch) {
    const tokenMatches = err.message.matchAll(/A (\w+) token based on:/g);
    const tokens = new Set();
    for (const m of tokenMatches) {
      const tok = m[1];
      if (tok === "IDENT") tokens.add("identifier");
      else if (tok === "STRING") tokens.add("string");
      else if (tok === "NUMBER") tokens.add("number");
      else if (tok === "SLANG_STRING") tokens.add("bloody...mate");
      else if (tok.startsWith("KW_")) tokens.add(tok.replace("KW_", "").toLowerCase());
    }
    if (tokens.size > 0) {
      const tokenList = Array.from(tokens).slice(0, 8);
      console.error(`\n\x1b[33mExpected:\x1b[0m ${tokenList.join(", ")}${tokens.size > 8 ? ", ..." : ""}`);
    }
  }
  
  console.error("");
  return true;
}

try {
  const jsCode = transpile(source);
  
  try {
    vm.runInThisContext(jsCode, { filename: inputFile });
  } catch (runtimeErr) {
    console.error("\n\x1b[31m✗ Runtime Error\x1b[0m\n");
    console.error(runtimeErr.message);
    
    // Try to show generated JS for debugging
    if (process.env.SLANG_DEBUG) {
      console.error("\n\x1b[33mGenerated JS:\x1b[0m");
      console.error(jsCode);
    }
    process.exit(1);
  }
} catch (parseErr) {
  if (!formatError(parseErr, source)) {
    // Fallback to raw error
    console.error("\n\x1b[31m✗ Error\x1b[0m\n");
    console.error(parseErr.message);
  }
  
  // Show full stack in debug mode
  if (process.env.SLANG_DEBUG) {
    console.error("\n\x1b[33mFull stack:\x1b[0m");
    console.error(parseErr.stack);
  }
  
  process.exit(1);
}
