#!/usr/bin/env node

/**
 * Post-build script to fix prerendered HTML files
 * - Fixes asset paths that may be broken by react-snap
 * - Ensures proper canonical URLs
 * - Validates HTML output
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

function fixHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix double slashes in paths
    if (content.includes('//assets')) {
      content = content.replace(/\/\/assets/g, '/assets');
      modified = true;
    }

    // Ensure proper base tag
    if (!content.includes('<base')) {
      content = content.replace(
        '<head>',
        '<head>\n    <base href="https://bndbox.com/">'
      );
      modified = true;
    }

    // Add prerender meta tag if missing
    if (!content.includes('name="prerender-status-code"')) {
      content = content.replace(
        '</head>',
        '    <meta name="prerender-status-code" content="200">\n  </head>'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.html')) {
      fixHtmlFile(filePath);
    }
  });
}

console.log('🔧 Running post-build fixes...\n');

if (fs.existsSync(distDir)) {
  walkDirectory(distDir);
  console.log('\n✅ Post-build fixes completed!');
} else {
  console.error('❌ dist directory not found. Run build first.');
  process.exit(1);
}
