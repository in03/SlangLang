const moo = require("moo");

function createLexer() {
  const lexer = moo.states({
    main: {
      WS: /[ \t]+/,
      KW_PREP: "prep",
      KW_BARBIE: "barbie",
      KW_CRIKEY: "crikey",
      DASH: "–",
      KW_FAIR: "fair",
      KW_GO: "go",
      KW_IS: "is",
      KW_BLOODY: { match: "bloody", push: "slangString" },
      KW_FLAMIN: "flamin",
      KW_FROTHIN: "frothin",
      BOOL: /yeah|nah/,
      NULL: "nothin",
      NUMBER: /[0-9]+(?:\.[0-9]+)?/,
      STRING: /"(?:[^"\\]|\\.)*"/,
      IDENT: /[a-zA-Z_][a-zA-Z0-9_]*/,
      NL: { match: /\r?\n/, lineBreaks: true },
    },
    slangString: {
      // Capture everything until " mate" (space + mate at word boundary)
      SLANG_STRING_CONTENT: { match: /[\s\S]+?(?= mate\b)/, lineBreaks: true },
      KW_MATE: { match: / mate/, pop: 1, value: () => "mate" },
    }
  });

  let indentStack = [0];
  let queue = [];

  function next() {
    while (true) {
      if (queue.length) return queue.shift();
      let tok = lexer.next();
      if (!tok) return tok;

      // Skip whitespace tokens (indent handling consumes them after NL)
      if (tok.type === "WS") continue;

      if (tok.type === "NL") {
        let spaces = 0;
        let peek = lexer.next();
        if (peek && peek.type === "WS") {
          spaces = peek.value.length;
          peek = lexer.next();
        }

        let prevIndent = indentStack[indentStack.length - 1];
        if (spaces > prevIndent) {
          indentStack.push(spaces);
          queue.push({ type: "INDENT", value: spaces });
        } else if (spaces < prevIndent) {
          while (spaces < indentStack[indentStack.length - 1]) {
            indentStack.pop();
            queue.push({ type: "DEDENT", value: spaces });
          }
        } else {
          // Same indentation level - emit NL to separate statements
          queue.push({ type: "NL", value: "\n" });
        }
        if (peek) queue.push(peek);
        // Return first item from queue or continue if empty
        continue;
      }
      return tok;
    }
  }

  return {
    next,
    reset: (...args) => { indentStack = [0]; queue = []; lexer.reset(...args); },
    save: lexer.save.bind(lexer),
    formatError: lexer.formatError.bind(lexer),
    has: (name) => name === "INDENT" || name === "DEDENT" || name === "SLANG_STRING_CONTENT" || name === "KW_MATE" || lexer.has(name),
  };
}

module.exports = createLexer;
