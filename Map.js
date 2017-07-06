
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
Game.Tile.Water = new Game.Tile({
  litGlyph: Game.Glyph.LitWater,
  darkGlyph: Game.Glyph.DarkWater,
  blocked: true,
  blockSight: false
})
Game.Tile.UpStair = new Game.Tile({
  litGlyph: Game.Glyph.LitUpStair,
  darkGlyph: Game.Glyph.DarkUpStair,
  blocked: false,
  blockSight: false
})

Game.Map = function (width, height) {
  this._width = width;
  this._height = height;
  this._tiles = {};
  var tiles = this._tiles;
  this.foreachTile(function(t, x, y) {
    tiles[x+','+y] = { tile: Game.Tile.Floor,
                       seen: false };
  });

  var gen = new Game.Generator(width, height);
  gen.compute(function (x, y, t) {
    tiles[x+','+y].tile = t;
  });
  this._upStair = gen._entrance;
}

Game.Map.prototype.foreachTile = function (cb) {
  for (var y = 0; y < this._height; y++) {
    for (var x = y % 2; x < this._width; x+=2) {
      cb(this._tiles[x+','+y], x, y);
    }
  }
}

Game.Map.prototype.render = function (ctx, player) {
  this.foreachTile(function(t, x, y) {
    t.lit = false;
    if (t.seen) {
      t.tile._darkGlyph.draw(ctx, x, y);
    }
  });

  var tiles = this._tiles;
  var lightPasses = function (x, y) {
    var idx = x+','+y;
    return (idx in tiles) && !tiles[idx].tile.blockSight();
  }
  var fov = new ROT.FOV.PreciseShadowcasting(lightPasses, {topology: 6});

  fov.compute(player._x, player._y, 160, function(x, y) {
    var idx = x+','+y;
    if (idx in tiles) {
      tiles[idx].tile._litGlyph.draw(ctx, x, y);
      tiles[idx].lit = true;
      tiles[idx].seen = true;
    }
  });
}

Game.Map.prototype.setTile = function (x, y, tile) {
  this._tiles[x+','+y].tile = tile;
}

Game.Map.NullTile = {
  tile: Game.Tile.Null,
}

Game.Map.prototype.getTile = function (x, y) {
  var ix = x+','+y;
  if (ix in this._tiles) {
    return this._tiles[ix];
  } else {
    return Game.Map.NullTile;
  }
}
