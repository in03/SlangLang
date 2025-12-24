# SlangLang — Language Specification

Version: 0.3 (Stable)

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
If score tops 90,
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

### Comments

SlangLang supports both line and block comments:

**Line comments** start with `oi` followed by a space:

```slang
oi This is a line comment
x is 5  oi This won't work - oi must be at start of content
```

**Block comments** use the classic Aussie chant:

```slang
aussie aussie aussie
This is a block comment
that spans multiple lines
oi oi oi
```

### Tokens (Implemented)

| Token           | Meaning                        |
| --------------- | ------------------------------ |
| `oi`            | Line comment start             |
| `aussie aussie aussie` | Block comment open      |
| `oi oi oi`      | Block comment close            |
| `on`            | Function definition start      |
| `barbie`        | Function body start marker     |
| `with`          | Parameter list start           |
| `and`           | Parameter/argument separator   |
| `crikey`        | Print keyword (use with `!`)   |
| `serve`         | Return keyword                 |
| `fair` `go`     | Function block terminator      |
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
| `tops`        | Greater than (>)         |
| `cops`        | Less than (<)            |
| `equals`      | Equality (===)           |
| `not`         | Negation / not equals    |
| `plus`        | Addition (+)             |
| `minus`       | Subtraction (-)          |
| `times`       | Multiplication (*)       |
| `dividedby`   | Division (/)             |
| `then`        | Method chaining          |

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
| `tossin`    | Append operation start     |
| `noice`     | Append block end           |
| `as`        | Dict entry assignment      |
| `another`   | Append operation start (legacy) |
| `shrimp`    | Append operation keyword (legacy) |
| `ditch`     | Remove operation           |
| `drop`      | Pop operation              |
| `last`      | Last element specifier     |
| `first`     | First element specifier    |
| `snag`      | Element noun               |
| `sheepshear`| Slice operation            |
| `top`       | Append operation start           |
| `up`        | Append operation part            |
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
* Comparison expressions (`tops`, `cops`, `equals`, `not equals`)
* Index/key access (`grab X from Y`)
* Function calls (`howbout funcname with args`)
* Method chaining (`then`)
* List expressions (`esky: items`)
* Dictionary expressions (`tuckshop: entries`)

### Method Chaining

The `then` keyword enables fluent method chaining. Multi-word method names are converted to camelCase:

**Without arguments:**

```slang
name is bloody bruce mate
result is name then to upper case
Crikey! result
```

Compiles to:

```js
let name = "bruce";
let result = name.toUpperCase();
console.log(result);  // "BRUCE"
```

**With arguments (comma-separated after `with`):**

```slang
text is bloody hello world mate
result is text then slice with 0, 5
Crikey! result
```

Compiles to:

```js
let text = "hello world";
let result = text.slice(0, 5);
console.log(result);  // "hello"
```

**Chaining multiple methods:**

```slang
messy is bloody   hello world   mate
clean is messy then trim then to upper case
Crikey! clean
```

Compiles to:

```js
let messy = "   hello world   ";
let clean = messy.trim().toUpperCase();
console.log(clean);  // "HELLO WORLD"
```

### Arithmetic Operators

| Slang       | JS     | Example              |
| ----------- | ------ | -------------------- |
| `plus`      | `+`    | `x plus y`           |
| `minus`     | `-`    | `x minus y`          |
| `times`     | `*`    | `x times y`          |
| `dividedby` | `/`    | `x dividedby y`      |

Note: `plus` works on both numbers and strings (uses JS `+` operator).

### Comparison Operators

| Slang         | JS    | Example                |
| ------------- | ----- | ---------------------- |
| `tops`        | `>`   | `x tops 5`             |
| `cops`        | `<`   | `x cops 10`            |
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

```slang
serve result
```

* Must appear inside a function
* Compiles to JS `return`
* Fits the "barbie" theme — you cook it, then serve it!

---

## 8. Functions

### Function Definition (New Syntax)

The preferred way to define functions uses the "on the barbie" syntax:

**No parameters:**

