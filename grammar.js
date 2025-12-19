// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const createLexer = require("./lexer");
const lexer = createLexer();

// Helper to join multi-word identifiers
function joinIdent(parts) {
  return parts.filter(p => p).join("_");
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "program", "symbols": ["topstatements"], "postprocess": id},
    {"name": "stmtend", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "stmtend", "symbols": [(lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess": id},
    {"name": "stmtend", "symbols": [(lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "leadingnl", "symbols": [], "postprocess": d => null},
    {"name": "leadingnl", "symbols": ["leadingnl", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": d => null},
    {"name": "topstatements", "symbols": ["leadingnl", "statement"], "postprocess": d => [d[1]]},
    {"name": "topstatements", "symbols": ["topstatements", "stmtend", "statement"], "postprocess": d => [...d[0], d[2]]},
    {"name": "topstatements", "symbols": ["topstatements", "stmtend"], "postprocess": d => d[0]},
    {"name": "statement", "symbols": ["printstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["funcdef"], "postprocess": id},
    {"name": "statement", "symbols": ["returnstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["assignment"], "postprocess": id},
    {"name": "statement", "symbols": ["funccall"], "postprocess": id},
    {"name": "statement", "symbols": ["eskydef"], "postprocess": id},
    {"name": "statement", "symbols": ["tuckshopdef"], "postprocess": id},
    {"name": "statement", "symbols": ["appendstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["removestmt"], "postprocess": id},
    {"name": "statement", "symbols": ["popstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["scoffinloop"], "postprocess": id},
    {"name": "statement", "symbols": ["dealinloop"], "postprocess": id},
    {"name": "statement", "symbols": ["parcelloop"], "postprocess": id},
    {"name": "statement", "symbols": ["everyloop"], "postprocess": id},
    {"name": "statement", "symbols": ["tilloop"], "postprocess": id},
    {"name": "statement", "symbols": ["ifstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["importstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["buggerstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["sussstmt"], "postprocess": id},
    {"name": "statement", "symbols": ["gimmestmt"], "postprocess": id},
    {"name": "statement", "symbols": ["reassignment"], "postprocess": id},
    {"name": "statement", "symbols": ["topupstmt"], "postprocess": id},
    {"name": "identword", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess": d => d[0].value},
    {"name": "identword", "symbols": [(lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE)], "postprocess": d => "the"},
    {"name": "identword", "symbols": [(lexer.has("KW_SNAG") ? {type: "KW_SNAG"} : KW_SNAG)], "postprocess": d => "snag"},
    {"name": "identword", "symbols": [(lexer.has("KW_FULL") ? {type: "KW_FULL"} : KW_FULL)], "postprocess": d => "full"},
    {"name": "identword", "symbols": [(lexer.has("KW_GOT") ? {type: "KW_GOT"} : KW_GOT)], "postprocess": d => "got"},
    {"name": "identword", "symbols": [(lexer.has("KW_LAST") ? {type: "KW_LAST"} : KW_LAST)], "postprocess": d => "last"},
    {"name": "identword", "symbols": [(lexer.has("KW_FIRST") ? {type: "KW_FIRST"} : KW_FIRST)], "postprocess": d => "first"},
    {"name": "identword", "symbols": [(lexer.has("KW_LOT") ? {type: "KW_LOT"} : KW_LOT)], "postprocess": d => "lot"},
    {"name": "multiident", "symbols": ["identword"], "postprocess": d => [d[0]]},
    {"name": "multiident", "symbols": ["multiident", "identword"], "postprocess": d => [...d[0], d[1]]},
    {"name": "printstmt", "symbols": [(lexer.has("KW_CRIKEY") ? {type: "KW_CRIKEY"} : KW_CRIKEY), (lexer.has("BANG") ? {type: "BANG"} : BANG), "expr"], "postprocess":  
        d => ({ type: "Print", expr: d[2] }) 
        },
    {"name": "funcdef", "symbols": [(lexer.has("KW_PREP") ? {type: "KW_PREP"} : KW_PREP), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), "block"], "postprocess":  
        d => ({ type: "Function", name: d[1].value, params: [], body: d[3] }) 
        },
    {"name": "funcdef", "symbols": [(lexer.has("KW_PREP") ? {type: "KW_PREP"} : KW_PREP), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), (lexer.has("KW_WITH") ? {type: "KW_WITH"} : KW_WITH), "paramlist", "block"], "postprocess":  
        d => ({ type: "Function", name: d[1].value, params: d[4], body: d[5] }) 
        },
    {"name": "funcdef$ebnf$1", "symbols": ["offbarbie"], "postprocess": id},
    {"name": "funcdef$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "funcdef", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_ON") ? {type: "KW_ON"} : KW_ON), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "funcdef$ebnf$1"], "postprocess":  
        d => ({ type: "Function", name: d[0].value, params: [], body: d[5] }) 
        },
    {"name": "funcdef$ebnf$2", "symbols": ["offbarbie"], "postprocess": id},
    {"name": "funcdef$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "funcdef", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_ON") ? {type: "KW_ON"} : KW_ON), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), (lexer.has("KW_WITH") ? {type: "KW_WITH"} : KW_WITH), "commalist", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "funcdef$ebnf$2"], "postprocess":  
        d => ({ type: "Function", name: d[0].value, params: d[5], body: d[7] }) 
        },
    {"name": "funcdef$ebnf$3", "symbols": ["offbarbie"], "postprocess": id},
    {"name": "funcdef$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "funcdef", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_ON") ? {type: "KW_ON"} : KW_ON), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), (lexer.has("KW_WITH") ? {type: "KW_WITH"} : KW_WITH), "paramlist", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block", "funcdef$ebnf$3"], "postprocess":  
        d => ({ type: "Function", name: d[0].value, params: d[5], body: d[7] }) 
        },
    {"name": "offbarbie", "symbols": [(lexer.has("KW_OFF") ? {type: "KW_OFF"} : KW_OFF), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_BARBIE") ? {type: "KW_BARBIE"} : KW_BARBIE), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess": d => null},
    {"name": "commalist", "symbols": ["multiident"], "postprocess": d => [joinIdent(d[0])]},
    {"name": "commalist", "symbols": ["commalist", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "multiident"], "postprocess": d => [...d[0], joinIdent(d[2])]},
    {"name": "paramlist", "symbols": ["multiident"], "postprocess": d => [joinIdent(d[0])]},
    {"name": "paramlist", "symbols": ["paramlist", (lexer.has("KW_AND") ? {type: "KW_AND"} : KW_AND), "multiident"], "postprocess": d => [...d[0], joinIdent(d[2])]},
    {"name": "returnstmt", "symbols": [(lexer.has("KW_FAIR") ? {type: "KW_FAIR"} : KW_FAIR), (lexer.has("KW_GO") ? {type: "KW_GO"} : KW_GO), "expr"], "postprocess":  
        d => ({ type: "Return", value: d[2] }) 
        },
    {"name": "returnstmt", "symbols": [(lexer.has("KW_DEAL") ? {type: "KW_DEAL"} : KW_DEAL), "expr"], "postprocess":  
        d => ({ type: "Return", value: d[1] }) 
        },
    {"name": "expr", "symbols": ["compareexpr"], "postprocess": id},
    {"name": "compareexpr", "symbols": ["addexpr"], "postprocess": id},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_TOPS") ? {type: "KW_TOPS"} : KW_TOPS), "addexpr"], "postprocess": d => ({ type: "BinOp", op: ">", left: d[0], right: d[2] })},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_COPS") ? {type: "KW_COPS"} : KW_COPS), "addexpr"], "postprocess": d => ({ type: "BinOp", op: "<", left: d[0], right: d[2] })},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_EQUALS") ? {type: "KW_EQUALS"} : KW_EQUALS), "addexpr"], "postprocess": d => ({ type: "BinOp", op: "===", left: d[0], right: d[2] })},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_NOT") ? {type: "KW_NOT"} : KW_NOT), (lexer.has("KW_EQUALS") ? {type: "KW_EQUALS"} : KW_EQUALS), "addexpr"], "postprocess": d => ({ type: "BinOp", op: "!==", left: d[0], right: d[3] })},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_ISNT") ? {type: "KW_ISNT"} : KW_ISNT), "addexpr"], "postprocess": d => ({ type: "BinOp", op: "!==", left: d[0], right: d[2] })},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), (lexer.has("KW_NOT") ? {type: "KW_NOT"} : KW_NOT), "addexpr"], "postprocess": d => ({ type: "BinOp", op: "!==", left: d[0], right: d[3] })},
    {"name": "compareexpr", "symbols": ["addexpr", (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), "addexpr"], "postprocess": d => ({ type: "BinOp", op: "===", left: d[0], right: d[2] })},
    {"name": "addexpr", "symbols": ["mulexpr"], "postprocess": id},
    {"name": "addexpr", "symbols": ["addexpr", (lexer.has("KW_PLUS") ? {type: "KW_PLUS"} : KW_PLUS), "mulexpr"], "postprocess": d => ({ type: "BinOp", op: "+", left: d[0], right: d[2] })},
    {"name": "addexpr", "symbols": ["addexpr", (lexer.has("KW_MINUS") ? {type: "KW_MINUS"} : KW_MINUS), "mulexpr"], "postprocess": d => ({ type: "BinOp", op: "-", left: d[0], right: d[2] })},
    {"name": "mulexpr", "symbols": ["unaryexpr"], "postprocess": id},
    {"name": "mulexpr", "symbols": ["mulexpr", (lexer.has("KW_TIMES") ? {type: "KW_TIMES"} : KW_TIMES), "unaryexpr"], "postprocess": d => ({ type: "BinOp", op: "*", left: d[0], right: d[2] })},
    {"name": "mulexpr", "symbols": ["mulexpr", (lexer.has("KW_DIVIDEDBY") ? {type: "KW_DIVIDEDBY"} : KW_DIVIDEDBY), "unaryexpr"], "postprocess": d => ({ type: "BinOp", op: "/", left: d[0], right: d[2] })},
    {"name": "unaryexpr", "symbols": ["chainexpr"], "postprocess": id},
    {"name": "unaryexpr", "symbols": [(lexer.has("KW_NOT") ? {type: "KW_NOT"} : KW_NOT), "unaryexpr"], "postprocess": d => ({ type: "UnaryOp", op: "!", expr: d[1] })},
    {"name": "chainexpr", "symbols": ["primary"], "postprocess": id},
    {"name": "chainexpr", "symbols": ["chainexpr", (lexer.has("KW_THEN") ? {type: "KW_THEN"} : KW_THEN), "multiident"], "postprocess": d => ({ type: "MethodCall", target: d[0], method: joinIdent(d[2]), args: [] })},
    {"name": "chainexpr", "symbols": ["chainexpr", (lexer.has("KW_THEN") ? {type: "KW_THEN"} : KW_THEN), "multiident", (lexer.has("KW_WITH") ? {type: "KW_WITH"} : KW_WITH), "chainargs"], "postprocess": d => ({ type: "MethodCall", target: d[0], method: joinIdent(d[2]), args: d[4] })},
    {"name": "chainargs", "symbols": ["addexpr"], "postprocess": d => [d[0]]},
    {"name": "chainargs", "symbols": ["chainargs", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "addexpr"], "postprocess": d => [...d[0], d[2]]},
    {"name": "primary", "symbols": [(lexer.has("BOOL") ? {type: "BOOL"} : BOOL)], "postprocess": d => ({ type:"Bool", value: d[0].value === "yeah" })},
    {"name": "primary", "symbols": [(lexer.has("NULL") ? {type: "NULL"} : NULL)], "postprocess": d => ({ type:"Null", value: null })},
    {"name": "primary", "symbols": [(lexer.has("STRING") ? {type: "STRING"} : STRING)], "postprocess": d => ({ type:"String", value: JSON.parse(d[0].value) })},
    {"name": "primary", "symbols": [(lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess": d => ({ type:"Number", value: parseFloat(d[0].value) })},
    {"name": "primary", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess": d => ({ type:"Ident", name: d[0].value })},
    {"name": "primary", "symbols": ["keywordAsIdent"], "postprocess": id},
    {"name": "primary", "symbols": ["slangstring"], "postprocess": id},
    {"name": "primary", "symbols": ["flaminexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["frothinexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["spewinexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["grabexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["funccallexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["eskyexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["tuckshopexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["emptyexpr"], "postprocess": id},
    {"name": "primary", "symbols": ["sliceexpr"], "postprocess": id},
    {"name": "keywordAsIdent", "symbols": [(lexer.has("KW_SNAG") ? {type: "KW_SNAG"} : KW_SNAG)], "postprocess": d => ({ type:"Ident", name: "snag" })},
    {"name": "keywordAsIdent", "symbols": [(lexer.has("KW_FULL") ? {type: "KW_FULL"} : KW_FULL)], "postprocess": d => ({ type:"Ident", name: "full" })},
    {"name": "keywordAsIdent", "symbols": [(lexer.has("KW_GOT") ? {type: "KW_GOT"} : KW_GOT)], "postprocess": d => ({ type:"Ident", name: "got" })},
    {"name": "keywordAsIdent", "symbols": [(lexer.has("KW_LAST") ? {type: "KW_LAST"} : KW_LAST)], "postprocess": d => ({ type:"Ident", name: "last" })},
    {"name": "keywordAsIdent", "symbols": [(lexer.has("KW_FIRST") ? {type: "KW_FIRST"} : KW_FIRST)], "postprocess": d => ({ type:"Ident", name: "first" })},
    {"name": "keywordAsIdent", "symbols": [(lexer.has("KW_LOT") ? {type: "KW_LOT"} : KW_LOT)], "postprocess": d => ({ type:"Ident", name: "lot" })},
    {"name": "slangstring", "symbols": [(lexer.has("SLANG_STRING") ? {type: "SLANG_STRING"} : SLANG_STRING)], "postprocess":  
        d => ({ type: "String", value: d[0].value }) 
        },
    {"name": "flaminexpr", "symbols": [(lexer.has("KW_FLAMIN") ? {type: "KW_FLAMIN"} : KW_FLAMIN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Number", value: d[1].value.length }) 
        },
    {"name": "flaminexpr", "symbols": [(lexer.has("KW_FLAMIN") ? {type: "KW_FLAMIN"} : KW_FLAMIN), (lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess":  
        d => ({ type: "Number", value: parseInt(d[1].value) }) 
        },
    {"name": "frothinexpr", "symbols": [(lexer.has("KW_FROTHIN") ? {type: "KW_FROTHIN"} : KW_FROTHIN), (lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess":  
        d => ({ type: "Number", value: parseFloat(d[1].value) }) 
        },
    {"name": "spewinexpr", "symbols": [(lexer.has("KW_SPEWIN") ? {type: "KW_SPEWIN"} : KW_SPEWIN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Number", value: d[1].value.length }) 
        },
    {"name": "spewinexpr", "symbols": [(lexer.has("KW_SPEWIN") ? {type: "KW_SPEWIN"} : KW_SPEWIN), (lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess":  
        d => ({ type: "Number", value: parseFloat(d[1].value) }) 
        },
    {"name": "emptyexpr", "symbols": [(lexer.has("KW_EMPTY") ? {type: "KW_EMPTY"} : KW_EMPTY)], "postprocess": d => ({ type: "Empty" })},
    {"name": "assignment", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), "expr"], "postprocess":  
        d => ({ type: "Assign", name: d[0].value, value: d[2] }) 
        },
    {"name": "reassignment", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), (lexer.has("KW_EMPTY") ? {type: "KW_EMPTY"} : KW_EMPTY)], "postprocess":  
        d => ({ type: "Reassign", name: d[0].value, value: { type: "Empty" } }) 
        },
    {"name": "funccall", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Call", name: d[0].value, args: [] }) 
        },
    {"name": "funccall", "symbols": [(lexer.has("KW_FLAMIN") ? {type: "KW_FLAMIN"} : KW_FLAMIN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_WITH") ? {type: "KW_WITH"} : KW_WITH), "arglist"], "postprocess":  
        d => ({ type: "Call", name: d[1].value, args: d[3] }) 
        },
    {"name": "funccallexpr", "symbols": [(lexer.has("KW_FLAMIN") ? {type: "KW_FLAMIN"} : KW_FLAMIN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_WITH") ? {type: "KW_WITH"} : KW_WITH), "arglist"], "postprocess":  
        d => ({ type: "Call", name: d[1].value, args: d[3] }) 
        },
    {"name": "arglist", "symbols": ["expr"], "postprocess": d => [d[0]]},
    {"name": "arglist", "symbols": ["arglist", (lexer.has("KW_AND") ? {type: "KW_AND"} : KW_AND), "expr"], "postprocess": d => [...d[0], d[2]]},
    {"name": "arglist", "symbols": ["arglist", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "expr"], "postprocess": d => [...d[0], d[2]]},
    {"name": "eskydef", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), (lexer.has("KW_ESKY") ? {type: "KW_ESKY"} : KW_ESKY), (lexer.has("COLON") ? {type: "COLON"} : COLON), "eskyitems", (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "List", name: d[0].value, items: d[4] }) 
        },
    {"name": "eskyitems", "symbols": ["eskyitem"], "postprocess": d => [d[0]]},
    {"name": "eskyitems", "symbols": ["eskyitems", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "eskyitem"], "postprocess": d => [...d[0], d[2]]},
    {"name": "eskyitem", "symbols": [(lexer.has("BLOODY_ITEM") ? {type: "BLOODY_ITEM"} : BLOODY_ITEM)], "postprocess": d => d[0].value},
    {"name": "eskyitem", "symbols": [(lexer.has("NUMBER") ? {type: "NUMBER"} : NUMBER)], "postprocess": d => parseFloat(d[0].value)},
    {"name": "eskyitem", "symbols": [(lexer.has("STRING") ? {type: "STRING"} : STRING)], "postprocess": d => JSON.parse(d[0].value)},
    {"name": "eskyexpr", "symbols": [(lexer.has("KW_ESKY") ? {type: "KW_ESKY"} : KW_ESKY), (lexer.has("COLON") ? {type: "COLON"} : COLON), "eskyitems"], "postprocess":  
        d => ({ type: "ListExpr", items: d[2] }) 
        },
    {"name": "tuckshopdef", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), (lexer.has("KW_TUCKSHOP") ? {type: "KW_TUCKSHOP"} : KW_TUCKSHOP), (lexer.has("COLON") ? {type: "COLON"} : COLON), "tuckshopitems", (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Dict", name: d[0].value, entries: d[4] }) 
        },
    {"name": "tuckshopitems", "symbols": ["tuckshopitem"], "postprocess": d => [d[0]]},
    {"name": "tuckshopitems", "symbols": ["tuckshopitems", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "tuckshopitem"], "postprocess": d => [...d[0], d[2]]},
    {"name": "tuckshopitem", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_IS") ? {type: "KW_IS"} : KW_IS), "expr"], "postprocess": d => [d[0].value, d[2]]},
    {"name": "tuckshopexpr", "symbols": [(lexer.has("KW_TUCKSHOP") ? {type: "KW_TUCKSHOP"} : KW_TUCKSHOP), (lexer.has("COLON") ? {type: "COLON"} : COLON), "tuckshopitems"], "postprocess":  
        d => ({ type: "DictExpr", entries: d[2] }) 
        },
    {"name": "appendstmt", "symbols": [(lexer.has("KW_ANOTHER") ? {type: "KW_ANOTHER"} : KW_ANOTHER), (lexer.has("KW_SHRIMP") ? {type: "KW_SHRIMP"} : KW_SHRIMP), (lexer.has("KW_IN") ? {type: "KW_IN"} : KW_IN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DASH") ? {type: "DASH"} : DASH), "eskyitem", (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Append", target: d[3].value, item: d[5] }) 
        },
    {"name": "topupstmt", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_TOP") ? {type: "KW_TOP"} : KW_TOP), (lexer.has("KW_UP") ? {type: "KW_UP"} : KW_UP), "expr"], "postprocess":  
        d => ({ type: "Append", target: d[0].value, item: d[3] }) 
        },
    {"name": "removestmt", "symbols": [(lexer.has("KW_DITCH") ? {type: "KW_DITCH"} : KW_DITCH), (lexer.has("BLOODY_ITEM") ? {type: "BLOODY_ITEM"} : BLOODY_ITEM), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Remove", target: d[3].value, item: d[1].value }) 
        },
    {"name": "popstmt", "symbols": [(lexer.has("KW_DROP") ? {type: "KW_DROP"} : KW_DROP), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_LAST") ? {type: "KW_LAST"} : KW_LAST), (lexer.has("KW_SNAG") ? {type: "KW_SNAG"} : KW_SNAG), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Pop", target: d[5].value, position: "last" }) 
        },
    {"name": "popstmt", "symbols": [(lexer.has("KW_DROP") ? {type: "KW_DROP"} : KW_DROP), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_FIRST") ? {type: "KW_FIRST"} : KW_FIRST), (lexer.has("KW_SNAG") ? {type: "KW_SNAG"} : KW_SNAG), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Pop", target: d[5].value, position: "first" }) 
        },
    {"name": "grabexpr", "symbols": [(lexer.has("KW_GRAB") ? {type: "KW_GRAB"} : KW_GRAB), "expr", (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Index", target: d[3].value, index: d[1] }) 
        },
    {"name": "grabexpr", "symbols": [(lexer.has("KW_GRAB") ? {type: "KW_GRAB"} : KW_GRAB), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Index", target: d[3].value, index: { type: "String", value: d[1].value } }) 
        },
    {"name": "grabexpr", "symbols": [(lexer.has("KW_GRAB") ? {type: "KW_GRAB"} : KW_GRAB), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_AT") ? {type: "KW_AT"} : KW_AT), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT)], "postprocess":  
        d => ({ type: "Index", target: d[1].value, index: { type: "String", value: d[3].value } }) 
        },
    {"name": "sliceexpr", "symbols": [(lexer.has("KW_SHEEPSHEAR") ? {type: "KW_SHEEPSHEAR"} : KW_SHEEPSHEAR), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), "expr", (lexer.has("KW_IN") ? {type: "KW_IN"} : KW_IN), "expr"], "postprocess":  
        d => ({ type: "Slice", target: d[1].value, start: d[3], end: d[5] }) 
        },
    {"name": "sliceexpr", "symbols": [(lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_SHEEPSHEAR") ? {type: "KW_SHEEPSHEAR"} : KW_SHEEPSHEAR), "expr"], "postprocess":  
        d => ({ type: "Index", target: d[0].value, index: d[2] }) 
        },
    {"name": "scoffinloop$ebnf$1", "symbols": ["loopend"], "postprocess": id},
    {"name": "scoffinloop$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "scoffinloop", "symbols": [(lexer.has("KW_SCOFFIN") ? {type: "KW_SCOFFIN"} : KW_SCOFFIN), "multiident", (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("BANG") ? {type: "BANG"} : BANG), "block", "scoffinloop$ebnf$1"], "postprocess":  
        d => ({ type: "ForEach", iterator: joinIdent(d[1]), target: d[3].value, body: d[5] }) 
        },
    {"name": "dealinloop", "symbols": [(lexer.has("KW_DEALIN") ? {type: "KW_DEALIN"} : KW_DEALIN), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("BANG") ? {type: "BANG"} : BANG), "block", "loopend"], "postprocess":  
        d => ({ type: "ForEachDict", target: d[2].value, keyVar: "item", valVar: "price", body: d[4] }) 
        },
    {"name": "parcelloop", "symbols": [(lexer.has("KW_PASS") ? {type: "KW_PASS"} : KW_PASS), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), "multiident", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "expr", (lexer.has("BANG") ? {type: "BANG"} : BANG), "block", "loopend"], "postprocess":  
        d => ({ type: "ForRange", iterator: joinIdent(d[2]), count: d[4], body: d[6] }) 
        },
    {"name": "everyloop", "symbols": [(lexer.has("KW_EVERY") ? {type: "KW_EVERY"} : KW_EVERY), "multiident", (lexer.has("KW_IN") ? {type: "KW_IN"} : KW_IN), "expr", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess":  
        d => ({ type: "ForRange", iterator: joinIdent(d[1]), count: d[3], body: d[5] }) 
        },
    {"name": "tilloop", "symbols": [(lexer.has("KW_TIL") ? {type: "KW_TIL"} : KW_TIL), "expr", (lexer.has("DOT") ? {type: "DOT"} : DOT), "block", "fullysickend"], "postprocess":  
        d => ({ type: "WhileNot", condition: d[1], body: d[3] }) 
        },
    {"name": "loopend", "symbols": [(lexer.has("KW_WHOS") ? {type: "KW_WHOS"} : KW_WHOS), (lexer.has("KW_FULL") ? {type: "KW_FULL"} : KW_FULL), (lexer.has("QUESTION") ? {type: "QUESTION"} : QUESTION)], "postprocess": d => null},
    {"name": "loopend", "symbols": [(lexer.has("KW_WHOS") ? {type: "KW_WHOS"} : KW_WHOS), (lexer.has("KW_GOT") ? {type: "KW_GOT"} : KW_GOT), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("QUESTION") ? {type: "QUESTION"} : QUESTION)], "postprocess": d => null},
    {"name": "fullysickend", "symbols": [(lexer.has("KW_FULLY") ? {type: "KW_FULLY"} : KW_FULLY), (lexer.has("KW_SICK") ? {type: "KW_SICK"} : KW_SICK), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess": d => null},
    {"name": "ifstmt$ebnf$1", "symbols": ["maketrackend"], "postprocess": id},
    {"name": "ifstmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ifstmt", "symbols": [(lexer.has("KW_IF") ? {type: "KW_IF"} : KW_IF), "expr", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "block", "elifclauses", "elseclause", "ifstmt$ebnf$1"], "postprocess":  
        d => ({ type: "If", condition: d[1], body: d[3], elifs: d[4], else: d[5] }) 
        },
    {"name": "ifstmt$ebnf$2", "symbols": ["maketrackend"], "postprocess": id},
    {"name": "ifstmt$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ifstmt", "symbols": [(lexer.has("KW_IF") ? {type: "KW_IF"} : KW_IF), "expr", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "block", "ifstmt$ebnf$2"], "postprocess":  
        d => ({ type: "If", condition: d[1], body: d[3], elifs: [], else: null }) 
        },
    {"name": "elifclauses", "symbols": [], "postprocess": d => []},
    {"name": "elifclauses", "symbols": ["elifclauses", "elifclause"], "postprocess": d => [...d[0], d[1]]},
    {"name": "elifclause", "symbols": [(lexer.has("KW_OR") ? {type: "KW_OR"} : KW_OR), (lexer.has("KW_IF") ? {type: "KW_IF"} : KW_IF), "expr", (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "block"], "postprocess":  
        d => ({ condition: d[2], body: d[4] }) 
        },
    {"name": "elseclause", "symbols": [], "postprocess": d => null},
    {"name": "elseclause", "symbols": [(lexer.has("KW_OTHERWISE") ? {type: "KW_OTHERWISE"} : KW_OTHERWISE), (lexer.has("COMMA") ? {type: "COMMA"} : COMMA), "block"], "postprocess": d => d[2]},
    {"name": "maketrackend", "symbols": [(lexer.has("KW_MAKE") ? {type: "KW_MAKE"} : KW_MAKE), (lexer.has("KW_TRACKS") ? {type: "KW_TRACKS"} : KW_TRACKS), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess": d => null},
    {"name": "importstmt", "symbols": [(lexer.has("KW_CHUCK") ? {type: "KW_CHUCK"} : KW_CHUCK), (lexer.has("KW_IN") ? {type: "KW_IN"} : KW_IN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Import", name: d[2].value, from: d[4].value, alias: null }) 
        },
    {"name": "importstmt", "symbols": [(lexer.has("KW_CHUCK") ? {type: "KW_CHUCK"} : KW_CHUCK), (lexer.has("KW_IN") ? {type: "KW_IN"} : KW_IN), (lexer.has("KW_THE") ? {type: "KW_THE"} : KW_THE), (lexer.has("KW_LOT") ? {type: "KW_LOT"} : KW_LOT), (lexer.has("KW_FROM") ? {type: "KW_FROM"} : KW_FROM), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "ImportAll", from: d[5].value }) 
        },
    {"name": "importstmt", "symbols": [(lexer.has("KW_CHUCK") ? {type: "KW_CHUCK"} : KW_CHUCK), (lexer.has("KW_IN") ? {type: "KW_IN"} : KW_IN), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DASH") ? {type: "DASH"} : DASH), (lexer.has("KW_MATES") ? {type: "KW_MATES"} : KW_MATES), (lexer.has("KW_CALL") ? {type: "KW_CALL"} : KW_CALL), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("IDENT") ? {type: "IDENT"} : IDENT), (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "ImportModule", name: d[2].value, alias: d[7].value }) 
        },
    {"name": "buggerstmt", "symbols": [(lexer.has("KW_BUGGER") ? {type: "KW_BUGGER"} : KW_BUGGER), (lexer.has("DASH") ? {type: "DASH"} : DASH), "expr"], "postprocess":  
        d => ({ type: "Throw", message: d[2] }) 
        },
    {"name": "sussstmt", "symbols": [(lexer.has("KW_SUSS") ? {type: "KW_SUSS"} : KW_SUSS), (lexer.has("KW_IF") ? {type: "KW_IF"} : KW_IF), "expr", (lexer.has("COLON") ? {type: "COLON"} : COLON), "block"], "postprocess":  
        d => ({ type: "Assert", condition: d[2], body: d[4] }) 
        },
    {"name": "sussstmt", "symbols": [(lexer.has("KW_SUSS") ? {type: "KW_SUSS"} : KW_SUSS), (lexer.has("KW_IF") ? {type: "KW_IF"} : KW_IF), "expr", (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "AssertInline", condition: d[2] }) 
        },
    {"name": "gimmestmt", "symbols": [(lexer.has("KW_GIMME") ? {type: "KW_GIMME"} : KW_GIMME), "multiident", (lexer.has("DOT") ? {type: "DOT"} : DOT)], "postprocess":  
        d => ({ type: "Input", variable: joinIdent(d[1]) }) 
        },
    {"name": "block", "symbols": [(lexer.has("INDENT") ? {type: "INDENT"} : INDENT), "statements", (lexer.has("DEDENT") ? {type: "DEDENT"} : DEDENT)], "postprocess": d => d[1]},
    {"name": "statements", "symbols": ["statement"], "postprocess": d => [d[0]]},
    {"name": "statements", "symbols": ["statements", "stmtend", "statement"], "postprocess": d => [...d[0], d[2]]},
    {"name": "statements", "symbols": ["statements", "stmtend"], "postprocess": d => d[0]}
]
  , ParserStart: "program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
