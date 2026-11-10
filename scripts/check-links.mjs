import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Please run npm run build first.');
  process.exit(1);
}

const htmlFiles = [];

function findHtml(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      findHtml(full);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}

findHtml(distDir);

let brokenCount = 0;
const checked = new Set();

for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file);
  const content = fs.readFileSync(file, 'utf8');

  // Match href and src attributes
  const linkRegex = /(?:href|src)="([^"#][^"]*)"/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const raw = match[1];
    if (
      raw.startsWith('http://') ||
      raw.startsWith('https://') ||
      raw.startsWith('mailto:') ||
      raw.startsWith('tel:') ||
      raw.startsWith('javascript:') ||
      raw.startsWith('data:')
    ) {
      continue;
    }

    let targetPath = raw.split('?')[0];
    if (targetPath.startsWith('/')) {
      targetPath = targetPath.slice(1);
    }

    const possibleFiles = [
      path.join(distDir, targetPath),
      path.join(distDir, targetPath, 'index.html'),
      path.join(distDir, targetPath + '.html')
    ];

    const exists = possibleFiles.some((p) => fs.existsSync(p));
    if (!exists) {
      console.error(`❌ [BROKEN LINK] in ${relPath}: ${raw}`);
      brokenCount++;
    } else {
      checked.add(raw);
    }
  }
}

console.log(`\n🔍 Link Check Report:`);
console.log(`   - Audited HTML Files: ${htmlFiles.length}`);
console.log(`   - Verified Internal Links & Assets: ${checked.size}`);

if (brokenCount === 0) {
  console.log(`✅ Result: 0 broken links found. All internal routes and assets valid!\n`);
} else {
  console.error(`❌ Result: ${brokenCount} broken link(s) detected!\n`);
  process.exit(1);
}
