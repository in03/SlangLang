@{%
const createLexer = require("./lexer");
const lexer = createLexer();

// Helper to join multi-word identifiers
function joinIdent(parts) {
  return parts.filter(p => p).join("_");
}
%}

@lexer lexer

program -> topstatements {% id %}

# Top-level statements can be separated by newlines or terminated by periods
# Period acts like JavaScript semicolon - optional with indentation/newlines, required otherwise
stmtend -> %NL {% id %}
        | %DOT {% id %}
        | %DOT %NL {% id %}

leadingnl -> null {% d => null %}
          | leadingnl %NL {% d => null %}

topstatements -> leadingnl statement {% d => [d[1]] %}
              | topstatements stmtend statement {% d => [...d[0], d[2]] %}
              | topstatements stmtend {% d => d[0] %}

statement -> printstmt {% id %}
           | funcdef {% id %}
           | returnstmt {% id %}
           | assignment {% id %}
           | funccall {% id %}
           | eskydef {% id %}
           | tuckshopdef {% id %}
           | appendstmt {% id %}
           | removestmt {% id %}
           | popstmt {% id %}
           | scoffinloop {% id %}
           | dealinloop {% id %}
           | parcelloop {% id %}
           | everyloop {% id %}
           | tilloop {% id %}
           | ifstmt {% id %}
           | importstmt {% id %}
           | buggerstmt {% id %}
           | sussstmt {% id %}
           | gimmestmt {% id %}
           | reassignment {% id %}
           | topupstmt {% id %}

# ============ MULTI-WORD IDENTIFIERS ============
# Accumulates one or more IDENT/keyword tokens into a single name
# e.g., "the tasty tucker" -> "the_tasty_tucker"
# We allow certain keywords to be used as identifiers in multi-word contexts
identword -> %IDENT {% d => d[0].value %}
          | %KW_THE {% d => "the" %}
          | %KW_SNAG {% d => "snag" %}
          | %KW_FULL {% d => "full" %}
          | %KW_GOT {% d => "got" %}
          | %KW_LAST {% d => "last" %}
          | %KW_FIRST {% d => "first" %}
          | %KW_LOT {% d => "lot" %}
          | %KW_SHRIMP {% d => "shrimp" %}

multiident -> identword {% d => [d[0]] %}
           | multiident identword {% d => [...d[0], d[1]] %}

# ============ PRINT ============
# crikey! <expr> - print statement (! required after crikey)
printstmt -> %KW_CRIKEY %BANG expr {% 
  d => ({ type: "Print", expr: d[2] }) 
%}

# ============ FUNCTIONS ============
# Legacy: prep greet barbie
funcdef -> %KW_PREP %IDENT %KW_BARBIE block {% 
  d => ({ type: "Function", name: d[1].value, params: [], body: d[3] }) 
%}

# Legacy: prep greet barbie with name (and other name)
funcdef -> %KW_PREP %IDENT %KW_BARBIE %KW_WITH paramlist block {% 
  d => ({ type: "Function", name: d[1].value, params: d[4], body: d[5] }) 
%}

# New: greet on the barbie:
funcdef -> identword %KW_ON %KW_THE %KW_BARBIE %COLON block offbarbie:? {% 
  d => ({ type: "Function", name: d[0], params: [], body: d[5] }) 
%}

# New: greet on the barbie with a, b:
funcdef -> identword %KW_ON %KW_THE %KW_BARBIE %KW_WITH commalist %COLON block offbarbie:? {% 
  d => ({ type: "Function", name: d[0], params: d[5], body: d[7] }) 
%}

# New: greet on the barbie with a and b:
funcdef -> identword %KW_ON %KW_THE %KW_BARBIE %KW_WITH paramlist %COLON block offbarbie:? {% 
  d => ({ type: "Function", name: d[0], params: d[5], body: d[7] }) 
%}

offbarbie -> %KW_FAIR %KW_GO %DOT {% d => null %}

commalist -> multiident {% d => [joinIdent(d[0])] %}
          | commalist %COMMA multiident {% d => [...d[0], joinIdent(d[2])] %}

