# SlangLang — Language Specification

Version: 0.2 (Extended POC)

SlangLang is a playful, Australian‑slang‑inspired programming language designed to feel conversational, readable, and symbol‑light. It transpiles to JavaScript and executes via Bun or Node, while deliberately presenting itself as a distinct language with its own syntax, grammar, and tooling.

This document defines:

* What is **currently implemented**
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
* **Multi-word identifiers** — variables can have natural, conversational names

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
* Context-aware bloody...mate string parsing

### Whitespace & Indentation

* Indentation is significant
* Spaces only (tabs discouraged)
* INDENT and DEDENT tokens are synthesized based on leading whitespace after newlines

### Case Insensitivity

All SlangLang keywords are **case-insensitive**. This allows for more natural, sentence-like code:

```slang
Crikey! "Hello"      // Capitalized at start of line
crikey! "hello"      // lowercase works too
If score biggerthan 90,
  Crikey! "Ripper!"
Make tracks.
```

### Multi-Word Identifiers

SlangLang supports **multi-word variable names** that feel natural and conversational. Keywords and punctuation act as boundaries:

```slang
scoffin the tasty morsel from sangas!
  Crikey! the_tasty_morsel
who's full?
```

Multi-word identifiers are joined with underscores in the compiled output: `the tasty morsel` → `the_tasty_morsel`.

Boundary markers include:
* Keywords (`from`, `is`, `in`, etc.)
* Punctuation (`:`, `,`, `.`, `!`, `?`)
* Newlines

### Tokens (Implemented)

| Token           | Meaning                        |
| --------------- | ------------------------------ |
| `prep`          | Function definition keyword    |
| `barbie`        | Function body start marker     |
| `with`          | Parameter list start           |
| `and`           | Parameter/argument separator   |
| `crikey`        | Print keyword (use with `!`)   |
| `fair` `go`     | Return keyword pair            |
| `deal`          | Return keyword (alternative)   |
| `yeah`          | Boolean true                   |
| `nah`           | Boolean false                  |
| `nothin`        | Null literal                   |
| `is`            | Assignment operator            |
| `bloody`        | Slang string/list item start   |
| `mate`          | Slang string end delimiter     |
| `flamin`        | Length‑based integer keyword   |
| `frothin`       | Float literal keyword          |
| `spewin`        | Float/length keyword (alias)   |
| `esky`          | List literal keyword           |
| `tuckshop`      | Dictionary literal keyword     |
| `empty`         | Empty list/null value          |
| `!`             | Print separator (after crikey) |
| STRING          | Double‑quoted string           |
| NUMBER          | Numeric literal (int or float) |
| IDENT           | Identifier                     |
| NL              | Newline                        |
| INDENT / DEDENT | Block structure                |

### Loop & Iteration Tokens

| Token      | Meaning                           |
| ---------- | --------------------------------- |
| `scoffin`  | For-each loop over list           |
| `dealin`   | For-each loop over dictionary     |
| `pass`     | Range loop start                  |
| `the`      | Article (part of multi-word id)   |
| `from`     | Source specifier                  |
| `every`    | Alternative for-loop              |
| `in`       | Range/collection specifier        |
| `til`      | While-not loop                    |
| `fully`    | Loop end marker part              |
| `sick`     | Loop end marker part              |
| `who's`    | Loop end marker start             |
| `full`     | Loop end marker part              |
| `got`      | Loop end marker part              |

### Comparison & Arithmetic Tokens

| Token         | Meaning                  |
| ------------- | ------------------------ |
| `biggerthan`  | Greater than (>)         |
| `smallerthan` | Less than (<)            |
| `equals`      | Equality (===)           |
| `not`         | Negation / not equals    |
| `plus`        | Addition (+)             |
| `minus`       | Subtraction (-)          |
| `times`       | Multiplication (*)       |
| `dividedby`   | Division (/)             |

### Conditional Tokens

| Token       | Meaning              |
| ----------- | -------------------- |
| `if`        | Conditional start    |
| `or`        | Else-if marker       |
| `otherwise` | Else clause          |
| `make`      | Conditional end part |
| `tracks`    | Conditional end part |

### List Operation Tokens

| Token       | Meaning                    |
| ----------- | -------------------------- |
| `another`   | Append operation start     |
| `shrimp`    | Append operation keyword   |
| `ditch`     | Remove operation           |
| `drop`      | Pop operation              |
| `last`      | Last element specifier     |
| `first`     | First element specifier    |
| `snag`      | Element noun               |
| `sheepshear`| Slice operation            |
| `top`       | Append alternative start   |
| `up`        | Append alternative part    |
| `grab`      | Index/key access           |
| `at`        | Access specifier           |

### Import Tokens

| Token   | Meaning                    |
| ------- | -------------------------- |
| `chuck` | Import statement start     |
| `lot`   | Wildcard import keyword    |
| `mates` | Alias introduction         |
| `call`  | Alias keyword              |

### Exception/Assertion Tokens

