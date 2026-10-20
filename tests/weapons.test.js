const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

// Compile the pure utility module with the project's existing TypeScript compiler.
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/weapons/utils.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS},
}).outputText;
const context = {exports: {}};
vm.runInNewContext(compiled, context);
const {getDamageStatistics, getWeaponQuality} = context.exports;
const weapons = require('../data/weapons/weapons.json');

const closeTo = (actual, expected) => {
  assert(Math.abs(actual - expected) < 1e-8, `${actual} does not match ${expected}`);
};

// Issue #51's rounded examples, independent of the spreadsheet's cached DPS.
const phoenix = getDamageStatistics({
  rangeDamagesComputed: [150], rpm: 60, magazineSize: 5, reloadSpeed: 3.45,
});
closeTo(phoenix.rawDps, 150);
closeTo(phoenix.sustainedDps, 750 / 8.45);
closeTo(phoenix.fullMagazineDamage, 750);

const aa12 = getDamageStatistics({
  rangeDamagesComputed: [104.5], rpm: 343, magazineSize: 12, reloadSpeed: 2.56,
});
closeTo(aa12.rawDps, 597.3916666666667);
closeTo(aa12.sustainedDps, 1254 / (720 / 343 + 2.56));
closeTo(aa12.fullMagazineDamage, 1254);

// Real data uses full precision, including shotgun pellets and bonus damage.
const actualPhoenix = weapons.find(weapon => weapon.name === 'Sni01').qualities.epic;
const actualAa12 = weapons.find(weapon => weapon.name === 'SG02').qualities.epic;
closeTo(getDamageStatistics(actualPhoenix).sustainedDps, 88.6157374260355);
closeTo(getDamageStatistics(actualAa12).rawDps, 597.2523941428573);
closeTo(getDamageStatistics(actualAa12).sustainedDps, 268.90239822737067);

// The Belgian empties its two-shell magazine in one shot. Reloads count once.
const belgian = weapons.find(weapon => weapon.name === 'SG03').qualities.epic;
const belgianDamage = getDamageStatistics(belgian);
assert.equal(belgian.roundsPerShot, 2);
closeTo(belgian.rpm, 200);
closeTo(belgianDamage.fullMagazineDamage, belgian.rangeDamagesComputed[0]);
closeTo(belgianDamage.sustainedDps, belgian.rangeDamagesComputed[0] / (0.3 + 1.608));

// Tooltip rows must use their own magazine, reload, rate and stumble values.
const common = {
  rangeDamagesComputed: [100], rpm: 60, magazineSize: 5, reloadSpeed: 5,
  stumblePerShot: 20, stumblePerSecond: 30,
};
const epic = {
  rangeDamagesComputed: [200], rpm: 120, magazineSize: 10, reloadSpeed: 1,
  stumblePerShot: 80, stumblePerSecond: 120,
};
const commonAtRange = getDamageStatistics(common, 50);
const epicAtRange = getDamageStatistics(epic, 100);
closeTo(commonAtRange.rawDps, 50);
closeTo(commonAtRange.sustainedDps, 25);
closeTo(epicAtRange.rawDps, 200);
closeTo(epicAtRange.sustainedDps, 1000 / 6);
closeTo(epicAtRange.fullMagazineDamage, 1000);
closeTo(epicAtRange.stumblePerShot, 40);
closeTo(epicAtRange.stumblePerSecond, 60);
const weapon = {qualities: {common, epic}};
assert.equal(getWeaponQuality(weapon, 'rare'), epic);
assert.equal(getWeaponQuality(weapon, 'common'), common);

// Melee has no magazine/reload cycle, and out-of-range damage must be zero.
const melee = {rangeDamagesComputed: [40], rpm: 90, stumblePerShot: 20, stumblePerSecond: 30};
closeTo(getDamageStatistics(melee).rawDps, 60);
closeTo(getDamageStatistics(melee).sustainedDps, 60);
for (const value of Object.values(getDamageStatistics(melee, 0))) closeTo(value, 0);
closeTo(getDamageStatistics({...common, rpm: 0}).sustainedDps, 0);
closeTo(getDamageStatistics({...common, reloadSpeed: 0}).sustainedDps, 100);

// Ensure the published data stays consistent with the calculations used by the UI.
let checked = 0;
for (const weapon of weapons) {
  if (weapon.category === 'bow') continue;
  for (const statistics of Object.values(weapon.qualities)) {
    const result = getDamageStatistics(statistics);
    assert(Number.isFinite(result.rawDps));
    assert(Number.isFinite(result.sustainedDps));
    assert(result.sustainedDps <= result.rawDps + 1e-8);
    closeTo(statistics.trueDps, result.sustainedDps);
    if (weapon.category !== 'melee') {
      closeTo(statistics.fullMagazineDamage, result.fullMagazineDamage);
    }
    checked++;
  }
}

console.log(`Weapon regression checks passed (${checked} weapon qualities).`);
