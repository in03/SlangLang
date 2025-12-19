#!/usr/bin/env bun
/**
 * Build script for SlangLang playground
 * Bundles the compiler for browser use
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔨 Building SlangLang playground...\n');

// Ensure dist directory exists
mkdirSync('./playground/dist', { recursive: true });

// Use esbuild for proper IIFE bundling with global name
// This ensures the entry point actually executes
try {
  execSync(
    'npx esbuild ./playground/compiler-browser.js --bundle --format=iife --global-name=SlangLangBundle --platform=browser --outfile=./playground/dist/slanglang.bundle.js',
    { stdio: 'inherit' }
  );
} catch (e) {
  // If esbuild isn't available, try with bun but add manual wrapper
  console.log('esbuild not found, using alternative approach...');
  
  // Build with bun
  await Bun.build({
    entrypoints: ['./playground/compiler-browser.js'],
    outdir: './playground/dist',
    target: 'browser',
    format: 'esm', // ESM auto-executes
    naming: 'slanglang.bundle.js',
    minify: false,
  });
  
  // Wrap in script that works without module type
  let bundle = readFileSync('./playground/dist/slanglang.bundle.js', 'utf8');
  bundle = `(function() {\n${bundle}\n})();`;
  writeFileSync('./playground/dist/slanglang.bundle.js', bundle);
}

console.log('✅ Bundled compiler');

// Copy syntax highlighting files
copyFileSync('./editor/slanglang.hljs.js', './playground/dist/slanglang.hljs.js');
copyFileSync('./editor/slanglang.css', './playground/dist/slanglang.css');

console.log('✅ Copied syntax highlighting');

// Copy HTML
copyFileSync('./playground/index.html', './playground/dist/index.html');

console.log('✅ Copied HTML');

console.log('\n🎉 Playground built successfully!');
console.log('   Open playground/dist/index.html to test locally');
console.log('   Deploy playground/dist/ to Vercel/GitHub Pages');
