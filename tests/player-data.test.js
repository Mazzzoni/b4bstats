const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const localRequire = (name) => {
    if (name.startsWith('@')) {
      const aliases = {
        '@components/': 'components/',
        '@utils/': 'utils/',
        '@translations/': 'translations/',
      };
      for (const [prefix, target] of Object.entries(aliases))
        if (name.startsWith(prefix))
          return load(path.join(root, 'src', target + name.slice(prefix.length) + '.ts'));
    }
    if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name + '.ts'));
    return require(name);
  };
  vm.runInNewContext(
    code,
    { module, exports: module.exports, require: localRequire, console, URLSearchParams },
    { filename: file },
  );
  return module.exports;
}
const { default: Statistics } = load(path.join(root, 'src/components/statistics/Statistics.ts'));
const { Difficulties, ProgressionTypes, BurnCards } = load(
  path.join(root, 'src/components/statistics/types.ts'),
);
const make = (offlineData) =>
  Statistics.build({
    offlineData: {
      stats: { missionsCompleted_Secured: { base: 1, keys: { 'evans_a::hard::hero_1': 1 } } },
      ...offlineData,
    },
  });
const missing = make({});
assert.equal(missing.currencies.supplyPoints.acquired, null);
assert.equal(missing.currencies.skullTotemPoints.spent, null);
assert.equal(Object.keys(missing.burnCardsStatistics).length, 0);
assert.equal(missing.hasProgressionDifficulty(Difficulties.Legendary), false);
const actual = make({
  supplyPoints: { acquired: 0, spent: 12 },
  skullTotemPoints: { acquired: 31 },
  consumables: { '/asset/Burn_AmmoRestoreMaxTeam_25': { acquired: 5, spent: 0 } },
});
assert.equal(actual.currencies.supplyPoints.acquired, 0);
assert.equal(actual.currencies.supplyPoints.spent, 12);
assert.equal(actual.currencies.supplyPoints.balanceFromInventory, null);
assert.equal(actual.currencies.skullTotemPoints.spent, null);
assert.equal(actual.burnCardsStatistics[BurnCards.AmmoDrop].acquired, 5);
assert.equal(actual.burnCardsStatistics[BurnCards.AmmoDrop].spent, 0);
const legendary = make({
  stats: {
    missionsCompleted_Secured: {
      base: 1,
      keys: { 'evans_a::legendary::hero_1': 1, 'evans_b::legendary::hero_1': 0 },
    },
  },
});
assert.equal(legendary.hasProgressionDifficulty(Difficulties.Legendary), true);
assert.equal(
  legendary.hasProgressionDifficulty(Difficulties.Legendary, ProgressionTypes.Offline),
  false,
);
assert.equal(legendary.progressions.online.hero_1.legendary.evans_a, true);
assert.equal(legendary.progressions.online.hero_1.legendary.evans_b, false);
console.log(
  'Player data regressions passed: missing counters, real zeros, partial counters, burn cards, and recorded progression.',
);

const { getPlaystyle } = load(path.join(root, 'src/utils/playstyle.ts'));
const { Weapons, Cleaners } = load(path.join(root, 'src/components/statistics/types.ts'));
const styleStats = {
  missionsStatistics: {
    [ProgressionTypes.Merged]: {
      missionsCompletedPerCleaner: {
        [Cleaners.Jim]: { total: 80 },
        [Cleaners.Walker]: { total: 20 },
      },
    },
  },
  weaponsKills: { [Weapons.M4Carbine]: 80, [Weapons.AK47]: 20 },
};
let style = getPlaystyle(styleStats);
assert.equal(style.cleaner.id, Cleaners.Jim);
assert.equal(style.cleaner.share, 0.8);
assert.equal(style.weapon.kind, 'weapon');
assert.equal(style.weapon.id, Weapons.M4Carbine);
styleStats.weaponsKills = { [Weapons.M4Carbine]: 50, [Weapons.AK47]: 45 };
style = getPlaystyle(styleStats);
assert.equal(style.weapon.kind, 'type');
assert.equal(style.weapon.id, 'AssaultRifle');
styleStats.weaponsKills = {};
assert.equal(getPlaystyle(styleStats).weapon, null);
styleStats.missionsStatistics[ProgressionTypes.Merged].missionsCompletedPerCleaner = {};
assert.equal(getPlaystyle(styleStats).cleaner, null);
console.log('Playstyle regressions passed: dominant weapon, category fallback and missing data.');

