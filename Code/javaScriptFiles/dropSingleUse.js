import { StaticEntity } from "./staticEntity.js"

export class DropSingleUse extends StaticEntity {
  constructor(x, y, hitbox, png) {
    super(x, y, hitbox, png)
    this.used = false
  }

  apply(player) {}
  getColor() { return "white" }

  render(ctx, player) {
    this.draw(ctx, player, this.getColor())
  }

  tryPickup(player) {
    if (player.checkCollision(this, 0, 0)) {
      player.collectPickup(this)
      return true
    }
    return false
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

// in dropSingleUse damit game.js quasi unverändert bleibt? Vllt in Zukunft ändern? 
export class DropSystem {
  constructor() {
    this.enemyItemDrops = []
    this.enemyXpDrops = []
  }

  addItemDrop(drop) {
    this.enemyItemDrops.push(drop)
  }

  addXpDrop(drop) {
    this.enemyXpDrops.push(drop)
  }

  render(ctx, player) {
    // Items
    for (let i = this.enemyItemDrops.length - 1; i >= 0; i--) {
      const d = this.enemyItemDrops[i]
      d.render(ctx, player)
      if (d.tryPickup(player)) this.enemyItemDrops.splice(i, 1)
    }

    // XP
    for (let i = this.enemyXpDrops.length - 1; i >= 0; i--) {
      const d = this.enemyXpDrops[i]
      d.render(ctx, player)
      if (d.tryPickup(player)) this.enemyXpDrops.splice(i, 1)
    }
  }

  reset() {
    this.enemyItemDrops.length = 0
    this.enemyXpDrops.length = 0
  }
}
