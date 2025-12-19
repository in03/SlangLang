const nearley = require("nearley");
const grammar = require("./grammar.js");

function genExpr(expr) {
  switch (expr.type) {
    case "Bool": 
      return expr.value ? "true" : "false";
    case "Null": 
      return "null";
    case "String": 
      return JSON.stringify(expr.value);
    case "Number": 
      return String(expr.value);
    case "Ident": 
      return expr.name;
    case "Empty":
      return "[]";
    case "BinOp":
      return `(${genExpr(expr.left)} ${expr.op} ${genExpr(expr.right)})`;
    case "Concat":
      // String concatenation with space: x and y -> x + " " + y
      return `(${genExpr(expr.left)} + " " + ${genExpr(expr.right)})`;
    case "MethodCall": {
      // Method chaining: x then foo -> x.foo()
      // Convert multi-word method name to camelCase
      const methodName = expr.method.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      const methodArgs = expr.args.map(genExpr).join(", ");
      return `${genExpr(expr.target)}.${methodName}(${methodArgs})`;
    }
    case "UnaryOp":
      return `(${expr.op}${genExpr(expr.expr)})`;
    case "Call":
      const args = expr.args.map(genExpr).join(", ");
      return `${expr.name}(${args})`;
    case "Index":
      const idx = expr.index.type === "String" 
        ? `[${JSON.stringify(expr.index.value)}]` 
        : `[${genExpr(expr.index)}]`;
      return `${expr.target}${idx}`;
    case "Slice":
      return `${expr.target}.slice(${genExpr(expr.start)}, ${genExpr(expr.end)})`;
    case "ListExpr":
      const items = expr.items.map(i => typeof i === "string" ? JSON.stringify(i) : i).join(", ");
      return `[${items}]`;
    case "DictExpr":
      const entries = expr.entries.map(([k, v]) => `${JSON.stringify(k)}: ${genExpr(v)}`).join(", ");
      return `{${entries}}`;
    default:
      throw new Error("Unknown expr: " + JSON.stringify(expr));
  }
}

function indent(code, spaces = 2) {
  return code.split("\n").map(line => " ".repeat(spaces) + line).join("\n");
}

function compile(ast, level = 0) {
  return ast.map(node => {
    switch (node.type) {
      case "Print":
        return `console.log(${genExpr(node.expr)});`;
      
      case "Function": {
        const params = node.params.join(", ");
        const body = compile(node.body).join("\n");
        return `function ${node.name}(${params}) {\n${indent(body)}\n}`;
      }
      
      case "Return":
        return `return ${genExpr(node.value)};`;
      
      case "Dict": {
        const dictBody = node.entries.map(([k, v]) =>
          `${JSON.stringify(k)}: ${genExpr(v)}`
        ).join(", ");
        return `let ${node.name} = {${dictBody}};`;
      }
      
      case "List": {
        const listBody = node.items.map(i => 
          typeof i === "string" ? JSON.stringify(i) : i
        ).join(", ");
        return `let ${node.name} = [${listBody}];`;
      }
      
      case "Assign":
        return `let ${node.name} = ${genExpr(node.value)};`;
      
      case "Reassign":
        return `${node.name} = ${genExpr(node.value)};`;
      
      case "Call": {
        const args = node.args.map(genExpr).join(", ");
        return `${node.name}(${args});`;
      }
      
      case "Append": {
        const item = typeof node.item === "string" 
          ? JSON.stringify(node.item) 
          : (typeof node.item === "object" ? genExpr(node.item) : node.item);
        return `${node.target}.push(${item});`;
      }
      
      case "Remove":
        return `${node.target}.splice(${node.target}.indexOf(${JSON.stringify(node.item)}), 1);`;
      
      case "Pop":
        return node.position === "first" 
          ? `${node.target}.shift();`
          : `${node.target}.pop();`;
      
      case "ForEach": {
        const body = compile(node.body).join("\n");
        return `for (const ${node.iterator} of ${node.target}) {\n${indent(body)}\n}`;
      }
      
      case "ForEachDict": {
        const body = compile(node.body).join("\n");
        const keyVar = node.keyVar || "item";
        const valVar = node.valVar || "price";
        return `for (const [${keyVar}, ${valVar}] of Object.entries(${node.target})) {\n${indent(body)}\n}`;
      }
      
      case "ForRange": {
        const body = compile(node.body).join("\n");
        return `for (let ${node.iterator} = 0; ${node.iterator} < ${genExpr(node.count)}; ${node.iterator}++) {\n${indent(body)}\n}`;
      }
      
      case "WhileNot": {
        const body = compile(node.body).join("\n");
        return `while (!(${genExpr(node.condition)})) {\n${indent(body)}\n}`;
      }
      
      case "If": {
        let code = `if (${genExpr(node.condition)}) {\n${indent(compile(node.body).join("\n"))}\n}`;
        for (const elif of node.elifs) {
          code += ` else if (${genExpr(elif.condition)}) {\n${indent(compile(elif.body).join("\n"))}\n}`;
        }
        if (node.else) {
          code += ` else {\n${indent(compile(node.else).join("\n"))}\n}`;
        }
        return code;
      }
      
      case "Import":
        // For Node/Bun: const { name } = require("from")
        return `const { ${node.name} } = require("${node.from}");`;
      
      case "ImportAll":
        return `const __${node.from}__ = require("${node.from}");`;
      
      case "ImportModule":
        return `const ${node.alias} = require("${node.name}");`;
      
      case "Throw":
        return `throw new Error(${genExpr(node.message)});`;
      
      case "Assert": {
        // suss if condition (inverted assertion - throws if condition is TRUE)
        const body = compile(node.body).join("\n");
        return `if (${genExpr(node.condition)}) {\n${indent(body)}\n}`;
      }
      
      case "AssertInline":
        // suss if condition. (throws if condition is TRUE)
        return `if (${genExpr(node.condition)}) { throw new Error("Assertion failed: " + ${JSON.stringify(genExpr(node.condition))}); }`;
      
      case "Input":
        // For Bun/Node, we'll use a sync prompt approach
        return `const ${node.variable} = await (async () => { const readline = require("readline"); const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); return new Promise(resolve => rl.question("", answer => { rl.close(); resolve(answer); })); })();`;
      
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
  
  if (!parser.results || parser.results.length === 0) {
    throw new Error("Parse failed: no results");
  }
  
  if (parser.results.length > 1) {
    console.warn("Warning: Ambiguous parse, using first result");
  }
  
  const ast = parser.results[0];
  const code = compile(ast).join("\n");
  
  // Wrap in async IIFE if we have any async operations (like gimme/input)
  if (code.includes("await")) {
    return `(async () => {\n${indent(code)}\n})();`;
  }
  
  return code;
}

module.exports = transpile;
