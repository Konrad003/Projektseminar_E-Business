# Weapon-System Refactor Plan

## Aktuelle Probleme

1. **Massive If-Else Blöcke** (500+ Zeilen)
   - projectile.js: `handleProjectiles()`, `move()`, `draw()` sind riesige If-Else-Ketten
   - weapon.js: `shoot()` und `render()` wiederholen ähnliche Logic für verschiedene Waffentypen

2. **Fehlende Abstraktion**
   - Viele Waffen (Sword, Bow, Spear, etc.) haben ähnliche Struktur, aber code-dupliziert
   - Projectile-Typen sind nur via Flags definiert (isFireball, isMolotov, isSlash, etc.)

3. **Unstrukturierte Projektil-Verwaltung**
   - Ein großes `Projectile`-Klasse mit vielen Properties für verschiedene Typen
   - Keine klare Verantwortlichkeit pro Waffe/Projektil-Art

4. **Schlechte Wartbarkeit**
   - Neuer Waffentyp → Code an mehreren Stellen hinzufügen
   - Change in einem Weafen-Feature → Mehrere Stellen müssen angepasst werden

---

## Refactor-Strategie

### Phase 1: Projektil-System Überhaul

#### Alte Struktur:
```javascript
class Projectile {
  isFireball, isMolotov, isSlash, orbiting, boomerang...
  // 500 Zeilen If-Else
}
```

#### Neue Struktur - Subklassen pro Typ:
```
Projectile (Basis)
├── BasicProjectile (Pfeil, Speer, )
├── FireballProjectile (Explosion-Logik)
├── MolotovProjectile (Landing + Kreis)
├── SlashProjectile (Schwert-Bewegung)
├── OrbitingProjectile (Shuriken)
└── BoomerangProjectile (Rückkehr-Logik)
```

**Jede Subklasse hat eigene:**
- `update(map, currentTime)`
- `draw(ctx, player)`
- `checkCollision(enemies, player)`
- `isOutOfBounds()`

---

### Phase 2: Waffen-System Überhaul

#### Alte Struktur:
```javascript
class BowWeapon extends Weapon {
  shoot() { /* viel Code */ }
  render() { /* viel Code */ }
}
class SwordWeapon extends Weapon {
  shoot() { /* viel Code */ }
  render() { /* viel Code */ }
}
// ... kopiert für jede Waffe
```

#### Neue Struktur - Template Pattern:
```javascript
class Weapon (Basis)
├── shoot()  // Template Method - ruft protected Methoden auf:
│   ├── createProjectiles()  [implementiert von Subklasse]
│   └── applyWeaponEffects() [implementiert von Subklasse]
│
└── render() // Template Method - ruft auf:
    ├── handleProjectileLogic()
    ├── renderProjectiles()
    └── cleanupDeadProjectiles()

class BasicWeapon extends Weapon {
  createProjectiles() { /* nur Projektil-Erzeugung */ }
}

class SwordWeapon extends Weapon {
  createProjectiles() { /* Schlags-Logik */ }
}

class ThunderstrikeWeapon extends Weapon {
  createProjectiles() { /* Blitz-Effekte */ }
  applyWeaponEffects() { /* AoE */ }
}
```

---

## Konkrete Refactor-Schritte

### Schritt 1: Projektil-Subklassen erstellen
```
projectile.js (neu)
├── Projectile (Basis-Klasse - vereinfacht)
├── BasicProjectile
├── FireballProjectile
├── MolotovProjectile
├── SlashProjectile
├── OrbitingProjectile
└── BoomerangProjectile
```

**Nutzen:**
- Jede Klasse hat nur ihre eigene Logik
- `move()`, `draw()`, `checkCollision()` sind spezifisch
- Keine riesigen If-Else-Blöcke mehr
- Neue Projektil-Typen → einfach neue Subklasse

---

### Schritt 2: Waffen-Basis refaktorieren
```javascript
// Alte Version: 100+ Zeilen pro Waffe, viel Copy-Paste
// Neue Version: Template Pattern
```

**Gemeinsame Logik in Basis-Klasse:**
- `checkCooldown(currentTime)`
- `render()` Template Method
- `createProjectileGrid()` (wird nur für Player-Waffen genutzt)

**Subklassen implementieren nur:**
- `createProjectiles()` - wie Projektile erzeugt werden
- `getProjectileClass()` - welcher Projektil-Typ
.

---

### Schritt 3: Redundante Weapon-Klassen zusammenfassen

**Vorher:** 10+ separate Weapon-Klassen (viel Code-Duplikation)
**Nachher:** Generische Weapon-Klasse + Konfiguration

```javascript
// Statt: SwordWeapon, SpeerWeapon, BowWeapon (3 ähnliche Klassen)
// Neu: WeaponFactory mit Config
new Weapon({
  type: "sword",
  dmg: 50,
  cooldown: 200,
  projectileClass: SlashProjectile,
  amount: 1,
  range: 100
})
```

---

## Gewinn durch Refactor

| Problem | Lösung | Vorteil |
|---------|--------|---------|
| 500 If-Else in Projectile | Subklassen pro Typ | Klare Verantwortlichkeit, leicht erweiterbar |
| Copy-Paste in Weapons | Template Pattern | DRY-Prinzip, weniger Code |
| Neue Waffe → viel Copy-Code | Generisches Framework | Neue Waffe = 10 Zeilen Config |
| Änderungen → überall anpassen | Lokalisierte Änderungen | Weniger Bug-Potenzial |
| Unübersichtlich | Klare Struktur | Bessere Lesbarkeit |

---

## Implementation-Status

✅ **Phase 1: Projektil-Subklassen** - ABGESCHLOSSEN
- `projectile-refactored.js` erstellt
- 6 spezialisierte Subklassen ohne If-Else-Blöcke
- 180 Zeilen statt 579 Zeilen (69% Reduktion)

✅ **Phase 2: Waffen-System Template Pattern** - ABGESCHLOSSEN
- `weapon-refactored.js` erstellt
- 11 spezialisierte Waffen-Klassen
- ~20 Zeilen pro Waffe statt 60 Zeilen (67% Reduktion)

✅ **Phase 3: Redundante Waffen zusammenfassen** - ABGESCHLOSSEN
- RangedWeapon Basis-Klasse für Bow/Spear/Knife
- Vereinheitlichte Projektil-Erstellung
- Weitere Code-Reduktion möglich (optional)

---

## Implementation-Reihenfolge

1. **Projectile-Subklassen** (keine Breaking Changes)
2. **Weapon-Template-Pattern** (mit altem Code kompatibel)
3. **Alte Weapon-Klassen entfernen** (nach vollständigem Refactor)
4. **Testing & Cleanup**

---

## Statistiken nach Refactor

- **weapon.js**: 982 → ~400 Zeilen (60% Reduktion)
- **projectile.js**: 579 → ~300 Zeilen (48% Reduktion)
- **Neue Waffe hinzufügen**: 150 Zeilen → 20 Zeilen