# Multi-word params with 'and' separator
paramlist -> multiident {% d => [joinIdent(d[0])] %}
          | paramlist %KW_AND multiident {% d => [...d[0], joinIdent(d[2])] %}

# ============ RETURN ============
# serve <expr>
returnstmt -> %KW_SERVE expr {% 
  d => ({ type: "Return", value: d[1] }) 
%}

# ============ EXPRESSIONS ============
expr -> compareexpr {% id %}

compareexpr -> addexpr {% id %}
            | addexpr %KW_TOPS addexpr {% d => ({ type: "BinOp", op: ">", left: d[0], right: d[2] }) %}
            | addexpr %KW_COPS addexpr {% d => ({ type: "BinOp", op: "<", left: d[0], right: d[2] }) %}
            | addexpr %KW_EQUALS addexpr {% d => ({ type: "BinOp", op: "===", left: d[0], right: d[2] }) %}
            | addexpr %KW_NOT %KW_EQUALS addexpr {% d => ({ type: "BinOp", op: "!==", left: d[0], right: d[3] }) %}
            | addexpr %KW_ISNT addexpr {% d => ({ type: "BinOp", op: "!==", left: d[0], right: d[2] }) %}
            | addexpr %KW_IS %KW_NOT addexpr {% d => ({ type: "BinOp", op: "!==", left: d[0], right: d[3] }) %}
            | addexpr %KW_IS addexpr {% d => ({ type: "BinOp", op: "===", left: d[0], right: d[2] }) %}

addexpr -> mulexpr {% id %}
        | addexpr %KW_PLUS mulexpr {% d => ({ type: "BinOp", op: "+", left: d[0], right: d[2] }) %}
        | addexpr %KW_MINUS mulexpr {% d => ({ type: "BinOp", op: "-", left: d[0], right: d[2] }) %}
        | addexpr %KW_FRIGGEN mulexpr {% d => ({ type: "Concat", left: d[0], right: d[2] }) %}

mulexpr -> unaryexpr {% id %}
        | mulexpr %KW_TIMES unaryexpr {% d => ({ type: "BinOp", op: "*", left: d[0], right: d[2] }) %}
        | mulexpr %KW_DIVIDEDBY unaryexpr {% d => ({ type: "BinOp", op: "/", left: d[0], right: d[2] }) %}

unaryexpr -> chainexpr {% id %}
          | %KW_NOT unaryexpr {% d => ({ type: "UnaryOp", op: "!", expr: d[1] }) %}

# Method chaining: x then foo -> x.foo()
chainexpr -> primary {% id %}
          | chainexpr %KW_THEN multiident {% d => ({ type: "MethodCall", target: d[0], method: joinIdent(d[2]), args: [] }) %}
          | chainexpr %KW_THEN multiident %KW_WITH chainargs {% d => ({ type: "MethodCall", target: d[0], method: joinIdent(d[2]), args: d[4] }) %}

chainargs -> addexpr {% d => [d[0]] %}
          | chainargs %COMMA addexpr {% d => [...d[0], d[2]] %}

primary -> %BOOL {% d => ({ type:"Bool", value: d[0].value === "yeah" }) %}
     | %NULL {% d => ({ type:"Null", value: null }) %}
     | %STRING {% d => ({ type:"String", value: JSON.parse(d[0].value) }) %}
     | %NUMBER {% d => ({ type:"Number", value: parseFloat(d[0].value) }) %}
     | %IDENT {% d => ({ type:"Ident", name: d[0].value }) %}
     | keywordAsIdent {% id %}
     | slangstring {% id %}
     | flaminexpr {% id %}
     | frothinexpr {% id %}
     | spewinexpr {% id %}
     | grabexpr {% id %}
     | funccallexpr {% id %}
     | eskyexpr {% id %}
     | tuckshopexpr {% id %}
     | emptyexpr {% id %}
     | sliceexpr {% id %}