```slang
greet on the barbie:
  Crikey! "gday"
  serve yeah
fair go.
```

**With comma-separated parameters:**

```slang
add on the barbie with a, b:
  serve a plus b
fair go.
```

**With `and`-separated parameters:**

```slang
greet on the barbie with name and age:
  Crikey! name
  serve yeah
```

**With indented parameter list:**

```slang
calculate on the barbie with
  first value
  second value
  multiplier
:
  serve first value times second value times multiplier
```

The `fair go.` terminator is **optional** when indentation is clear.

### Function Calls

**As statement (no args):**

```slang
greet
```

**With arguments:**

```slang
howbout greet with "Bruce"
howbout add with 5 and 10
```

---

## 9. Data Structures

### Esky (List)

Declare a list using `esky:` followed by comma-separated items ending with `.`:

```slang
goodies is esky: bloody beer, bloody chips, bloody lamington.
numbers is esky: 1, 2, 3.
```

Empty lists can be created by omitting the colon and items:

```slang
empty_list is esky.
```

Lists can contain variables as well as hardcoded values:

```slang
food is bloody chips mate.
condiment is flamin sauce.

goodies is esky: food, condiment, bloody beer.
```

Compiles to:

```js
let empty_list = [];
let food = "chips";
let condiment = 5;
let goodies = [food, condiment, "beer"];
```

Empty lists can be created in multiple ways:

```slang
empty_list is empty esky.
another_empty is esky.
```

### Tuckshop (Dictionary)

Declare a dictionary using `tuckshop:` followed by key-value pairs:

```slang
menu is tuckshop: pies is 5, sauce is "tomato", roll is 3.
```

Empty dictionaries can be created by omitting the colon and entries:

```slang
empty_dict is tuckshop.
```

Dictionaries can contain variables as well as hardcoded values:

```slang
price is flamin 8.
name is bloody hot dog mate.

menu is tuckshop: food is name, cost is price, available is yeah.
```

Compiles to:

```js
let empty_dict = {};
let price = 8;
let name = "hot dog";
let menu = { food: name, cost: price, available: true };
```

Empty dictionaries can be created in multiple ways:

```slang
empty_dict is empty tuckshop.
another_empty is tuckshop.
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

**Append (Tossin - Inline):**

```slang
tossin goodies: food, condiment.
```

**Append (Tossin - Block):**

```slang
tossin goodies:
  food,           # variable
  bloody cheese,  # hardcoded string
  flamin plates   # hardcoded number
noice.
```

**Dictionary Append (Tossin):**

```slang
tossin menu:
  food as bloody chips,
  condiment as flamin sauce,
  available as yeah
noice.
```

**Top Up (Append Multiple Items):**

```slang
goodies top up with bloody chips, bloody sauce, flamin plates.
```

Appends multiple items to a list in a single statement.

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

**Note:** All block terminators are **optional** when using indentation. The parser can infer block boundaries from dedent. Terminators add Aussie flavor and can help with error messages.

### Conditionals

```slang
if age tops 18,
  Crikey! "You're an adult"
make tracks.
```

With else-if and else:

```slang
if score tops 90,
  Crikey! "Ripper!"
or if score tops 50,
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
* ✅ Comparison operators (tops, cops, equals)
* ✅ Arithmetic operators (plus, minus, times, dividedby)
* ✅ List operations (append, remove, pop, slice)
* ✅ Grab (index/key access)
* ✅ Import statements (chuck in)
* ✅ Function parameters (with...and)
* ✅ Exception handling (bugger, suss)
* ✅ Spewin as float/length keyword
* ✅ Serve as return keyword
* ✅ Multi-word identifier support
* ✅ Top up with syntax for appending multiple items
* ✅ Comments (oi line, aussie aussie aussie block)
* ✅ New function syntax (on the barbie)
* ✅ Optional block terminators
* ✅ Method chaining (then, then...with)
* ✅ Empty collections (`x is esky.`, `x is tuckshop.`)
* ✅ Variables in collection literals
* ✅ New tossin append syntax (replaces another shrimp)

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
