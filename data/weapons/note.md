**Data provided by TRS | Last data update: 2022/12/06.**

**Notes:**  
You can find all raw statistics used [here](https://github.com/Mazzzoni/b4bstats/blob/main/data/weapons/weapons.json).

**Bow damages computation are not accurate at the moment.**

**DPS:** Raw DPS is `Damage per Shot * RPM / 60`, without reloads. Sustained DPS is
`Shots per Magazine * Damage per Shot / (Shots per Magazine * 60 / RPM + Reload Time)`.
Shots per magazine equals magazine size divided by rounds consumed per shot.
The Belgian consumes two shells per shot; other listed firearms consume one round.
Its firing rate is calculated from the shot delay, with reloads counted only in sustained DPS.
This model uses one interval per shot and one reload per magazine, without
attachment or card bonuses. Melee DPS uses the attack rate without a reload.
Calculations use full precision; displayed values are rounded. Each quality uses
its own damage, firing rate, magazine size and reload time.

For deeper theory crafting and calculation, you can use this [spreadsheet](https://docs.google.com/spreadsheets/d/1vVgiHtr_LubgqSD0HvYPHSTmDmOsBtuhyJK4CWWBDnk) provided by **Kaemanden**.
