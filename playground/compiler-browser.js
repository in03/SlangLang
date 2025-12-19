/**
 * Browser-compatible SlangLang compiler wrapper
 * Imports the main compiler and wraps output for the playground
 */

const transpile = require('../compiler.js');

function run(source) {
  // Transpile the source
  let js = transpile(source);
  
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
