const moo = require("moo");

// Keywords that act as boundaries for multi-word identifiers
const BOUNDARY_KEYWORDS = new Set([
  "prep", "barbie", "with", "crikey", "fair", "go", "deal", "is",
  "bloody", "flamin", "frothin", "spewin", "mate",
  "esky", "tuckshop", "empty",
  "scoffin", "dealin", "from", "pass", "the",
  "til", "fully", "sick", "every", "in",
  "another", "shrimp", "ditch", "drop", "last", "first", "snag",
  "sheepshear", "top", "up", "grab", "at",
  "if", "or", "otherwise", "make", "tracks",
  "biggerthan", "smallerthan", "equals", "not", "and",
  "plus", "minus", "times", "dividedby",
  "chuck", "lot", "mates", "call", "it",
  "bugger", "suss", "gimme",
  "yeah", "nah", "nothin"
]);

// Punctuation that acts as boundaries
const BOUNDARY_PUNCTUATION = new Set([":", ",", ".", "!", "?", "–"]);

function createLexer() {
  const lexer = moo.states({
    main: {
      WS: /[ \t]+/,
      // Keywords - order matters for matching
      KW_PREP: "prep",
      KW_BARBIE: "barbie",
      KW_WITH: "with",
      KW_CRIKEY: "crikey",
      DASH: "–",
      KW_FAIR: "fair",
      KW_IS: "is",
      KW_BLOODY: "bloody",
      KW_FLAMIN: "flamin",
      KW_FROTHIN: "frothin",
      KW_SPEWIN: "spewin",
      KW_MATE: "mate",
      
      // Data structure keywords
      KW_ESKY: "esky",
      KW_TUCKSHOP: "tuckshop",
      KW_EMPTY: "empty",
      
      // Loop keywords
      KW_SCOFFIN: "scoffin",
      KW_DEALIN: "dealin",
      KW_DEAL: "deal",
      KW_THE: "the",
      KW_FROM: "from",
      KW_PASS: "pass",
      KW_TIL: "til",
      KW_FULLY: "fully",
      KW_SICK: "sick",
      KW_WHOS: "who's",
      KW_FULL: "full",
      KW_GOT: "got",
      KW_GO: "go",
      KW_EVERY: "every",
      KW_IN: "in",
      
      // List operations
      KW_ANOTHER: "another",
      KW_SHRIMP: "shrimp",
      KW_DITCH: "ditch",
      KW_DROP: "drop",
      KW_LAST: "last",
      KW_FIRST: "first",
      KW_SNAG: "snag",
      KW_SHEEPSHEAR: "sheepshear",
      KW_TOP: "top",
      KW_UP: "up",
      KW_GRAB: "grab",
      KW_AT: "at",
      
      // Conditionals
      KW_IF: "if",
      KW_OR: "or",
      KW_OTHERWISE: "otherwise",
      KW_MAKE: "make",
      KW_TRACKS: "tracks",
      
      // Comparison operators
      KW_BIGGERTHAN: "biggerthan",
      KW_SMALLERTHAN: "smallerthan",
      KW_EQUALS: "equals",
      KW_NOT: "not",
      KW_AND: "and",
      
      // Arithmetic operators
      KW_PLUS: "plus",
      KW_MINUS: "minus",
      KW_TIMES: "times",
      KW_DIVIDEDBY: "dividedby",
      
      // Import keywords
      KW_CHUCK: "chuck",
      KW_LOT: "lot",
      KW_MATES: "mates",
      KW_CALL: "call",
      
      // Exception/assertion
      KW_BUGGER: "bugger",
      KW_SUSS: "suss",
      
      // IO
      KW_GIMME: "gimme",
      
      // Punctuation
      COLON: ":",
      COMMA: ",",
      DOT: ".",
      BANG: "!",
      QUESTION: "?",
      
      BOOL: /yeah|nah/,
      NULL: "nothin",
      NUMBER: /-?[0-9]+(?:\.[0-9]+)?/,
      STRING: /"(?:[^"\\]|\\.)*"/,
      IDENT: /[a-zA-Z_][a-zA-Z0-9_]*/,
      NL: { match: /\r?\n/, lineBreaks: true },
    }
  });

  let indentStack = [0];
  let queue = [];
  let inBloodyString = false;
  let bloodyStringContent = [];
  
  // Context for multi-word identifier accumulation
  let multiWordContext = null; // { startKeyword: string, words: string[], boundaryKeywords: Set }

  // Check if a token is a boundary
  function isBoundary(tok) {
    if (!tok) return true;
    if (tok.type === "NL" || tok.type === "INDENT" || tok.type === "DEDENT") return true;
    if (BOUNDARY_PUNCTUATION.has(tok.value)) return true;
    // Check if it's a keyword token
    if (tok.type.startsWith("KW_")) return true;
    if (tok.type === "BOOL" || tok.type === "NULL" || tok.type === "NUMBER" || tok.type === "STRING") return true;
    // Check if the identifier value is a boundary keyword
    if (tok.type === "IDENT" && BOUNDARY_KEYWORDS.has(tok.value.toLowerCase())) return true;
    return false;
  }

  function next() {
    while (true) {
      if (queue.length) return queue.shift();
      let tok = lexer.next();
      if (!tok) {
        // Handle end of file while in bloody string mode
        if (inBloodyString) {
          throw new Error("Unterminated bloody...mate string");
        }
        return tok;
      }

      // Handle bloody...mate string parsing
      if (inBloodyString) {
        if (tok.type === "KW_MATE") {
          inBloodyString = false;
          const content = bloodyStringContent.join(" ").trim();
          bloodyStringContent = [];
          return { type: "SLANG_STRING", value: content };
        } else if (tok.type === "NL") {
          throw new Error("Unexpected newline in bloody...mate string. Did you forget 'mate'?");
        } else if (tok.type === "WS") {
          continue;
        } else {
          bloodyStringContent.push(tok.value || tok.text);
          continue;
        }
      }

      // Skip whitespace tokens
      if (tok.type === "WS") continue;

      // Check if this is the start of a bloody...mate string
      if (tok.type === "KW_BLOODY") {
        let peek = lexer.next();
        while (peek && peek.type === "WS") {
          peek = lexer.next();
        }
        
        if (!peek) {
          return tok;
        }
        
        let peek2 = lexer.next();
        while (peek2 && peek2.type === "WS") {
          peek2 = lexer.next();
        }
        
        if (peek2 && (peek2.type === "COMMA" || peek2.type === "DOT" || peek2.type === "NL")) {
          queue.push(peek2);
          return { type: "BLOODY_ITEM", value: peek.value || peek.text };
        } else if (peek2 && peek2.type === "KW_MATE") {
          return { type: "SLANG_STRING", value: peek.value || peek.text };
        } else {
          inBloodyString = true;
          bloodyStringContent = [peek.value || peek.text];
          if (peek2) {
            bloodyStringContent.push(peek2.value || peek2.text);
          }
          continue;
        }
      }

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
          queue.push({ type: "NL", value: "\n" });
        }
        if (peek) queue.push(peek);
        continue;
      }
      return tok;
    }
  }

  return {
    next,
    reset: (...args) => { 
      indentStack = [0]; 
      queue = []; 
      inBloodyString = false;
      bloodyStringContent = [];
      multiWordContext = null;
      lexer.reset(...args); 
    },
    save: lexer.save.bind(lexer),
    formatError: lexer.formatError.bind(lexer),
    has: (name) => {
      const synthetics = ["INDENT", "DEDENT", "SLANG_STRING", "BLOODY_ITEM", "MULTI_WORD_IDENT"];
      return synthetics.includes(name) || lexer.has(name);
    },
  };
}

module.exports = createLexer;
