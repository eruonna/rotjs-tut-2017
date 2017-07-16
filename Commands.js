
Game.Command = function (cmd, data) {
  this._cmd = cmd;
  this._data = data;
}

Game.Command.prototype.run = function (entity) {
  if (this._cmd in Game.Command) {
    return Game.Command[this._cmd](entity, this._data);
  }
  return false;
}

Game.Command.move = function (entity, data) {
  if (entity.moveTo) {
    var x = entity._x + data.x, y = entity._y + data.y;
    var target = Game.getEntityAt(x, y);

    if (target && target.interact) {
      console.log('The ' + target._name + ' laughs at your puny efforts to attack it!');
      return true;
    }
    return entity.moveTo(x,y);
  }
}

Game.Keys = {}

Game.Keys.map = {}
Game.Keys.map[ROT.VK_H] = new Game.Command('move', {x: -2, y: 0});
Game.Keys.map[ROT.VK_U] = new Game.Command('move', {x: -1, y: -1});
Game.Keys.map[ROT.VK_I] = new Game.Command('move', {x: 1, y: -1});
Game.Keys.map[ROT.VK_K] = new Game.Command('move', {x: 2, y: 0});
Game.Keys.map[ROT.VK_M] = new Game.Command('move', {x: 1, y: 1});
Game.Keys.map[ROT.VK_N] = new Game.Command('move', {x: -1, y: 1});

Game.Keys.getKeyCommand = function (key) {
  if (key in Game.Keys.map) {
    return Game.Keys.map[key];
  }
  return false;
}