# Allow certain keywords to be used as standalone identifiers in expressions
keywordAsIdent -> %KW_SNAG {% d => ({ type:"Ident", name: "snag" }) %}
              | %KW_FULL {% d => ({ type:"Ident", name: "full" }) %}
              | %KW_GOT {% d => ({ type:"Ident", name: "got" }) %}
              | %KW_LAST {% d => ({ type:"Ident", name: "last" }) %}
              | %KW_FIRST {% d => ({ type:"Ident", name: "first" }) %}
              | %KW_LOT {% d => ({ type:"Ident", name: "lot" }) %}

# ============ STRING LITERALS ============
# bloody...mate string literal (lexer handles the parsing)
slangstring -> %SLANG_STRING {% 
  d => ({ type: "String", value: d[0].value }) 
%}

# ============ NUMERIC LITERALS ============
# flamin <word> = length of word as integer
flaminexpr -> %KW_FLAMIN %IDENT {% 
  d => ({ type: "Number", value: d[1].value.length }) 
%}

# flamin <number> = just the number (for explicit int casting)
flaminexpr -> %KW_FLAMIN %NUMBER {% 
  d => ({ type: "Number", value: parseInt(d[1].value) }) 
%}

# frothin <number> = explicit float
frothinexpr -> %KW_FROTHIN %NUMBER {% 
  d => ({ type: "Number", value: parseFloat(d[1].value) }) 
%}

# spewin <word> = length as float
spewinexpr -> %KW_SPEWIN %IDENT {% 
  d => ({ type: "Number", value: d[1].value.length }) 
%}

# spewin <number> = explicit float (alias for frothin)
spewinexpr -> %KW_SPEWIN %NUMBER {% 
  d => ({ type: "Number", value: parseFloat(d[1].value) }) 
%}

# ============ EMPTY ============
emptyexpr -> %KW_EMPTY {% d => ({ type: "Empty" }) %}

# ============ ASSIGNMENT ============
# name is <expr> (single-word identifier for simplicity in expressions)
assignment -> %IDENT %KW_IS expr {% 
  d => ({ type: "Assign", name: d[0].value, value: d[2] }) 
%}

# Reassignment (for existing variables, e.g., "goodies is empty")
reassignment -> %IDENT %KW_IS %KW_EMPTY {% 
  d => ({ type: "Reassign", name: d[0].value, value: { type: "Empty" } }) 
%}

# ============ FUNCTION CALLS ============
# Function call as statement (bare identifier)
funccall -> %IDENT {% 
  d => ({ type: "Call", name: d[0].value, args: [] }) 
%}

# Function call with args: howbout funcname with arg1 and arg2
funccall -> %KW_HOWBOUT identword %KW_WITH arglist {% 
  d => ({ type: "Call", name: d[1], args: d[3] }) 
%}

# Function call as expression
funccallexpr -> %KW_HOWBOUT identword %KW_WITH arglist {% 
  d => ({ type: "Call", name: d[1], args: d[3] }) 
%}

arglist -> expr {% d => [d[0]] %}
        | arglist %KW_AND expr {% d => [...d[0], d[2]] %}
        | arglist %COMMA expr {% d => [...d[0], d[2]] %}

# ============ ESKY (LIST) ============
# goodies is esky: bloody beer, bloody chips.
# goodies is esky. (empty)
eskydef -> %IDENT %KW_IS %KW_ESKY %COLON eskyitems %DOT {%
  d => ({ type: "List", name: d[0].value, items: d[4] })
%}
         | %IDENT %KW_IS %KW_ESKY %DOT {%
  d => ({ type: "List", name: d[0].value, items: [] })
%}

eskyitems -> eskyitem {% d => [d[0]] %}
          | eskyitems %COMMA eskyitem {% d => [...d[0], d[2]] %}

eskyitem -> expr {% d => d[0] %}
         | %BLOODY_ITEM {% d => d[0].value %}
         | %NUMBER {% d => parseFloat(d[0].value) %}
         | %STRING {% d => JSON.parse(d[0].value) %}

# Inline esky expression: esky: item1, item2
eskyexpr -> %KW_ESKY %COLON eskyitems {% 
  d => ({ type: "ListExpr", items: d[2] }) 
%}

