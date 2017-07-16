
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
      Console.log("Unknown component: " + components[i]);
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
  }
}

Game.Components.EnemyActor = {
  name: 'EnemyActor',
  init: function (obj, properties) {
    Game.Components.Actor.init(obj, properties);
    obj.interact = true;
  },
  act: function () {
    console.log('The ' + this._name + ' growls');
  }
}
