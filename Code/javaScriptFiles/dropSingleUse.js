  import { StaticEntity } from "./staticEntity.js"

export class DropSingleUse extends StaticEntity {
  constructor(x, y, hitbox, png) {
    super(x, y, hitbox, png)
    this.used = false
  }

  apply(player) {}
  getColor() { return "white" }

  tryPickup(player) {
    if (player.checkCollision(this, 0, 0)) {
      this.apply(player)
      return true
    }
    return false
  }

  render(ctx, player, enemyItemDrops, position) {
      if (this.tryPickup(player)) enemyItemDrops.splice(position, 1)
      this.draw(ctx, player, this.getColor())
      }
  }


export class SpeedBoostDrop extends DropSingleUse {
  constructor(x, y, hitbox, png) {
    super(x, y, hitbox, png)
    this.duration = 10000
    this.speedMultiplier = 3
  }
  getColor() { return "orange" }
  apply(player) {
    if (!player) return
    if (player.baseSpeed == null) player.baseSpeed = player.speed

    if (player.speedBoostTimeout) clearTimeout(player.speedBoostTimeout)
    else player.speed = player.baseSpeed * this.speedMultiplier

    player.speedBoostTimeout = setTimeout(() => {
      player.speed = player.baseSpeed
      player.speedBoostTimeout = null
    }, this.duration)
  }
}

export class HealDrop extends DropSingleUse {
  constructor(x, y, hitbox, png) {
    super(x, y, hitbox, png)
    this.healAmount = 200
  }
  getColor() { return "green" }
  apply(player) {
    if (!player || this.used) return
    this.used = true
    if (typeof player.maxHp === "number") player.hp = Math.min(player.hp + this.healAmount, player.maxHp)
    else player.hp += this.healAmount
  }
}

export class XpDrop extends DropSingleUse {
  constructor(x, y, hitbox, png, amount = 2) {
    super(x, y, hitbox, png)
    this.amount = amount
  }
  getColor() { return "brown" }
  apply(player) {
    if (!player) return
    player.collectXp(this.amount)
  }
}

class ShockwaveNukeEffect extends StaticEntity {
  constructor(x, y) {
    super(x, y, { width: 0, height: 0 }, null)

    this.radius = 0               
    this.speed = 20               
    this.maxRadius = 2500         
  }

  render(ctx, player, enemyItemDrops, position) {
    // Shockwave wächst pro Frame
    this.radius += this.speed

    const leftBorder = player.globalEntityX - StaticEntity.FOVwidthMiddle
    const topBorder = player.globalEntityY - StaticEntity.FOVheightMiddle

    // Shockwave zeichnen (einfacher Kreis)
    ctx.beginPath()
    ctx.arc(
      this.globalEntityX - leftBorder,
      this.globalEntityY - topBorder,
      this.radius,
      0,
      Math.PI * 2
    )
    ctx.strokeStyle = "cyan"
    ctx.lineWidth = 2
    ctx.stroke()

    
     // Alle Gegner durchgehen und prüfen: Ist ein Gegner innerhalb des aktuellen Radius, wird er sofort getötet.
    
    const enemies = Game.enemies
    for (let row = 0; row < enemies.length; row++) { //Reihe Y-Richtung
      for (let col = 0; col < enemies[row].length; col++) { //Spalte X-Richtung
        const list = enemies[row][col].within // Enemy-Liste für dieses Grid-Feld (row/col)

        for (let i = list.length - 1; i >= 0; i--) {
          const enemy = list[i]

          // Distanz Gegner <-> Zentrum der Shockwave
          const dx = enemy.globalEntityX - this.globalEntityX
          const dy = enemy.globalEntityY - this.globalEntityY
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Wenn die Shockwave den Gegner erreicht -> tot
          if (dist <= this.radius) {
          enemy.takeDmg(999999, enemies, i, player.enemyItemDrops)
          }
        }
      }
    }

    // Wenn die Shockwave "fertig" ist, Effekt entfernen
    if (this.radius >= this.maxRadius) {
      enemyItemDrops.splice(position, 1)
    }
  }
}

export class NukeDrop extends DropSingleUse {
  getColor() { return "cyan" }

  apply(player) {
    if (!player || !player.enemyItemDrops) return

    // Shockwave startet genau an der Player-Position
    player.enemyItemDrops.push(
      new ShockwaveNukeEffect(
        player.globalEntityX,
        player.globalEntityY
      )
    )
  }
}
