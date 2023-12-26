const {Character} = require('./character');
const { Food } = require('./food');


class Enemy extends Character {
  static enemies = [];

  constructor(name, description, currentRoom) {
    super(name, description, currentRoom);
    this.cooldown = 3000;
    this.attackTarget = null;
    Enemy.enemies.push(this);
  }

  setPlayer(player) {
    this.player = player;
  }


  randomMove() {
    const exits = this.currentRoom.getExits();
    const idx = Math.floor(Math.random() * exits.length);
    const nextRoom = this.currentRoom.getRoomInDirection(exits[idx]);
    this.currentRoom = nextRoom;
    this.cooldown += 1000;
  }

  takeSandwich() {
    const items = this.currentRoom.items;
    for(const i = 0; i < items.length; i++) {
      if(items[i] instanceof Food) {
        this.health = 100;
        this.currentRoom.items.splice(i, 1);
        return;
      }
    }
    this.cooldown += 1000;
  }

  // Print the alert only if player is standing in the same room
  alert(message) {
    if (this.player && this.player.currentRoom === this.currentRoom) {
      console.log(message);
    }
  }

  rest() {
    // Wait until cooldown expires, then act
    const resetCooldown = () => {
      this.cooldown = 0;
      this.act();
    };
    setTimeout(resetCooldown, this.cooldown);
  }

  attack() {
    console.log(this.attackTarget);
    this.attackTarget.applyDamage(10);
    this.cooldown += 1000;
  }

  applyDamage(amount) {
    this.health -= amount;
    this.attackTarget = this.player;
    this.cooldown += 1000;
  }



  act() {
    if (this.health <= 0) {
      // Dead, do nothing;
    } else if (this.cooldown > 0) {
      this.rest();
    } else if (this.health < 100 && this.cooldown === 0) {
      this.takeSandwich();
      this.rest();
    } else {
      this.scratchNose();
      this.rest();
    }

    // Fill this in
  }


  scratchNose() {
    this.cooldown += 1000;

    this.alert(`${this.name} scratches its nose`);

  }


}

module.exports = {
  Enemy,
};
