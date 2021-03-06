
Game.Glyph = function (ch, fg, bg) {
  this._ch = ch || ' ';
  this._fg = fg;
  this._bg = bg || 'black';
}

Game.Glyph.prototype.draw = function (ctx, x, y) {
  ctx.draw(x, y, this._ch, this._fg, this._bg);
}

Game.Glyph.Null = new Game.Glyph();
Game.Glyph.Player = new Game.Glyph('@', 'white');
Game.Glyph.Blob = new Game.Glyph('B', 'green');
Game.Glyph.Rat = new Game.Glyph('r', 'brown');
Game.Glyph.NPC = new Game.Glyph('@', 'yellow');
Game.Glyph.LitFloor = new Game.Glyph('\u00b7', 'grey');
Game.Glyph.DarkFloor = new Game.Glyph('\u00b7', '#222');
Game.Glyph.LitWall = new Game.Glyph('\u2b22', 'white', 'black');
Game.Glyph.DarkWall = new Game.Glyph('\u2b22', 'grey', 'black');
Game.Glyph.LitWater = new Game.Glyph('~', 'white', '#08f');
Game.Glyph.DarkWater = new Game.Glyph('~', 'grey', '#024');
Game.Glyph.LitUpStair = new Game.Glyph('<', 'white');
Game.Glyph.DarkUpStair = new Game.Glyph('<', 'grey');
Game.Glyph.LitDownStair = new Game.Glyph('>', 'white');
Game.Glyph.DarkDownStair = new Game.Glyph('>', 'grey');
Game.Glyph.LitBridge = new Game.Glyph('=', 'grey', '#a04000');
Game.Glyph.DarkBridge = new Game.Glyph('=', 'grey', '#6e2c00');
Game.Glyph.LitMud = new Game.Glyph('\u00b7', '#4c4207', '#bba211');
Game.Glyph.DarkMud = new Game.Glyph('\u00b7', 'grey', '#4c4207');
Game.Glyph.LitSwampGrass = new Game.Glyph('\u3003', '#a8e206');
Game.Glyph.DarkSwampGrass = new Game.Glyph('\u3003', '#547103');
Game.Glyph.LitSwampWater = new Game.Glyph('~', 'white', '#0c4');
Game.Glyph.DarkSwampWater = new Game.Glyph('~', 'grey', '#041');
Game.Glyph.Marker = new Game.Glyph(' ', '', 'magenta');
