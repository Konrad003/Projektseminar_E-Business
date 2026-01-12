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
