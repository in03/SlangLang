/**
 * Browser-compatible SlangLang compiler wrapper
 * Imports the main compiler and wraps output for the playground
 */

const transpile = require('../compiler.js');

/**
 * Format a parse error into a user-friendly message
 */
function formatParseError(err, source) {
  const sourceLines = source.split(/\r?\n/);
  let result = [];
  
  // Try to extract line/column info
  let line = null, col = null;
  let lineMatch = err.message.match(/at line (\d+) col (\d+)/);
  if (lineMatch) {
    line = parseInt(lineMatch[1]);
    col = parseInt(lineMatch[2]);
  }
  
  // Try to find token in source if no line found
  if (!line) {
    const tokenMatch = err.message.match(/Unexpected (\w+) token: "([^"]+)"/);
    if (tokenMatch) {
      const tokenValue = tokenMatch[2];
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
  
  // Show line context
  if (line && !isNaN(line)) {
    result.push(`Syntax error at line ${line}${col ? ` col ${col}` : ''}:`);
    result.push('');
    
    const start = Math.max(0, line - 2);
    const end = Math.min(sourceLines.length, line + 1);
    
    for (let i = start; i < end; i++) {
      const lineNum = (i + 1).toString().padStart(4);
      const prefix = (i + 1 === line) ? "→" : " ";
      result.push(`${prefix}${lineNum} | ${sourceLines[i] || ''}`);
      
      if (i + 1 === line && col) {
        result.push(' '.repeat(7 + col) + '^');
      }
    }
  }
  
  // Show the unexpected token
  const tokenMatch = err.message.match(/Unexpected (\w+) token: "([^"]+)"/);
  if (tokenMatch) {
    result.push('');
    result.push(`Unexpected: ${tokenMatch[1]} "${tokenMatch[2]}"`);
    
    // Add hints
    const tokType = tokenMatch[1];
    const tokValue = tokenMatch[2];
    
    if (tokType === "BLOODY_ITEM") {
      result.push('');
      result.push(`Hint: "bloody ${tokValue}" looks like a list item.`);
      result.push(`      If you meant a string, add "mate" at the end.`);
    } else if (tokType.startsWith("KW_")) {
      result.push('');
      result.push(`Hint: "${tokValue}" is a keyword. If you meant to use it as a name,`);
      result.push(`      try a different word or combine with other words.`);
    }
  }
  
  // Simplified expected tokens
  const expectMatch = err.message.match(/Instead, I was expecting to see one of the following:/);
  if (expectMatch) {
    const tokens = new Set();
    const tokenMatches = err.message.matchAll(/A (\w+) token based on:/g);
    for (const m of tokenMatches) {
      const tok = m[1];
      if (tok === "IDENT") tokens.add("identifier");
      else if (tok === "STRING") tokens.add("string");
      else if (tok === "NUMBER") tokens.add("number");
      else if (tok === "SLANG_STRING") tokens.add("bloody...mate");
      else if (tok.startsWith("KW_")) tokens.add(tok.replace("KW_", "").toLowerCase());
    }
    if (tokens.size > 0) {
      const tokenList = Array.from(tokens).slice(0, 6);
      result.push('');
      result.push(`Expected: ${tokenList.join(", ")}${tokens.size > 6 ? ", ..." : ""}`);
    }
  }
  
  return result.join('\n');
}

function run(source) {
  // Transpile the source
  let js;
  try {
    js = transpile(source);
  } catch (err) {
    // Re-throw with formatted message
    const formatted = formatParseError(err, source);
    throw new Error(formatted || err.message);
  }
  
  // Capture console.log output instead of printing
  const outputJs = js.replace(/console\.log\(/g, '__output.push(');
  const wrappedJs = `const __output = [];\n${outputJs}\n__output;`;
  
  // Execute and capture output
  const result = eval(wrappedJs);
  
  return {
    js: js,
    output: result.map(v => typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)).join('\n')
  };
}

// Expose to window for browser use
// This needs to be at module level, not inside a function
globalThis.SlangLang = { transpile, run };

// Also try window if available (browser environment)
if (typeof window !== 'undefined') {
  window.SlangLang = { transpile, run };
}

// Export for bundler
module.exports = { transpile, run };
