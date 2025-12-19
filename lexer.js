const moo = require("moo");

// Keywords that act as boundaries for multi-word identifiers
const BOUNDARY_KEYWORDS = new Set([
  "prep", "barbie", "with", "crikey", "fair", "go", "deal", "is", "isn't",
  "bloody", "flamin", "frothin", "spewin", "mate",
  "esky", "tuckshop", "empty",
  "scoffin", "dealin", "from", "pass", "the",
  "til", "fully", "sick", "every", "in",
  "another", "shrimp", "ditch", "drop", "last", "first", "snag",
  "sheepshear", "tops", "cops", "up", "grab", "at",
  "if", "or", "otherwise", "make", "tracks", "equals", "not", "and",
  "plus", "minus", "times", "dividedby", "then",
  "chuck", "lot", "mates", "call", "it",
  "bugger", "suss", "gimme",
  "yeah", "nah", "nothin",
  "oi", "aussie", "on", "off"
]);

// Punctuation that acts as boundaries
const BOUNDARY_PUNCTUATION = new Set([":", ",", ".", "!", "?", "–"]);

// Helper to create case-insensitive keyword regex for moo (no /i flag allowed)
// Converts "word" to /[Ww][Oo][Rr][Dd](?![a-zA-Z0-9_])/ (with negative lookahead for word boundary)
function kw(word) {
  const pattern = word.split('').map(c => {
    if (/[a-z]/i.test(c)) {
      return `[${c.toUpperCase()}${c.toLowerCase()}]`;
    }
    return c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape special chars
  }).join('');
  // Add negative lookahead to prevent matching as prefix of longer identifier
  return new RegExp(pattern + '(?![a-zA-Z0-9_])');
}

