@{%
const createLexer = require("./lexer");
const lexer = createLexer();
%}

@lexer lexer

program -> topstatements {% id %}

# Top-level statements can be separated by newlines
topstatements -> statement {% d => [d[0]] %}
              | topstatements %NL statement {% d => [...d[0], d[2]] %}
              | topstatements %NL {% d => d[0] %}

statement -> printstmt {% id %}
           | funcdef {% id %}
           | returnstmt {% id %}
           | assignment {% id %}
           | funccall {% id %}

printstmt -> %KW_CRIKEY %DASH expr {% 
  d => ({ type: "Print", expr: d[2] }) 
%}

funcdef -> %KW_PREP %IDENT %KW_BARBIE block {% 
  d => ({ type: "Function", name: d[1].value, body: d[3] }) 
%}

returnstmt -> %KW_FAIR %KW_GO expr {% 
  d => ({ type: "Return", value: d[2] }) 
%}

expr -> %BOOL {% d => ({ type:"Bool", value: d[0].value === "yeah" }) %}
     | %NULL {% d => ({ type:"Null", value: null }) %}
     | %STRING {% d => ({ type:"String", value: JSON.parse(d[0].value) }) %}
     | %NUMBER {% d => ({ type:"Number", value: parseFloat(d[0].value) }) %}
     | %IDENT {% d => ({ type:"Ident", name: d[0].value }) %}
     | slangstring {% id %}
     | flaminexpr {% id %}
     | frothinexpr {% id %}

# bloody...mate string literal
slangstring -> %KW_BLOODY %SLANG_STRING_CONTENT %KW_MATE {% 
  d => ({ type: "String", value: d[1].value.trim() }) 
%}

# flamin <word> = length of word as integer
flaminexpr -> %KW_FLAMIN %IDENT {% 
  d => ({ type: "Number", value: d[1].value.length }) 
%}

# frothin <number> = explicit float
frothinexpr -> %KW_FROTHIN %NUMBER {% 
  d => ({ type: "Number", value: parseFloat(d[1].value) }) 
%}

# Assignment: name is <expr>
assignment -> %IDENT %KW_IS expr {% 
  d => ({ type: "Assign", name: d[0].value, value: d[2] }) 
%}

# Function call (bare identifier as statement)
funccall -> %IDENT {% 
  d => ({ type: "Call", name: d[0].value }) 
%}

block -> %INDENT statements %DEDENT {% d => d[1] %}

statements -> statement {% d => [d[0]] %}
           | statements %NL statement {% d => [...d[0], d[2]] %}
