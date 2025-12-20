#!/usr/bin/env node
/**
 * Generates syntax highlighting rules from SlangLang lexer.
 * 
 * Usage: node tools/generate-syntax.js
 * 
 * Outputs:
 *   - editor/slanglang.tmLanguage.json (VS Code / TextMate)
 *   - editor/slanglang.hljs.js (Highlight.js)
 *   - editor/keywords.json (for playground)
 * 
 * Keywords are defined in lexer.js - the single source of truth.
 */

const fs = require("fs");
const path = require("path");

// Import keywords directly from the lexer
const { KEYWORDS, getAllKeywords } = require("../lexer");

// Generate VS Code TextMate grammar
function generateTMLanguage(keywords) {
  const allKeywords = [
    ...keywords.control,
    ...keywords.loop, 
    ...keywords.function,
    ...keywords.type,
    ...keywords.builtin,
  ];

  const grammar = {
    "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    "name": "SlangLang",
    "scopeName": "source.slang",
    "fileTypes": ["slang"],
    "patterns": [
      { "include": "#comments" },
      { "include": "#strings" },
      { "include": "#slang-strings" },
      { "include": "#numbers" },
      { "include": "#operators" },
      { "include": "#keywords" },
      { "include": "#control" },
      { "include": "#functions" },
      { "include": "#types" },
      { "include": "#literals" },
      { "include": "#punctuation" },
    ],
    "repository": {
      "comments": {
        "patterns": [
          {
            "name": "comment.line.slang",
            "match": "#.*$"
          }
        ]
      },
      "strings": {
        "patterns": [
          {
            "name": "string.quoted.double.slang",
            "begin": "\"",
            "end": "\"",
            "patterns": [
              {
                "name": "constant.character.escape.slang",
                "match": "\\\\."
              }
            ]
          }
        ]
      },
      "slang-strings": {
        "patterns": [
          {
            "name": "string.unquoted.slang",
            "begin": "\\b(bloody)\\b",
            "beginCaptures": {
              "1": { "name": "keyword.other.string-delimiter.slang" }
            },
            "end": "\\b(mate)\\b|(?=,|\\.|!|\\?|$)",
            "endCaptures": {
              "1": { "name": "keyword.other.string-delimiter.slang" }
            },
            "patterns": [
              {
                "name": "string.unquoted.content.slang",
                "match": "[^,\\.!\\?\\n]+"
              }
            ]
          }
        ]
      },
      "numbers": {
        "patterns": [
          {
            "name": "constant.numeric.slang",
            "match": "-?\\b[0-9]+(\\.[0-9]+)?\\b"
          }
        ]
      },
      "operators": {
        "patterns": [
          {
            "name": "keyword.operator.slang",
            "match": `\\b(${keywords.operator.filter(op => !op.includes("'")).join("|")})\\b`
          },
          {
            "name": "keyword.operator.slang",
            "match": `(?<![a-zA-Z])(${keywords.operator.filter(op => op.includes("'")).join("|")})(?![a-zA-Z])`
          },
          {
            "name": "keyword.operator.punctuation.slang",
            "match": "–"
          }
        ]
      },
      "keywords": {
        "patterns": [
          {
            "name": "keyword.other.slang",
            "match": `\\b(${keywords.builtin.join("|")})\\b`
          }
        ]
      },
      "control": {
        "patterns": [
          {
            "name": "keyword.control.slang",
            "match": `\\b(${[...keywords.control, ...keywords.loop].join("|")})\\b`
          },
          {
            "name": "keyword.control.loop-end.slang",
            "match": "who's\\s+(full|got\\s+it)\\?"
          }
        ]
      },
      "functions": {
        "patterns": [
          {
            "name": "keyword.function.slang",
            "match": `\\b(${keywords.function.join("|")})\\b`
          },
          {
            "name": "entity.name.function.slang",
            "match": "\\b(prep)\\s+(\\w+)",
            "captures": {
              "1": { "name": "keyword.function.slang" },
              "2": { "name": "entity.name.function.definition.slang" }
            }
          }
        ]
      },
      "types": {
        "patterns": [
          {
            "name": "storage.type.slang",
            "match": `\\b(${keywords.type.join("|")})\\b`
          }
        ]
      },
      "literals": {
        "patterns": [
          {
            "name": "constant.language.boolean.true.slang",
            "match": "\\byeah\\b"
          },
          {
            "name": "constant.language.boolean.false.slang",
            "match": "\\bnah\\b"
          },
          {
            "name": "constant.language.null.slang",
            "match": "\\bnothin\\b"
          },
          {
            "name": "constant.language.empty.slang",
            "match": "\\bempty\\b"
          }
        ]
      },
      "punctuation": {
        "patterns": [
          {
            "name": "punctuation.separator.slang",
            "match": "[,:\\.!\\?]"
          }
        ]
      }
    }
  };

  return JSON.stringify(grammar, null, 2);
}

