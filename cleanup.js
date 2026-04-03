const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const keepComponents = ['public', 'ui', 'common', 'providers'];

if (fs.existsSync(componentsDir)) {
  const folders = fs.readdirSync(componentsDir);
  for (const folder of folders) {
    if (!keepComponents.includes(folder)) {
      const p = path.join(componentsDir, folder);
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
}

const hooksDir = path.join(__dirname, 'src', 'hooks', 'api');
const keepHooks = ['usePublicProducts.ts', 'usePublicNews.ts', 'useAuth.ts', 'index.ts'];

if (fs.existsSync(hooksDir)) {
  const files = fs.readdirSync(hooksDir);
  for (const file of files) {
    if (!keepHooks.includes(file)) {
      const p = path.join(hooksDir, file);
      fs.rmSync(p, { recursive: true, force: true });
    }
  }
}

const layoutDir = path.join(__dirname, 'src', 'layout');
if (fs.existsSync(layoutDir)) {
  fs.rmSync(layoutDir, { recursive: true, force: true });
}

console.log('Cleanup complete');