function createLexer() {
  const lexer = moo.states({
    main: {
      // Comments - must come before other tokens
      // Line comment: oi ...
      LINE_COMMENT: /[Oo][Ii](?![Oo][Ii])[ \t][^\n]*/,
      // Block comment: aussie aussie aussie ... oi oi oi
      BLOCK_COMMENT_START: { match: /[Aa][Uu][Ss][Ss][Ii][Ee][ \t]+[Aa][Uu][Ss][Ss][Ii][Ee][ \t]+[Aa][Uu][Ss][Ss][Ii][Ee]/, push: "blockComment" },
      
      WS: /[ \t]+/,
      // Keywords - order matters for matching (case-insensitive)
      KW_PREP: kw("prep"),
      KW_BARBIE: kw("barbie"),
      KW_WITH: kw("with"),
      KW_CRIKEY: kw("crikey"),
      KW_FAIR: kw("fair"),
      KW_ISNT: /[Ii][Ss][Nn][\u2019'][Tt]/,  // Support both apostrophe types, case-insensitive
      KW_IS: kw("is"),
      KW_BLOODY: kw("bloody"),
      KW_FLAMIN: kw("flamin"),
      KW_FROTHIN: kw("frothin"),
      KW_SPEWIN: kw("spewin"),
      KW_MATE: kw("mate"),
      
      // Data structure keywords
      KW_ESKY: kw("esky"),
      KW_TUCKSHOP: kw("tuckshop"),
      KW_EMPTY: kw("empty"),
      
      // Loop keywords
      KW_SCOFFIN: kw("scoffin"),
      KW_DEALIN: kw("dealin"),
      KW_DEAL: kw("deal"),
      KW_THEN: kw("then"),  // Must come before KW_THE!
      KW_THE: kw("the"),
      KW_FROM: kw("from"),
      KW_PASS: kw("pass"),
      KW_TIL: kw("til"),
      KW_FULLY: kw("fully"),
      KW_SICK: kw("sick"),
      KW_WHOS: /[Ww][Hh][Oo][\u2019'][Ss]/,  // Support both apostrophe types, case-insensitive
      KW_FULL: kw("full"),
      KW_GOT: kw("got"),
      KW_GO: kw("go"),
      KW_EVERY: kw("every"),
      KW_IN: kw("in"),
      
      // List operations
      KW_ANOTHER: kw("another"),
      KW_SHRIMP: kw("shrimp"),
      KW_DITCH: kw("ditch"),
      KW_DROP: kw("drop"),
      KW_LAST: kw("last"),
      KW_FIRST: kw("first"),
      KW_SNAG: kw("snag"),
      KW_SHEEPSHEAR: kw("sheepshear"),
      KW_TOPS: kw("tops"),
      KW_COPS: kw("cops"),
      KW_UP: kw("up"),
      KW_GRAB: kw("grab"),
      KW_AT: kw("at"),
      
      // Conditionals
      KW_IF: kw("if"),
      KW_OR: kw("or"),
      KW_OTHERWISE: kw("otherwise"),
      KW_MAKE: kw("make"),
      KW_TRACKS: kw("tracks"),
      
      // Comparison operators (tops = >, cops = <)
      KW_EQUALS: kw("equals"),
      KW_NOT: kw("not"),
      KW_AND: kw("and"),
      
      // Arithmetic operators
      KW_PLUS: kw("plus"),
      KW_MINUS: kw("minus"),
      KW_TIMES: kw("times"),
      KW_DIVIDEDBY: kw("dividedby"),
      
      // Import keywords
      KW_CHUCK: kw("chuck"),
      KW_LOT: kw("lot"),
      KW_MATES: kw("mates"),
      KW_CALL: kw("call"),
      
      // Exception/assertion
      KW_BUGGER: kw("bugger"),
      KW_SUSS: kw("suss"),
      
      // IO
      KW_GIMME: kw("gimme"),
      
      // Function declaration (new syntax)
      KW_ON: kw("on"),
      KW_OFF: kw("off"),
      
      // Comment keyword (for line-ending oi that didn't match LINE_COMMENT)
      KW_OI: kw("oi"),
      
      // Punctuation
      COLON: ":",
      COMMA: ",",
      DOT: ".",
      BANG: "!",
      QUESTION: "?",
      DASH: "–",  // Keep for backwards compatibility with imports etc.
      
      BOOL: /[Yy][Ee][Aa][Hh]|[Nn][Aa][Hh]/,
      NULL: kw("nothin"),
      NUMBER: /-?[0-9]+(?:\.[0-9]+)?/,
      STRING: /"(?:[^"\\]|\\.)*"/,
      IDENT: /[a-zA-Z_][a-zA-Z0-9_]*/,
      NL: { match: /\r?\n/, lineBreaks: true },
    },
    // Block comment state: aussie aussie aussie ... oi oi oi
    blockComment: {
      BLOCK_COMMENT_END: { match: /[Oo][Ii][ \t]+[Oo][Ii][ \t]+[Oo][Ii]/, pop: 1 },
      BLOCK_COMMENT_CONTENT: { match: /[^oO]+|[oO](?![iI][ \t]+[oO][iI][ \t]+[oO][iI])/, lineBreaks: true },
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
      
      // Skip comments
      if (tok.type === "LINE_COMMENT") continue;
      if (tok.type === "BLOCK_COMMENT_START" || tok.type === "BLOCK_COMMENT_CONTENT" || tok.type === "BLOCK_COMMENT_END") continue;

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
        
        // Skip comments when peeking after newline
        while (peek && (peek.type === "LINE_COMMENT" || peek.type === "BLOCK_COMMENT_START" || 
               peek.type === "BLOCK_COMMENT_CONTENT" || peek.type === "BLOCK_COMMENT_END")) {
          peek = lexer.next();
          // If we hit another newline after comment, we need to re-process whitespace
          if (peek && peek.type === "NL") {
            peek = lexer.next();
            if (peek && peek.type === "WS") {
              spaces = peek.value.length;
              peek = lexer.next();
            } else {
              spaces = 0;
            }
          }
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
      const synthetics = ["INDENT", "DEDENT", "SLANG_STRING", "BLOODY_ITEM", "MULTI_WORD_IDENT", "LINE_COMMENT", "BLOCK_COMMENT_START", "BLOCK_COMMENT_CONTENT", "BLOCK_COMMENT_END"];
      return synthetics.includes(name) || lexer.has(name);
    },
  };
}

module.exports = createLexer;
