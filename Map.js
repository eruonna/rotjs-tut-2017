
Game.Tile = function (properties) {
  this._litGlyph = properties.litGlyph || Game.Glyph.Null;
  this._darkGlyph = properties.darkGlyph || Game.Glyph.Null;
  this._blocked = properties.blocked || false;
  if (properties.blockSight === false) {
    this._blockSight = false;
  } else {
    this._blockSight = properties.blockSight || this._blocked;
  }
}

Game.Tile.prototype.isBlocked = function () {
  return this._blocked;
}

Game.Tile.prototype.blockSight = function () {
  return this._blockSight;
}

Game.Tile.Null = new Game.Tile({})
Game.Tile.Floor = new Game.Tile({
  litGlyph: Game.Glyph.LitFloor,
  darkGlyph: Game.Glyph.DarkFloor,
  blocked: false
})
Game.Tile.Wall = new Game.Tile({
  litGlyph: Game.Glyph.LitWall,
  darkGlyph: Game.Glyph.DarkWall,
  blocked: true,
  blockSight: true
})

Game.Map = function (width, height) {
  this._width = width;
  this._height = height;
  this._tiles = {};
  var tiles = this._tiles;
  this.foreachTile(function(t, x, y) {
    tiles[x+','+y] = Game.Tile.Floor;
  });

  this.setTile(60,22,Game.Tile.Wall);
  this.setTile(100,22,Game.Tile.Wall);
}

Game.Map.prototype.foreachTile = function (cb) {
  for (var y = 0; y < this._height; y++) {
    for (var x = y % 2; x < this._width; x+=2) {
      cb(this._tiles[x+','+y], x, y);
    }
  }
}

Game.Map.prototype.render = function (ctx) {
  this.foreachTile(function(tile, x, y) {
    tile._darkGlyph.draw(ctx, x, y);
  });
}

Game.Map.prototype.setTile = function (x, y, tile) {
  this._tiles[x+','+y] = tile;
}

Game.Map.prototype.getTile = function (x, y) {
  var ix = x+','+y;
  if (ix in this._tiles) {
    return this._tiles[ix];
  } else {
    return Game.Tile.Null;
  }
}
