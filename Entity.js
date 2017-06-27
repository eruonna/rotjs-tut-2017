
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
    this._x = x;
    this._y = y;
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
