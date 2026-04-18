const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'src', 'modules');
if (!fs.existsSync(modulesDir)) {
  console.error('No modules directory found:', modulesDir);
  process.exit(1);
}

const modules = fs.readdirSync(modulesDir).filter((d) => {
  const full = path.join(modulesDir, d);
  return fs.statSync(full).isDirectory();
});

const results = modules.map((m) => {
  const localeFile = path.join(modulesDir, m, 'locales.ts');
  return { module: m, hasLocales: fs.existsSync(localeFile) };
});

console.log('Module locales check:');
results.forEach((r) => console.log(`- ${r.module}: ${r.hasLocales ? 'OK' : 'MISSING'}`));

const missing = results.filter((r) => !r.hasLocales);
if (missing.length > 0) {
  console.error('\nSome modules are missing locales.ts.');
  process.exit(2);
}

console.log('\nAll modules have locales.ts');
process.exit(0);
