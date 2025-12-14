# SlangLang — Language Specification

Version: 0.1 (Proof of Concept)

SlangLang is a playful, Australian‑slang‑inspired programming language designed to feel conversational, readable, and symbol‑light. It transpiles to JavaScript and executes via Bun or Node, while deliberately presenting itself as a distinct language with its own syntax, grammar, and tooling.

This document defines:

* What is **currently implemented** in the POC
* What is **explicitly planned** next
* How the **lexer, grammar, parser, compiler, and runtime** are structured

---

## 1. Design Goals

### Core Philosophy

* Minimise symbolic punctuation
* Prefer keywords over operators
* Indentation defines structure
* Readable aloud as near‑English slang
* Deterministic grammar (Nearley, not regex‑driven)
* Small, hackable core

### Non‑Goals (for now)

* Performance parity with JS
* Static typing
* Optimising compiler passes
* Full JS interop surface

---

## 2. File & Execution Model

### Source Files

* Extension: `.slang`
* UTF‑8 text
* Line‑based, indentation‑sensitive

### Execution

Typical usage:

```
aussie hello.slang
```

Under the hood:

1. Source is lexed with Moo
2. Parsed with Nearley grammar
3. AST is generated
4. AST is transpiled to JavaScript
5. JS is executed immediately via Bun or Node

No intermediate files are written by default.

### Runtime Targets

* Bun (preferred)
* Node.js (supported)

---

## 3. Lexical Structure (Lexer)

### Lexer Technology

* Moo stateful lexer
* Custom INDENT / DEDENT handling

### Whitespace & Indentation

* Indentation is significant
* Spaces only (tabs discouraged)
* INDENT and DEDENT tokens are synthesized based on leading whitespace after newlines

### Tokens (Implemented)

| Token           | Meaning                        |
| --------------- | ------------------------------ |
| `prep`          | Function definition keyword    |
| `barbie`        | Function body start marker     |
| `crikey`        | Print keyword                  |
| `fair` `go`     | Return keyword pair            |
| `yeah`          | Boolean true                   |
| `nah`           | Boolean false                  |
| `nothin`        | Null literal                   |
| `is`            | Assignment operator            |
| `bloody`        | Slang string start delimiter   |
| `mate`          | Slang string end delimiter     |
| `flamin`        | Length‑based integer keyword   |
| `frothin`       | Float literal keyword          |
| `–` (en dash)   | Print separator                |
| STRING          | Double‑quoted string           |
| NUMBER          | Numeric literal (int or float) |
| IDENT           | Identifier                     |
| NL              | Newline                        |
| INDENT / DEDENT | Block structure                |

### Planned Tokens

* Comparison keywords
* Loop keywords

---

## 4. Grammar & Parsing

### Parser Technology

* Nearley (Earley parser)
* Grammar‑first design
* No regex‑only parsing

### Grammar Characteristics

* Deterministic subset enforced
* No operator precedence yet
* Statement‑oriented grammar

### Program Structure

```
program → statement+
```

---

## 5. Primitives

### Implemented Primitives

| Slang    | Meaning       | JS Output |
| -------- | ------------- | --------- |
| `yeah`   | Boolean true  | `true`    |
| `nah`    | Boolean false | `false`   |
| `nothin` | Null          | `null`    |
| `"text"` | String        | JS string |

### Slang Strings

Strings can be written without quotes using `bloody` ... `mate` delimiters:

```
x is bloody dave is a great guy mate
```

Compiles to:

```js
let x = "dave is a great guy";
```

The content between `bloody` and `mate` is captured as a string literal (trimmed).

### Integers

Two forms supported:

**Direct numerals:**

```
count is 42
```

**Length‑based (flamin):**

The `flamin` keyword converts the following word to its character length:

```
x is flamin crazy
```

Compiles to:

```js
let x = 5;  // "crazy".length
```

### Floats

The `frothin` keyword introduces a float literal:

```
price is frothin 3.50
```

Compiles to:

```js
let price = 3.50;
```

### Planned Primitives

* Slang‑derived numeric literals (additional word‑based forms)

---

## 6. Expressions

### Implemented Expressions

* Boolean literal
* Null literal
* String literal

### Planned Expressions

* Variable references
* Arithmetic expressions
* Comparison expressions
* Function calls
* Slang indexing (`sheepshear`)

---

## 7. Statements

### Assignment Statement

```
name is bloody Bruce mate
count is 42
length is flamin ripper
price is frothin 9.99
```

* Declares and assigns a variable
* Compiles to JS `let`

### Print Statement

```
crikey – "gday"
```

* Outputs to stdout
* Compiles to `console.log`

### Return Statement

```
fair go yeah
```

* Must appear inside a function
* Compiles to JS `return`

---

## 8. Functions

### Function Definition

```
prep greet barbie
  crikey – "gday"
  fair go yeah
```

Grammar:

```
prep IDENT barbie block
```

* No parameters (yet)
* Indentation defines body
* Compiles to JS function declaration

### Planned Function Features

* Parameters
* Default values
* Function calls as expressions

---

## 9. Data Structures

### Esky (List)

**Status:** Planned / partially designed

Intended syntax:

```
esky shopping is esky
  "pies"
  "chocs"
```

Maps to:

```
["pies", "chocs"]
```

### Tuckshop (Dictionary / Map)

**Status:** Planned / partially designed

Intended syntax:

```
tuckshop items is tuckshop
  "pies" is 5
  "drinks" is 10
```

Maps to:

```
{ pies: 5, drinks: 10 }
```

### Planned Access

* JS‑style indexing initially
* Slang keyword indexing later

---

## 10. Control Flow

### Implemented

* Sequential execution
* Function return

### Planned

#### Loops

```
pass the parcel til condition
  ...
```

(Inverted while semantics)

#### Conditionals

```
if this is that
  ...
else
  ...
```

(Syntax TBD)

---

## 11. Architecture

### Pipeline

```
.slange file
  ↓
Lexer (moo + indentation)
  ↓
Parser (nearley)
  ↓
AST (plain JS objects)
  ↓
Transpiler (AST → JS)
  ↓
Runtime execution (bun/node)
```

### AST Design

* Minimal node types
* Explicit node tagging
* No implicit transformations

### Compiler Strategy

* Single‑pass AST to JS
* No optimisation
* Human‑readable JS output

---

## 12. CLI Tooling

### aussie CLI

Responsibilities:

* Read `.slang` file
* Invoke compiler
* Execute output immediately

Planned enhancements:

* `--ast` dump
* `--js` emit only
* `--check` parse‑only mode

---

## 13. Development Roadmap

### Short Term

* Restore `esky` and `tuckshop` fully
* Add variables and assignment
* Add numeric literals
* Add function calls

### Medium Term

* Loop constructs
* Conditionals
* Slang indexing syntax
* Module/import system

### Long Term / Experimental

* Single‑binary distribution via Bun
* REPL
* Syntax highlighting
* Self‑hosting grammar extensions

---

## 14. Guiding Rule

If a line of SlangLang cannot reasonably be read aloud in an Australian accent without embarrassment, it probably violates the spec.

End of specification.
