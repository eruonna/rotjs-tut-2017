
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
Game.Glyph.NPC = new Game.Glyph('@', 'yellow');
Game.Glyph.LitFloor = new Game.Glyph('.', 'white');
Game.Glyph.DarkFloor = new Game.Glyph('.', 'grey');
Game.Glyph.LitWall = new Game.Glyph('\u2b22', 'white', 'black');
Game.Glyph.DarkWall = new Game.Glyph('\u2b22', 'grey', 'black');