// Generate Highlight.js language definition
function generateHighlightJS(keywords) {
  const code = `/*
 * SlangLang syntax highlighting for Highlight.js
 * Auto-generated from lexer.js
 */
export default function(hljs) {
  const KEYWORDS = {
    keyword: '${[...keywords.control, ...keywords.loop, ...keywords.function].join(" ")}',
    built_in: '${keywords.builtin.join(" ")}',
    type: '${keywords.type.join(" ")}',
    literal: '${keywords.literal.join(" ")} empty',
  };

  const OPERATORS = '${keywords.operator.join(" ")}';

  const SLANG_STRING = {
    className: 'string',
    begin: /\\bbloody\\b/,
    end: /\\bmate\\b|(?=[,\\.!\\?]|$)/,
    contains: [
      { className: 'keyword', begin: /\\b(bloody|mate)\\b/ }
    ]
  };

  const QUOTED_STRING = {
    className: 'string',
    begin: '"',
    end: '"',
    contains: [
      hljs.BACKSLASH_ESCAPE
    ]
  };

  const NUMBER = {
    className: 'number',
    begin: /-?\\b\\d+(\\.\\d+)?\\b/
  };

  const COMMENT = {
    className: 'comment',
    begin: /#/,
    end: /$/
  };

  return {
    name: 'SlangLang',
    aliases: ['slang'],
    keywords: KEYWORDS,
    contains: [
      COMMENT,
      QUOTED_STRING,
      SLANG_STRING,
      NUMBER,
      {
        className: 'operator',
        begin: new RegExp('\\\\b(' + OPERATORS.split(' ').join('|') + ')\\\\b')
      },
      {
        className: 'title.function',
        begin: /\\bprep\\s+/,
        end: /\\s+barbie/,
        excludeBegin: true,
        excludeEnd: true
      },
      {
        className: 'punctuation',
        begin: /[–,:\\.!\\?]/
      }
    ]
  };
}
`;
  return code;
}

// Generate simple CSS theme
function generateCSS() {
  return `/* SlangLang Syntax Highlighting Theme */
.hljs-keyword { color: #c678dd; font-weight: bold; }
.hljs-built_in { color: #61afef; }
.hljs-type { color: #e5c07b; }
.hljs-literal { color: #d19a66; }
.hljs-string { color: #98c379; }
.hljs-number { color: #d19a66; }
.hljs-operator { color: #56b6c2; }
.hljs-comment { color: #5c6370; font-style: italic; }
.hljs-title.function { color: #61afef; font-weight: bold; }
.hljs-punctuation { color: #abb2bf; }
`;
}

// Generate keywords JSON for playground/other tools
function generateKeywordsJSON() {
  return JSON.stringify({
    all: getAllKeywords(),
    categorized: KEYWORDS
  }, null, 2);
}

// Generate VS Code extension package.json
function generateVSCodePackage() {
  return JSON.stringify({
    "name": "slanglang",
    "displayName": "SlangLang",
    "description": "Syntax highlighting for SlangLang - Australian slang programming language",
    "version": "0.2.0",
    "publisher": "slanglang",
    "engines": { "vscode": "^1.60.0" },
    "categories": ["Programming Languages"],
    "contributes": {
      "languages": [{
        "id": "slang",
        "aliases": ["SlangLang", "slang"],
        "extensions": [".slang"],
        "configuration": "./language-configuration.json"
      }],
      "grammars": [{
        "language": "slang",
        "scopeName": "source.slang",
        "path": "./syntaxes/slanglang.tmLanguage.json"
      }]
    }
  }, null, 2);
}

