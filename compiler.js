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
    case "EmptyList":
      return "[]";
    case "EmptyDict":
      return "{}";
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
    case "Pop":
      return expr.position === "first"
        ? `${expr.target}.shift()`
        : `${expr.target}.pop()`;
    case "ListExpr":
      const items = expr.items.map(i => {
        if (typeof i === "string") return JSON.stringify(i);
        if (typeof i === "object" && i.type) return genExpr(i);
        return String(i);
      }).join(", ");
      return `[${items}]`;
    case "DictExpr":
      const entries = expr.entries.map(([k, v]) => `${JSON.stringify(k)}: ${genExpr(v)}`).join(", ");
      return `{${entries}}`;
    case "TemplateString":
      // Template string with reckon interpolation: parts = [{type:"string",value:"..."}, {type:"var",name:"x"}, ...]
      // Compiles to JS template literal: `str1${x}str2`
      const templateParts = expr.parts.map(part => {
        if (part.type === "string") return part.value.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        if (part.type === "var") return `\${${part.name}}`;
        return '';
      });
      return '`' + templateParts.join('') + '`';
    default:
      throw new Error("Unknown expr: " + JSON.stringify(expr));
  }
}

function indent(code, spaces = 2) {
  return code.split("\n").map(line => " ".repeat(spaces) + line).join("\n");
}

function compile(ast, level = 0, target = 'commonjs') {
  return ast.map(node => {
    switch (node.type) {
      case "Print":
        return `console.log(${genExpr(node.expr)});`;

      case "Function": {
        const params = node.params.join(", ");
        const body = compile(node.body, level + 1, target).join("\n");
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
        const listBody = node.items.map(i => {
          if (typeof i === "string") return JSON.stringify(i);
          if (typeof i === "object" && i.type) return genExpr(i);
          return String(i);
        }).join(", ");
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
        // Handle both single items and arrays of items from tossin syntax
        if (Array.isArray(node.item)) {
          const items = node.item.map(item => genExpr(item)).join(", ");
          return `${node.target}.push(${items});`;
        } else {
          const item = typeof node.item === "string"
            ? JSON.stringify(node.item)
            : (typeof node.item === "object" ? genExpr(node.item) : node.item);
          return `${node.target}.push(${item});`;
        }
      }

      case "DictAppend": {
        // Handle dictionary appends from tossin syntax
        const entries = node.entries.map(entry => {
          // Each entry is an object with key/value properties
          if (entry.key && entry.value) {
            return `${JSON.stringify(entry.key)}: ${genExpr(entry.value)}`;
          }
          return "";
        }).filter(e => e).join(", ");
        return `Object.assign(${node.target}, {${entries}});`;
      }
      
      case "Remove":
        return `${node.target}.splice(${node.target}.indexOf(${JSON.stringify(node.item)}), 1);`;
      
      case "Pop":
        return node.position === "first" 
          ? `${node.target}.shift();`
          : `${node.target}.pop();`;
      
      case "ForEach": {
        const body = compile(node.body, level + 1, target).join("\n");
        return `for (const ${node.iterator} of ${node.target}) {\n${indent(body)}\n}`;
      }

      case "ForEachDict": {
        const body = compile(node.body, level + 1, target).join("\n");
        const keyVar = node.keyVar || "item";
        const valVar = node.valVar || "price";
        return `for (const [${keyVar}, ${valVar}] of Object.entries(${node.target})) {\n${indent(body)}\n}`;
      }

      case "ForRange": {
        const body = compile(node.body, level + 1, target).join("\n");
        return `for (let ${node.iterator} = 0; ${node.iterator} < ${genExpr(node.count)}; ${node.iterator}++) {\n${indent(body)}\n}`;
      }

      case "WhileNot": {
        const body = compile(node.body, level + 1, target).join("\n");
        return `while (!(${genExpr(node.condition)})) {\n${indent(body)}\n}`;
      }

      case "If": {
        let code = `if (${genExpr(node.condition)}) {\n${indent(compile(node.body, level + 1, target).join("\n"))}\n}`;
        for (const elif of node.elifs) {
          code += ` else if (${genExpr(elif.condition)}) {\n${indent(compile(elif.body, level + 1, target).join("\n"))}\n}`;
        }
        if (node.else) {
          code += ` else {\n${indent(compile(node.else, level + 1, target).join("\n"))}\n}`;
        }
        return code;
      }
      
      case "Import":
        // For Node/Bun: const { name } = require("from")
        // For ES modules: import { name } from "from"
        if (target === 'esmodule') {
          return `import { ${node.name} } from "${node.from}";`;
        } else {
          return `const { ${node.name} } = require("${node.from}");`;
        }

      case "ImportAll":
        // For wildcard imports, use a more readable name
        const varName = `${node.from}module`;
        if (target === 'esmodule') {
          return `import * as ${varName} from "${node.from}";`;
        } else {
          return `const ${varName} = require("${node.from}");`;
        }

      case "ImportModule":
        if (target === 'esmodule') {
          return `import ${node.name} from "${node.name}";\nconst ${node.alias} = ${node.name};`;
        } else {
          return `const ${node.alias} = require("${node.name}");`;
        }
      
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

// Check if this is the known harmless 'is not' ambiguity pattern
function isIsNotAmbiguity(ast1, ast2) {
  // Helper to find comparison expressions in the AST
  function findComparisonExpr(node) {
    if (!node) return null;
    if (Array.isArray(node)) {
      for (const item of node) {
        const result = findComparisonExpr(item);
        if (result) return result;
      }
    } else if (node.type === 'BinOp' && (node.op === '===' || node.op === '!==')) {
      return node;
    } else if (node.expr) {
      return findComparisonExpr(node.expr);
    } else if (node.body) {
      return findComparisonExpr(node.body);
    }
    return null;
  }

  const comp1 = findComparisonExpr(ast1);
  const comp2 = findComparisonExpr(ast2);

  if (!comp1 || !comp2) return false;

  // Check if one is !== and the other is === with a NOT unary operation
  const isNotEquality = comp1.op === '!==' && comp2.op === '===';
  const isEqualityNot = comp1.op === '===' && comp2.op === '!==';

  if (!isNotEquality && !isEqualityNot) return false;

  // Check if the === version has a NOT unary operation
  const equalityAst = isNotEquality ? comp2 : comp1;

  function hasNotUnary(node) {
    if (!node) return false;
    if (node.type === 'UnaryOp' && node.op === '!') return true;

    // Check all child nodes
    if (node.left && hasNotUnary(node.left)) return true;
    if (node.right && hasNotUnary(node.right)) return true;
    if (node.expr && hasNotUnary(node.expr)) return true;

    return false;
  }

  return hasNotUnary(equalityAst);
}

function transpile(source, target = 'commonjs') {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar)
  );
  parser.feed(source);

  if (!parser.results || parser.results.length === 0) {
    throw new Error("Parse failed: no results");
  }

  if (parser.results.length > 1) {
    // Check if this is the known harmless 'is not' ambiguity
    const isHarmlessIsNotAmbiguity = parser.results.length === 2 &&
      isIsNotAmbiguity(parser.results[0], parser.results[1]);

    if (!isHarmlessIsNotAmbiguity) {
      console.warn("Warning: Ambiguous parse, using first result");
    }
  }

  const ast = parser.results[0];
  const code = compile(ast, 0, target).join("\n");
  
  // Wrap in async IIFE if we have any async operations (like gimme/input)
  if (code.includes("await")) {
    return `(async () => {\n${indent(code)}\n})();`;
  }
  
  return code;
}

module.exports = transpile;
