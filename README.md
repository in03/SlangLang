# SlangLang

A playful, Australian-slang-inspired programming language. Reads like you're having a yarn, compiles to JavaScript.

## Quick Start

```bash
bun install
bun nearleyc grammar.ne -o grammar.js
bun link
aussie examples/demo.slang
```

## Playground

Try SlangLang in your browser with an interactive playground featuring AI-powered code generation:

```bash
bun run build:playground
# Then open playground/dist/index.html
```

The playground includes:
- **AI Code Generator**: Generate custom SlangLang code using GitHub Models API
- **Interactive Editor**: Write and run SlangLang code with syntax highlighting
- **GitHub OAuth**: Sign in to access AI features powered by GitHub Models
- **Compilation View**: See your SlangLang code transpiled to JavaScript

**Setup GitHub OAuth** for AI features: See `playground/OAUTH_SETUP.md`

> **Security Note**: The playground uses client-side OAuth which is secure for this use case but stores tokens in localStorage. For high-security applications, consider server-side OAuth implementation.

## Syntax

### Variables

```slang
name is bloody Bruce mate
count is 42
length is flamin ripper
price is frothin 9.99
```

- `is` — assignment (no `=` symbol)
- `bloody ... mate` — string without quotes
- `flamin <word>` — integer from word length (`flamin ripper` → `6`)
- `frothin <number>` — explicit float

### Functions

```slang
prep greet barbie
  Crikey! "gday"
  fair go yeah

greet
```

- `prep <name> barbie` — define a function
- Indentation defines the body
- `fair go <expr>` — return a value
- Bare identifier calls the function

### Output

```slang
Crikey! "gday mate"
Crikey! name
```

- `Crikey! <expr>` — print to stdout
- Keywords are case-insensitive (`crikey!`, `Crikey!`, `CRIKEY!` all work)

### Primitives

| Slang     | Meaning |
|-----------|---------|
| `yeah`    | true    |
| `nah`     | false   |
| `nothin`  | null    |
| `"text"`  | string  |
| `42`      | number  |

## Implementation

```
.slang file
    ↓
Lexer (Moo + custom indent handling)
    ↓
Parser (Nearley grammar)
    ↓
AST (plain JS objects)
    ↓
Transpiler → JavaScript
    ↓
Execute (Bun/Node)
```

| File          | Purpose                        |
|---------------|--------------------------------|
| `lexer.js`    | Tokenizer with INDENT/DEDENT   |
| `grammar.ne`  | Nearley grammar definition     |
| `compiler.js` | AST → JavaScript transpiler    |
| `bin/aussie.js` | CLI entry point              |

## Roadmap

**Done:**
- Variables and assignment
- Functions (no params yet)
- Print statements  
- Slang strings, integers, floats

**Next:**
- Lists (`esky`) and dictionaries (`tuckshop`)
- Conditionals and loops
- Function parameters
- Arithmetic expressions

**Later:**
- REPL
- Syntax highlighting
- Single-binary distribution

## Guiding Rule

If a line of SlangLang can't be read aloud in an Australian accent without embarrassment, it probably violates the spec.

See `spec.md` for the full language specification.
