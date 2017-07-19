
Game.Entity = function (properties, components) {
  properties = properties || {};
  components = components || [];
  this._components = {};

  for (var i = 0; i < components.length; i++) {
    if (components[i] in Game.Components) {
      var component = Game.Components[components[i]];
      for (var key in component) {
        if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
          this[key] = component[key];
        }
      }

      this._components[component.name] = component;

      if (component.init) {
        component.init(this, properties);
      }
    } else {
      console.log("Unknown component: " + components[i]);
    }
  }
}

Game.Entity.prototype.getComponent = function (name) {
  return this._components[name];
}

Game.Components = {}

Game.Components.Position = {
  name: 'Position',
  init: function (obj, properties) {
    obj._x = properties.x || 0;
    obj._y = properties.y || 0;
  },
  moveTo: function (x, y) {
    if (Game._map.getTile(x,y).tile.isBlocked()) {
      return false;
    }
    this._x = x;
    this._y = y;
    return true;
  }
}

Game.Components.Renderable = {
  name: 'Renderable',
  init: function (obj, properties) {
    obj._x = properties.x || 0;
    obj._y = properties.y || 0;
    obj._glyph = properties.glyph || Game.Glyph.Null;
  },
  render: function (ctx) {
    this._glyph.draw(ctx, this._x, this._y);
  }
}

Game.Components.Actor = {
  name: 'Actor',
  init: function (obj, properties) {
    obj._name = properties.name;
  },
  act: function() {
  }
}

Game.Components.PlayerActor = {
  name: 'PlayerActor',
  init: Game.Components.Actor.init,
  act: function() {
    Game.render();
    Game._engine.lock();
  },
  die: function() {
    Game.switchMode(Game.Mode.dead);
  }
}

Game.Components.EnemyActor = {
  name: 'EnemyActor',
  init: function (obj, properties) {
    Game.Components.Actor.init(obj, properties);
    obj.interact = true;
  },
  act: function () {
    if (Game._map.getTile(this._x, this._y).lit) {
      if (Game.Util.hexDist({x: this._x, y: this._y},
              {x: Game._player._x, y: Game._player._y}) >= 2) {
        this.moveToward(Game._player);
      } else if (Game._player._hp > 0) {
        this.attack(Game._player);
      }
    }
  },
  moveToward: function (target) {
    var done = false, obj = this;
    var passable = function (x, y) {
      if (!Game._map.getTile(x, y).tile.isBlocked()) {
        var e = Game.getEntityAt(x, y);
        return !e || e === obj || !e.interact;
      }
      return false;
    };
    var path = new ROT.Path.AStar(target._x, target._y, passable,
      { topology: 6 });
    path.compute(this._x, this._y, function (x, y) {
      if (done) return;
      if (obj._x !== x || obj._y !== y) {
        done = true;
        obj.moveTo(x, y);
      }
    });
  }
}

Game.Components.Fighter = {
  name: 'Fighter',
  init: function (obj, properties) {
    obj._maxHp = properties.maxHp;
    obj._hp = properties.hp || properties.maxHp;
    obj._defense = properties.defense || 0;
    obj._power = properties.power || 0;
  },
  takeDamage: function (damage) {
    if (damage > 0) {
      this._hp -= damage;
    }

    if (this._hp <= 0) {
      if ('die' in this) {
        this.die();
      } else {
        Game.removeEntity(this);
      }
    }
  },
  attack: function (target) {
    var damage = this._power - target._defense;

    if (damage > 0) {
      console.log(this._name + ' attacks ' + target._name + ' for ' + damage
                  + ' hit points!');
      target.takeDamage(damage);
    } else {
      console.log(this._name + ' attacks ' + target._name + ' but has no effect!');
    }
  }
}