// Generate VS Code language configuration
function generateLanguageConfig() {
  return JSON.stringify({
    "comments": { "lineComment": "#" },
    "brackets": [["(", ")"], ["[", "]"], ["{", "}"]],
    "autoClosingPairs": [
      { "open": "\"", "close": "\"" },
      { "open": "(", "close": ")" },
      { "open": "[", "close": "]" },
      { "open": "{", "close": "}" }
    ],
    "surroundingPairs": [["\"", "\""], ["(", ")"], ["[", "]"], ["{", "}"]],
    "indentationRules": {
      "increaseIndentPattern": "^.*(barbie|!|:)\\s*$",
      "decreaseIndentPattern": "^\\s*(who's full\\?|who's got it\\?|fully sick\\.|make tracks\\.|otherwise,).*$"
    },
    "wordPattern": "[a-zA-Z_][a-zA-Z0-9_]*"
  }, null, 2);
}

// Main
function main() {
  console.log("🎨 Generating syntax highlighting from lexer.js...\n");

  // Use KEYWORDS from the imported module
  const keywords = KEYWORDS;
  
  console.log("Keywords:");
  console.log(`  Control: ${keywords.control.join(", ")}`);
  console.log(`  Loops: ${keywords.loop.join(", ")}`);
  console.log(`  Functions: ${keywords.function.join(", ")}`);
  console.log(`  Operators: ${keywords.operator.join(", ")}`);
  console.log(`  Types: ${keywords.type.join(", ")}`);
  console.log(`  Built-ins: ${keywords.builtin.join(", ")}`);
  console.log(`  Literals: ${keywords.literal.join(", ")}`);
  console.log(`  String: ${keywords.string.join(", ")}`);
  console.log(`  Special: ${keywords.special.join(", ")}`);
  console.log("");

  // Ensure output directories exist
  const editorDir = path.join(__dirname, "..", "editor");
  const vscodeDir = path.join(editorDir, "vscode");
  const syntaxesDir = path.join(vscodeDir, "syntaxes");
  
  for (const dir of [editorDir, vscodeDir, syntaxesDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Generate TextMate grammar
  const tmLanguage = generateTMLanguage(keywords);
  
  // Save to both locations
  fs.writeFileSync(path.join(editorDir, "slanglang.tmLanguage.json"), tmLanguage);
  fs.writeFileSync(path.join(syntaxesDir, "slanglang.tmLanguage.json"), tmLanguage);
  console.log(`✅ Generated: slanglang.tmLanguage.json`);

  // Generate VS Code extension files
  fs.writeFileSync(path.join(vscodeDir, "package.json"), generateVSCodePackage());
  fs.writeFileSync(path.join(vscodeDir, "language-configuration.json"), generateLanguageConfig());
  console.log(`✅ Generated: VS Code extension in editor/vscode/`);

  // Generate Highlight.js language
  const hljsCode = generateHighlightJS(keywords);
  fs.writeFileSync(path.join(editorDir, "slanglang.hljs.js"), hljsCode);
  console.log(`✅ Generated: slanglang.hljs.js`);

  // Generate CSS theme
  const css = generateCSS();
  fs.writeFileSync(path.join(editorDir, "slanglang.css"), css);
  console.log(`✅ Generated: slanglang.css`);

  // Generate keywords JSON for playground
  const keywordsJson = generateKeywordsJSON();
  fs.writeFileSync(path.join(editorDir, "keywords.json"), keywordsJson);
  console.log(`✅ Generated: keywords.json`);

  console.log("\n🎉 Done!");
  console.log("\nRun 'bun run build:vsix' to package and install the VS Code extension.");
  console.log("For web (Highlight.js): import editor/slanglang.hljs.js and editor/slanglang.css");
}

main();