# ============ TUCKSHOP (DICTIONARY) ============
# menu is tuckshop: pies is 5, sauce is "tomato".
# menu is tuckshop. (empty)
tuckshopdef -> %IDENT %KW_IS %KW_TUCKSHOP %COLON tuckshopitems %DOT {%
  d => ({ type: "Dict", name: d[0].value, entries: d[4] })
%}
             | %IDENT %KW_IS %KW_TUCKSHOP %DOT {%
  d => ({ type: "Dict", name: d[0].value, entries: [] })
%}

tuckshopitems -> tuckshopitem {% d => [d[0]] %}
              | tuckshopitems %COMMA tuckshopitem {% d => [...d[0], d[2]] %}

tuckshopitem -> %IDENT %KW_IS expr {% d => [d[0].value, d[2]] %}

# Inline tuckshop expression
tuckshopexpr -> %KW_TUCKSHOP %COLON tuckshopitems {% 
  d => ({ type: "DictExpr", entries: d[2] }) 
%}

# ============ LIST OPERATIONS ============
# Another shrimp in goodies - bloody pavlova.
appendstmt -> %KW_ANOTHER %KW_SHRIMP %KW_IN %IDENT %DASH eskyitem %DOT {% 
  d => ({ type: "Append", target: d[3].value, item: d[5] }) 
%}

# goodies top up <expr>
topupstmt -> %IDENT %KW_TOP %KW_UP expr {% 
  d => ({ type: "Append", target: d[0].value, item: d[3] }) 
%}

# Ditch bloody chips from goodies.
removestmt -> %KW_DITCH %BLOODY_ITEM %KW_FROM %IDENT %DOT {% 
  d => ({ type: "Remove", target: d[3].value, item: d[1].value }) 
%}

# drop the last snag from goodies.
popstmt -> %KW_DROP %KW_THE %KW_LAST %KW_SNAG %KW_FROM %IDENT %DOT {% 
  d => ({ type: "Pop", target: d[5].value, position: "last" }) 
%}

# drop the first snag from goodies.
popstmt -> %KW_DROP %KW_THE %KW_FIRST %KW_SNAG %KW_FROM %IDENT %DOT {% 
  d => ({ type: "Pop", target: d[5].value, position: "first" }) 
%}

# ============ GRAB (INDEX/KEY ACCESS) ============
# grab 0 from goodies
grabexpr -> %KW_GRAB expr %KW_FROM %IDENT {% 
  d => ({ type: "Index", target: d[3].value, index: d[1] }) 
%}

# grab sauce from tuckshop
grabexpr -> %KW_GRAB %IDENT %KW_FROM %IDENT {% 
  d => ({ type: "Index", target: d[3].value, index: { type: "String", value: d[1].value } }) 
%}

# grab <key> from <dict> at <key> (nested access placeholder)
grabexpr -> %KW_GRAB %IDENT %KW_AT %IDENT {% 
  d => ({ type: "Index", target: d[1].value, index: { type: "String", value: d[3].value } }) 
%}

# ============ SLICE (SHEEPSHEAR) ============
# sheepshear goodies from flamin start to flamin end
sliceexpr -> %KW_SHEEPSHEAR %IDENT %KW_FROM expr %KW_IN expr {% 
  d => ({ type: "Slice", target: d[1].value, start: d[3], end: d[5] }) 
%}

# sheepshear list at index (single element)
sliceexpr -> %IDENT %KW_SHEEPSHEAR expr {% 
  d => ({ type: "Index", target: d[0].value, index: d[2] }) 
%}

# ============ LOOPS ============
# scoffin <multi-word var> from <list>! ... who's full?
# e.g., scoffin the tucker from sangas!
# e.g., scoffin the tasty tucker from sangas!
scoffinloop -> %KW_SCOFFIN multiident %KW_FROM %IDENT %BANG block loopend:? {% 
  d => ({ type: "ForEach", iterator: joinIdent(d[1]), target: d[3].value, body: d[5] }) 
%}

# dealin from menu! ... who's full?
# Use "item" and "price" as special variable names inside loop
dealinloop -> %KW_DEALIN %KW_FROM %IDENT %BANG block loopend {% 
  d => ({ type: "ForEachDict", target: d[2].value, keyVar: "item", valVar: "price", body: d[4] }) 
%}

