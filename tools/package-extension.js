#!/usr/bin/env bun
/**
 * Packages the SlangLang VS Code extension and optionally installs it.
 * 
 * Usage: 
 *   bun tools/package-extension.js          # Package only
 *   bun tools/package-extension.js --install  # Package and install
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const vscodeDir = path.join(__dirname, "..", "editor", "vscode");
const distDir = path.join(__dirname, "..", "dist");

// Check if vsce is available via bunx
function ensureVsce() {
  try {
    execSync("bunx --bun @vscode/vsce --version", { stdio: "pipe" });
    return true;
  } catch {
    console.log("📦 Installing @vscode/vsce...");
    try {
      execSync("bun add -d @vscode/vsce", { stdio: "inherit", cwd: path.join(__dirname, "..") });
    } catch {
      // May already be installed
    }
    return true;
  }
}

// Read version from package.json
function getVersion() {
  const pkgPath = path.join(vscodeDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return pkg.version;
}

// Add README to extension (required by vsce)
function ensureReadme() {
  const readmePath = path.join(vscodeDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# SlangLang for VS Code

Syntax highlighting for SlangLang - the Australian slang programming language.

## Features

- Syntax highlighting for .slang files
- Auto-indentation for blocks
- Bracket matching

## Usage

Create a file with \`.slang\` extension and start coding in Australian!

\`\`\`slang
crikey – "G'day mate!"

sangas is esky: bloody ham, bloody cheese.
scoffin snag from sangas!
  crikey – snag
who's full?
\`\`\`

## More Info

See the [SlangLang repository](https://github.com/slanglang/slanglang) for full documentation.
`);
    console.log("📝 Created README.md for extension");
  }
}

// Add CHANGELOG (recommended by vsce)
function ensureChangelog() {
  const changelogPath = path.join(vscodeDir, "CHANGELOG.md");
  if (!fs.existsSync(changelogPath)) {
    const version = getVersion();
    fs.writeFileSync(changelogPath, `# Changelog

## ${version}

- Initial release with syntax highlighting
- Auto-generated from SlangLang lexer
`);
    console.log("📝 Created CHANGELOG.md for extension");
  }
}

function main() {
  const args = process.argv.slice(2);
  const shouldInstall = args.includes("--install") || args.includes("-i");
  
  console.log("📦 Packaging SlangLang VS Code extension...\n");
  
  // Ensure required files exist
  ensureVsce();
  ensureReadme();
  ensureChangelog();
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  const version = getVersion();
  const vsixName = `slanglang-${version}.vsix`;
  const vsixPath = path.join(distDir, vsixName);
  
  // Package the extension using bunx
  console.log(`Building ${vsixName}...`);
  try {
    // --allow-missing-repository: skip repo warning
    // --skip-license: skip license prompt  
    // -y: auto-yes to prompts
    execSync(`bunx --bun @vscode/vsce package -o "${vsixPath}" --allow-missing-repository --skip-license`, {
      cwd: vscodeDir,
      stdio: "inherit"
    });
  } catch (err) {
    console.error("❌ Failed to package extension");
    console.error("   Make sure you have bun installed");
    process.exit(1);
  }
  
  console.log(`\n✅ Packaged: ${vsixPath}`);
  
  if (shouldInstall) {
    console.log("\n🔧 Installing extension...");
    
    // Try both 'code' and 'cursor' commands
    const editors = [
      { cmd: "cursor", name: "Cursor" },
      { cmd: "code", name: "VS Code" }
    ];
    
    let installed = false;
    for (const editor of editors) {
      try {
        execSync(`${editor.cmd} --install-extension "${vsixPath}" --force`, {
          stdio: "inherit"
        });
        console.log(`✅ Installed in ${editor.name}!`);
        installed = true;
      } catch {
        // Editor not found, try next
      }
    }
    
    if (!installed) {
      console.log("\n⚠️  Could not auto-install. Install manually:");
      console.log(`   code --install-extension "${vsixPath}"`);
      console.log("   or");
      console.log(`   cursor --install-extension "${vsixPath}"`);
    } else {
      console.log("\n🎉 Extension installed! Restart your editor to see syntax highlighting.");
    }
  } else {
    console.log("\nTo install, run one of:");
    console.log(`  cursor --install-extension "${vsixPath}"`);
    console.log(`  code --install-extension "${vsixPath}"`);
    console.log("\nOr run: npm run build:vsix -- --install");
  }
}

main();