| Token   | Meaning                    |
| ------- | -------------------------- |
| `bugger`| Throw exception            |
| `suss`  | Assertion check            |

### IO Tokens

| Token   | Meaning                    |
| ------- | -------------------------- |
| `gimme` | Read from stdin            |

---

## 4. Grammar & Parsing

### Parser Technology

* Nearley (Earley parser)
* Grammar‑first design
* No regex‑only parsing

### Grammar Characteristics

* Deterministic subset enforced
* Multi-word identifier support
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
| `empty`  | Empty list    | `[]`      |

### Slang Strings

Strings can be written without quotes using `bloody` ... `mate` delimiters:

```slang
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

```slang
count is 42
```

**Length‑based (flamin):**

The `flamin` keyword converts the following word to its character length:

```slang
x is flamin crazy
```

Compiles to:

```js
let x = 5;  // "crazy".length
```

### Floats

The `frothin` or `spewin` keyword introduces a float literal:

```slang
price is frothin 3.50
weight is spewin 2.5
```

Compiles to:

```js
let price = 3.50;
let weight = 2.5;
```

---

## 6. Expressions

### Implemented Expressions

* Boolean literal (`yeah`, `nah`)
* Null literal (`nothin`)
* String literal (quoted or `bloody...mate`)
* Numeric literal (direct or `flamin`/`frothin`/`spewin`)
* Variable references
* Arithmetic expressions (`plus`, `minus`, `times`, `dividedby`)
* Comparison expressions (`biggerthan`, `smallerthan`, `equals`, `not equals`)
* Index/key access (`grab X from Y`)
* Function calls (`flamin funcname with args`)
* List expressions (`esky: items`)
* Dictionary expressions (`tuckshop: entries`)

### Arithmetic Operators

| Slang       | JS     | Example              |
| ----------- | ------ | -------------------- |
| `plus`      | `+`    | `x plus y`           |
| `minus`     | `-`    | `x minus y`          |
| `times`     | `*`    | `x times y`          |
| `dividedby` | `/`    | `x dividedby y`      |

### Comparison Operators

| Slang         | JS    | Example                |
| ------------- | ----- | ---------------------- |
| `biggerthan`  | `>`   | `x biggerthan 5`       |
| `smallerthan` | `<`   | `x smallerthan 10`     |
| `equals`      | `===` | `x equals y`           |
| `not equals`  | `!==` | `x not equals y`       |
| `is`          | `===` | `x is y` (in compare)  |
| `is not`      | `!==` | `x is not y`           |

---

## 7. Statements

### Assignment Statement

```slang
name is bloody Bruce mate
count is 42
length is flamin ripper
price is frothin 9.99
```

* Declares and assigns a variable
* Compiles to JS `let`

### Print Statement

```slang
Crikey! "gday"
Crikey! name
Crikey! x plus y
```

* Outputs to stdout
* Compiles to `console.log`
* Keywords are case-insensitive (`crikey!`, `Crikey!`, `CRIKEY!` all work)

### Return Statement

Two forms supported:

```slang
fair go yeah
deal result
```

* Must appear inside a function
* Compiles to JS `return`

---

## 8. Functions

### Function Definition (No Parameters)

```slang
prep greet barbie
  Crikey! "gday"
  fair go yeah
```

### Function Definition (With Parameters)

```slang
prep greet barbie with name
  Crikey! name
  deal yeah

prep add barbie with a and b
  deal a plus b
```

Grammar:

```
prep IDENT barbie [with paramlist] block
```

* Parameters separated by `and`
* Indentation defines body
* Compiles to JS function declaration

### Function Calls

**As statement (no args):**

```slang
greet
```

**With arguments:**

```slang
flamin greet with "Bruce"
flamin add with 5 and 10
```

---

## 9. Data Structures

### Esky (List)

Declare a list using `esky:` followed by comma-separated items ending with `.`:

```slang
goodies is esky: bloody beer, bloody chips, bloody lamington.
numbers is esky: 1, 2, 3.
```

Compiles to:

```js
let goodies = ["beer", "chips", "lamington"];
let numbers = [1, 2, 3];
```

### Tuckshop (Dictionary)

Declare a dictionary using `tuckshop:` followed by key-value pairs:

```slang
menu is tuckshop: pies is 5, sauce is "tomato", roll is 3.
```

Compiles to:

```js
let menu = { pies: 5, sauce: "tomato", roll: 3 };
```

### Index/Key Access (Grab)

Access list elements by index:

```slang
Crikey! grab 0 from goodies
```

Access dictionary values by key:

```slang
Crikey! grab pies from menu
```

### List Operations

**Append (Another Shrimp):**

```slang
another shrimp in goodies – bloody pavlova.
```

**Append (Top Up):**

```slang
goodies top up "snags"
```

**Remove:**

```slang
ditch bloody chips from goodies.
```

**Pop Last:**

```slang
drop the last snag from goodies.
```

**Pop First:**

```slang
drop the first snag from goodies.
```

**Clear:**

```slang
goodies is empty
```

### Slicing (Sheepshear)

Slice a list from start to end index:

```slang
snacks is sheepshear goodies from 1 in 3
```

Access single element:

```slang
Crikey! goodies sheepshear 0
```

---

## 10. Control Flow

### Loops

#### For-Each Loop (Scoffin)

Iterate over list items:

```slang
scoffin snag from sangas!
  Crikey! snag