# pass the <multi-word var>, <count>! ... who's got it?
# e.g., pass the parcel, flamin 8!
# e.g., pass the hot potato, flamin 5!
parcelloop -> %KW_PASS %KW_THE multiident %COMMA expr %BANG block loopend {% 
  d => ({ type: "ForRange", iterator: joinIdent(d[2]), count: d[4], body: d[6] }) 
%}

# every <multi-word var> in flamin 10:
everyloop -> %KW_EVERY multiident %KW_IN expr %COLON block {% 
  d => ({ type: "ForRange", iterator: joinIdent(d[1]), count: d[3], body: d[5] }) 
%}

# til bag is empty. ... fully sick.
tilloop -> %KW_TIL expr %DOT block fullysickend {% 
  d => ({ type: "WhileNot", condition: d[1], body: d[3] }) 
%}

loopend -> %KW_WHOS %KW_FULL %QUESTION {% d => null %}
        | %KW_WHOS %KW_GOT %IDENT %QUESTION {% d => null %}

fullysickend -> %KW_FULLY %KW_SICK %DOT {% d => null %}

# ============ CONDITIONALS ============
# if <condition>, ... otherwise, ... make tracks.
ifstmt -> %KW_IF expr %COMMA block elifclauses elseclause maketrackend:? {% 
  d => ({ type: "If", condition: d[1], body: d[3], elifs: d[4], else: d[5] }) 
%}

# Simple if without elif/else
ifstmt -> %KW_IF expr %COMMA block maketrackend:? {% 
  d => ({ type: "If", condition: d[1], body: d[3], elifs: [], else: null }) 
%}

elifclauses -> null {% d => [] %}
            | elifclauses elifclause {% d => [...d[0], d[1]] %}

elifclause -> %KW_OR %KW_IF expr %COMMA block {% 
  d => ({ condition: d[2], body: d[4] }) 
%}

elseclause -> null {% d => null %}
           | %KW_OTHERWISE %COMMA block {% d => d[2] %}

maketrackend -> %KW_MAKE %KW_TRACKS %DOT {% d => null %}

# ============ IMPORTS ============
# chuck in sqrt from math.
importstmt -> %KW_CHUCK %KW_IN %IDENT %KW_FROM %IDENT %DOT {% 
  d => ({ type: "Import", name: d[2].value, from: d[4].value, alias: null }) 
%}

# chuck in the lot from time.
importstmt -> %KW_CHUCK %KW_IN %KW_THE %KW_LOT %KW_FROM %IDENT %DOT {% 
  d => ({ type: "ImportAll", from: d[5].value }) 
%}

# chuck in numpy - mates call it numbers.
importstmt -> %KW_CHUCK %KW_IN %IDENT %DASH %KW_MATES %KW_CALL %IDENT %IDENT %DOT {% 
  d => ({ type: "ImportModule", name: d[2].value, alias: d[7].value }) 
%}

# ============ EXCEPTIONS ============
# bugger - message
buggerstmt -> %KW_BUGGER %DASH expr {% 
  d => ({ type: "Throw", message: d[2] }) 
%}

# suss if <condition>: ... bugger - message
sussstmt -> %KW_SUSS %KW_IF expr %COLON block {% 
  d => ({ type: "Assert", condition: d[2], body: d[4] }) 
%}

# suss if <condition>. (inline, throws generic error)
sussstmt -> %KW_SUSS %KW_IF expr %DOT {% 
  d => ({ type: "AssertInline", condition: d[2] }) 
%}

# ============ IO ============
# Gimme <multi-word var>.
gimmestmt -> %KW_GIMME multiident %DOT {% 
  d => ({ type: "Input", variable: joinIdent(d[1]) }) 
%}

# ============ BLOCKS ============
block -> %INDENT statements %DEDENT {% d => d[1] %}

statements -> statement {% d => [d[0]] %}
           | statements stmtend statement {% d => [...d[0], d[2]] %}
           | statements stmtend {% d => d[0] %}
