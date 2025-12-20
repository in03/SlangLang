const moo = require("moo");

// =============================================================================
// KEYWORD DEFINITIONS - Single source of truth for all SlangLang keywords
// =============================================================================
// Categories are used for syntax highlighting. Add new keywords here.
const KEYWORDS = {
  control:  ["if", "or", "otherwise", "make", "tracks"],
  loop:     ["scoffin", "dealin", "pass", "the", "from", "every", "in", "til", "fully", "sick", "full", "got"],
  function: ["prep", "barbie", "with", "and", "fair", "go", "serve", "on", "off", "howbout"],
    operator: ["is", "then", "tops", "cops", "equals", "not", "plus", "minus", "times", "dividedby"],
  type:     ["flamin", "frothin", "spewin", "esky", "tuckshop", "empty"],
  builtin:  ["crikey", "grab", "at", "chuck", "lot", "mates", "call", "bugger", "suss", "gimme",
             "another", "shrimp", "ditch", "drop", "last", "first", "snag", "sheepshear", "top", "up", "oi"],
  literal:  ["yeah", "nah", "nothin"],
  string:   ["bloody", "mate"],
  special:  ["isn't", "who's"],  // Keywords with apostrophes (need regex, not kw())
};

// Flatten all keywords into a single array
function getAllKeywords() {
  const all = new Set();
  for (const category of Object.values(KEYWORDS)) {
    for (const kw of category) {
      all.add(kw);
    }
  }
  return Array.from(all).sort();
}

// Keywords that act as boundaries for multi-word identifiers (exclude apostrophe ones)
const BOUNDARY_KEYWORDS = new Set(getAllKeywords().filter(k => !k.includes("'")));

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
      KW_HOWBOUT: kw("howbout"),
      KW_SPEWIN: kw("spewin"),
      KW_MATE: kw("mate"),
      
      // Data structure keywords
      KW_ESKY: kw("esky"),
      KW_TUCKSHOP: kw("tuckshop"),
      KW_EMPTY: kw("empty"),
      
      // Loop keywords
      KW_SCOFFIN: kw("scoffin"),
      KW_DEALIN: kw("dealin"),
      KW_SERVE: kw("serve"),
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
      // Special characters that can appear in bloody...mate strings
      SQUOTE: "'",
      DQUOTE: "\"",
      BACKTICK: "`",
      CHAR: /[^\s]/,  // Fallback for any other single character
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
          const content = bloodyStringContent.join("").trim();
          bloodyStringContent = [];
          return { type: "SLANG_STRING", value: content };
        } else if (tok.type === "NL") {
          throw new Error("Unexpected newline in bloody...mate string. Did you forget 'mate'?");
        } else if (tok.type === "WS") {
          // Preserve whitespace in bloody strings
          bloodyStringContent.push(tok.value);
          continue;
        } else {
          // Capture any token's value - including special chars like quotes
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
        // Skip initial whitespace after "bloody"
        let peek = lexer.next();
        while (peek && peek.type === "WS") {
          peek = lexer.next();
        }
        
        if (!peek) {
          return tok;
        }
        
        // For BLOODY_ITEM detection, we need to check if it's a single word followed by boundary
        // Collect everything until we can determine the type
        let collectedTokens = [peek];
        let collectedWS = [];
        
        let peek2 = lexer.next();
        // Track whitespace separately for potential BLOODY_ITEM case
        while (peek2 && peek2.type === "WS") {
          collectedWS.push(peek2);
          peek2 = lexer.next();
        }
        
        if (peek2 && (peek2.type === "COMMA" || peek2.type === "NL")) {
          // BLOODY_ITEM: bloody <word>,  or  bloody <word>\n
          queue.push(peek2);
          return { type: "BLOODY_ITEM", value: peek.value || peek.text };
        } else if (peek2 && peek2.type === "DOT") {
          // Could be BLOODY_ITEM (bloody word.) or string with internal dot (bloody word. more mate)
          // Keep peeking to collect all dots and see what follows
          let dots = ["."];
          let peek3 = lexer.next();
          
          // Collect consecutive dots
          while (peek3 && peek3.type === "DOT") {
            dots.push(".");
            peek3 = lexer.next();
          }
          
          // Skip whitespace after dots
          let wsAfterDots = [];
          while (peek3 && peek3.type === "WS") {
            wsAfterDots.push(peek3.value);
            peek3 = lexer.next();
          }
          
          if (!peek3 || peek3.type === "NL") {
            // bloody word... at end of line → BLOODY_ITEM (dots are statement terminators)
            if (peek3) queue.push(peek3);
            // Push remaining dots back (all but one which terminates)
            for (let i = 1; i < dots.length; i++) {
              queue.push({ type: "DOT", value: "." });
            }
            queue.push({ type: "DOT", value: "." });
            return { type: "BLOODY_ITEM", value: peek.value || peek.text };
          } else {
            // More content follows → multi-word string containing the dots
            inBloodyString = true;
            bloodyStringContent = [peek.value || peek.text, ...dots];
            // Add whitespace
            for (const ws of wsAfterDots) {
              bloodyStringContent.push(ws);
            }
            bloodyStringContent.push(peek3.value || peek3.text);
            continue;
          }
        } else if (peek2 && peek2.type === "KW_MATE") {
          // Single word bloody string: bloody <word> mate
          return { type: "SLANG_STRING", value: peek.value || peek.text };
        } else {
          // Multi-word bloody string - preserve whitespace
          inBloodyString = true;
          bloodyStringContent = [peek.value || peek.text];
          // Add collected whitespace
          for (const ws of collectedWS) {
            bloodyStringContent.push(ws.value);
          }
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

// Export lexer factory and keyword definitions
module.exports = createLexer;
module.exports.KEYWORDS = KEYWORDS;
module.exports.getAllKeywords = getAllKeywords;
