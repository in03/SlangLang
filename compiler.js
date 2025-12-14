const nearley = require("nearley");
const grammar = require("./grammar.js");

function genExpr(expr) {
  switch (expr.type) {
    case "Bool": return expr.value ? "true" : "false";
    case "Null": return "null";
    case "String": return JSON.stringify(expr.value);
    case "Number": return String(expr.value);
    case "Ident": return expr.name;
    default:
      throw new Error("Unknown expr: " + JSON.stringify(expr));
  }
}

function compile(ast) {
  return ast.map(node => {
    switch (node.type) {
      case "Print":
        return `console.log(${genExpr(node.expr)});`;
      case "Function":
        const body = compile(node.body).join("\n");
        return `function ${node.name}() {\n${body}\n}`;
      case "Return":
        return `return ${genExpr(node.value)};`;
      case "Dict":
        const dictBody = node.entries.map(([k, v]) =>
          `${JSON.stringify(k)}:${genExpr(v)}`
        ).join(",");
        return `const ${node.name} = {${dictBody}};`;
      case "List":
        const listBody = node.items.map(i => JSON.stringify(i)).join(",");
        return `const ${node.name} = [${listBody}];`;
      case "Assign":
        return `let ${node.name} = ${genExpr(node.value)};`;
      case "Call":
        return `${node.name}();`;
      default:
        throw new Error("Unknown node: " + JSON.stringify(node));
    }
  });
}

function transpile(source) {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar)
  );
  parser.feed(source);
  const ast = parser.results[0];
  return compile(ast).join("\n");
}

module.exports = transpile;