who's full?
```

The iterator variable name is user-defined. Multi-word iterators are supported.

#### Dictionary Iteration (Dealin)

Iterate over dictionary entries with built-in `item` (key) and `price` (value) variables:

```slang
dealin from menu!
  Crikey! item
  Crikey! price
who's full?
```

#### Range Loop (Pass The Parcel)

Loop a specified number of times:

```slang
pass the counter, flamin five!
  Crikey! counter
who's got it?
```

Note: `flamin five` = 4 iterations (length of "five").

#### Alternative Range Loop (Every)

```slang
every num in flamin three:
  Crikey! num
```

Note: `flamin three` = 5 iterations (length of "three").

#### While-Not Loop (Til)

Loop while condition is falsy:

```slang
til bag is empty.
  Crikey! "still goin"
fully sick.
```

### Loop Terminators

| Syntax           | Used For          |
| ---------------- | ----------------- |
| `who's full?`    | scoffin, dealin   |
| `who's got it?`  | pass the parcel   |
| `fully sick.`    | til               |

### Conditionals

```slang
if age biggerthan 18,
  Crikey! "You're an adult"
make tracks.
```

With else-if and else:

```slang
if score biggerthan 90,
  Crikey! "Ripper!"
or if score biggerthan 50,
  Crikey! "Not bad"
otherwise,
  Crikey! "Better luck next time"
make tracks.
```

---

## 11. Imports

### Named Import

```slang
chuck in sqrt from math.
```

Compiles to:

```js
const { sqrt } = require("math");
```

### Wildcard Import

```slang
chuck in the lot from time.
```

### Module Import with Alias

```slang
chuck in numpy – mates call it numbers.
```

Compiles to:

```js
const numbers = require("numpy");
```

---

## 12. Exceptions & Assertions

### Throw Exception (Bugger)

```slang
bugger – "Something went wrong mate"
```

Compiles to:

```js
throw new Error("Something went wrong mate");
```

### Assertion (Suss)

Inverted assertion — throws if condition is TRUE:

```slang
suss if count is nothin.
```

With custom error block:

```slang
suss if weight is nothin:
  bugger – "need a weight mate"
```

---

## 13. IO

### Input (Gimme)

Read a line from stdin:

```slang
gimme count.
```

Compiles to async readline.

---

## 14. Architecture

### Pipeline

```
.slang file
  ↓
Lexer (moo + indentation + bloody/mate handling)
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

## 15. CLI Tooling

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

## 16. Development Roadmap

### Completed (v0.2)

* ✅ Esky (list) literals with bloody items
* ✅ Tuckshop (dictionary) literals
* ✅ List iteration (scoffin loop)
* ✅ Dictionary iteration (dealin loop)
* ✅ Range loops (pass the parcel, every)
* ✅ While-not loop (til...fully sick)
* ✅ Conditionals (if/or if/otherwise/make tracks)
* ✅ Comparison operators (biggerthan, smallerthan, equals)
* ✅ Arithmetic operators (plus, minus, times, dividedby)
* ✅ List operations (append, remove, pop, slice)
* ✅ Grab (index/key access)
* ✅ Import statements (chuck in)
* ✅ Function parameters (with...and)
* ✅ Exception handling (bugger, suss)
* ✅ Spewin as float/length keyword
* ✅ Deal as return alternative
* ✅ Multi-word identifier support

### Short Term

* Input handling improvements
* Better error messages
* Resolve grammar ambiguities

### Medium Term

* REPL
* Syntax highlighting
* Module system

### Long Term / Experimental

* Single‑binary distribution via Bun
* Self‑hosting grammar extensions
* VS Code extension

---

## 17. Guiding Rule

If a line of SlangLang cannot reasonably be read aloud in an Australian accent without embarrassment, it probably violates the spec.

---

## 18. Known Conflicts & Design Decisions

### Keyword vs Identifier Conflicts

Some words serve as both keywords and valid identifiers. The lexer handles this by:

1. Matching longer keywords first (e.g., `dealin` before `deal`, `got` before `go`)
2. Allowing certain keywords (`snag`, `got`, `full`, `last`, `first`, `lot`, `the`) to be used as identifiers in expressions

### Multi-Word Identifier Boundaries

Multi-word identifiers are delimited by:
* Keywords that start new clauses (`from`, `in`, `is`, etc.)
* Punctuation (`:`, `,`, `.`, `!`, `?`)
* Indentation changes

### Bloody Context

The `bloody` keyword has two uses:
1. **String literal**: `bloody text here mate` → `"text here"`
2. **List item**: `bloody item,` or `bloody item.` → string item in esky

The lexer disambiguates by looking ahead for `mate` (string) vs punctuation (list item).

End of specification.
