const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const kind = process.argv[2];
if (kind !== 'riddens') throw new Error('Only riddens data has a generator.');
process.chdir(root);
// CLI-only TypeScript loading uses the existing compiler; no HTTP route is installed.
require.extensions['.ts'] = (module, file) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  module._compile(outputText, file);
};
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  const aliases = {
    '@components/': 'components/',
    '@utils/': 'utils/',
    '@translations/': 'translations/',
  };
  for (const [prefix, directory] of Object.entries(aliases)) {
    if (name.startsWith(prefix)) {
      name = path.join(root, 'src', directory + name.slice(prefix.length));
      break;
    }
  }
  return resolve.call(this, name, parent, ...rest);
};
const tool = require(path.join(root, 'tools/data-generation', kind + '.ts'));
if (!process.argv.includes('--check')) {
  Promise.resolve()
    .then(() => tool.generateRiddens())
    .then(() => console.log('Generated ' + kind + ' data.'))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
