
Game.Command = function (cmd, data) {
  this._cmd = cmd;
  this._data = data;
}

Game.Command.prototype.run = function (entity) {
  if (this._cmd in Game.Command) {
    Game.Command[this._cmd](entity, this._data);
  }
}

Game.Command.move = function (entity, data) {
  if (entity.moveTo) {
    entity.moveTo(entity._x + data.x, entity._y + data.y);
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
