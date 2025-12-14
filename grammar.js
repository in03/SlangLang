// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const createLexer = require("./lexer");
const lexer = createLexer();
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["topstatements"], "postprocess": id},
    {"name": "topstatements", "symbols": ["statement"], "postprocess": d => [d[0]]},
    {"name": "topstatements", "symbols": ["topstatements", (lexer.has("NL") ? {type: "NL"} : NL), "statement"], "postprocess": d => [...d[0], d[2]]},
    {"name": "topstatements", "symbols": ["topstatements", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["printstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["funcdef"], "postprocess": id},
    {"name": "statement", "symbols": ["returnstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["assignment"], "postprocess": id},
    {"name": "statement", "symbols": ["funccall"], "postprocess": id},
    {"name": "printstmt", "symbols": [(lexer.has("KW_CRIKEY") ? {type: "KW_CRIKEY"} : KW_CRIKEY), (lexer.has("DASH") ? {type: "DASH"} : DASH), "expr"], "postprocess":  
        d => ({ type: "Print", expr: d[2] }) 
        },
    {"name": "funcdef", "symbols": [(lexer.has("KW_PREP") ? {type: "KW_PREP"} : KW_PREP), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), "block"], "postprocess":  
        d => ({ type: "Function", name: d[1].value, body: d[3] }) 
        },
    {"name": "returnstmt", "symbols": [(lexer.has("KW_FAIR") ? {type: "KW_FAIR"} : KW_FAIR), (lexer.has("KW_GO") ? {type: "KW_GO"} : KW_GO), "expr"], "postprocess":  
        d => ({ type: "Return", value: d[2] }) 
        },
    {"name": "expr", "symbols": [(lexer.has("BOOL") ? {type: "BOOL"} : BOOL)], "postprocess": d => ({ type:"Bool", value: d[0].value === "yeah" })},
    {"name": "expr", "symbols": [(lexer.has("NULL") ? {type: "NULL"} : NULL)], "postprocess": d => ({ type:"Null", value: null })},
    {"name": "expr", "symbols": [(lexer.has("STRING") ? {type: "STRING"} : STRING)], "postprocess": d => ({ type:"String", value: JSON.parse(d[0].value) })},
    {"name": "expr", "symbols": [(lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess": d => ({ type:"Number", value: parseFloat(d[0].value) })},
    {"name": "expr", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess": d => ({ type:"Ident", name: d[0].value })},
    {"name": "expr", "symbols": ["slangstring"], "postprocess": id},
    {"name": "expr", "symbols": ["flaminexpr"], "postprocess": id},
    {"name": "expr", "symbols": ["frothinexpr"], "postprocess": id},
    {"name": "slangstring", "symbols": [(lexer.has("KW_BLOODY") ? {type: "KW_BLOODY"} : KW_BLOODY), (lexer.has("SLANG_STRING_CONTENT") ? {type: "SLANG_STRING_CONTENT"} : SLANG_STRING_CONTENT), (lexer.has("KW_MATE") ? {type: "KW_MATE"} : KW_MATE)], "postprocess":  
        d => ({ type: "String", value: d[1].value.trim() }) 
        },
    {"name": "flaminexpr", "symbols": [(lexer.has("KW_FLAMIN") ? {type: "KW_FLAMIN"} : KW_FLAMIN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Number", value: d[1].value.length }) 
        },
    {"name": "frothinexpr", "symbols": [(lexer.has("KW_FROTHIN") ? {type: "KW_FROTHIN"} : KW_FROTHIN), (lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess":  
        d => ({ type: "Number", value: parseFloat(d[1].value) }) 
        },
    {"name": "assignment", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), "expr"], "postprocess":  
        d => ({ type: "Assign", name: d[0].value, value: d[2] }) 
        },
    {"name": "funccall", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Call", name: d[0].value }) 
        },
    {"name": "block", "symbols": [(lexer.has("INDENT") ? {type: "INDENT"} : INDENT), "statements", (lexer.has("DEDENT") ? {type: "DEDENT"} : DEDENT)], "postprocess": d => d[1]},
    {"name": "statements", "symbols": ["statement"], "postprocess": d => [d[0]]},
    {"name": "statements", "symbols": ["statements", (lexer.has("NL") ? {type: "NL"} : NL), "statement"], "postprocess": d => [...d[0], d[2]]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