const { comparisonCompletion, perMission } = load(path.join(root, 'src/utils/comparison.ts'));
const progressionStats = make({
  stats: {
    missionsCompleted_Secured: {
      base: 12,
      keys: {
        'evans_a::hard::hero_1': 7,
        'evans_a::legendary::hero_1': 3,
        'evans_a::pvp::hero_1': 2,
        'unknown_map::hard::hero_1': 4,
      },
    },
    missionsCompleted_Unsecured: { base: 2, keys: { 'evans_a::hard::hero_1': 2 } },
  },
});
assert.equal(comparisonCompletion(progressionStats).completed, 2);
assert.equal(comparisonCompletion(progressionStats).total, 3060);
assert.equal(comparisonCompletion(missing).completed, 1);
assert.equal(perMission(45, 10), 4.5);
assert.equal(perMission(0, 10), 0);
assert.equal(perMission(45, 0), null);
assert.equal(perMission(45, -1), null);
assert.equal(perMission(Infinity, 10), null);
console.log('Comparison regressions passed: unique campaign completions and per-mission rates.');

const { legacyOverviewDestination } = load(path.join(root, 'src/utils/overviewRoutes.ts'));
assert.equal(
  legacyOverviewDestination('/', '?tab=official&page=2&platform=steam&metric=kills'),
  '/leaderboards/?page=2&platform=steam',
);
assert.equal(legacyOverviewDestination('/', '?tab=overall&page=2'), '/overall/');
assert.equal(
  legacyOverviewDestination('/', '?tab=community&metric=kills&order=asc'),
  '/?metric=kills&order=asc',
);
assert.equal(legacyOverviewDestination('/', '?tab=invalid&page=2'), '/?page=2');
assert.equal(legacyOverviewDestination('/', '?page=2'), null);
assert.equal(legacyOverviewDestination('/player/Test%231234/', '?tab=official'), null);
console.log(
  'Overview route regressions passed: legacy bookmarks keep relevant filters and leave other pages unchanged.',
);

const { clientIp } = load(path.join(root, 'src/utils/clientIp.ts'));
assert.equal(clientIp('203.0.113.1', '198.51.100.1', ''), '203.0.113.1');
assert.equal(clientIp('127.0.0.1', '198.51.100.1', '127.0.0.1'), '198.51.100.1');
assert.equal(clientIp('127.0.0.1', '192.0.2.99,198.51.100.1', '127.0.0.1'), '198.51.100.1');
assert.equal(
  clientIp('127.0.0.1', '198.51.100.1,192.0.2.10', '127.0.0.1,192.0.2.10'),
  '198.51.100.1',
);
assert.equal(clientIp('::ffff:127.0.0.1', '198.51.100.1', ''), '127.0.0.1');
assert.equal(clientIp('127.0.0.1', 'bad address', '127.0.0.1'), '127.0.0.1');
assert.equal(clientIp('127.0.0.1', ['198.51.100.1', '203.0.113.1'], '127.0.0.1'), '127.0.0.1');
assert.throws(() => clientIp('127.0.0.1', '', '*'));
assert.throws(() => clientIp('127.0.0.1', '', '0.0.0.0/0'));
console.log(
  'Client IP regressions passed: trusted hops, spoofed headers, mapped IPv4, and malformed forwarding.',
);

const { publicApiError } = load(path.join(root, 'src/utils/publicApiError.ts'));
assert.equal(publicApiError(503, 'AUTH_EXPIRED').code, 'SERVICE_UNAVAILABLE');
assert.equal(publicApiError(500, 'PRIVATE_ERROR').code, 'SERVICE_UNAVAILABLE');
assert.equal(publicApiError(429, 'PRIVATE_ERROR').code, 'RATE_LIMITED');
assert.equal(publicApiError(503, 'SERVICE_BUSY').code, 'SERVICE_BUSY');
assert.equal(publicApiError(404, 'PLAYER_NOT_FOUND').code, 'PLAYER_NOT_FOUND');
assert.equal(publicApiError(400, 'PRIVATE_ERROR').code, 'REQUEST_FAILED');
console.log(
  'Public error regressions passed: unknown authentication and service diagnostics remain private.',
);
