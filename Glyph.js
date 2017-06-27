
Game.Glyph = function (ch, fg, bg) {
  this._ch = ch || ' ';
  this._fg = fg;
  this._bg = bg;
}

Game.Glyph.prototype.draw = function (ctx, x, y) {
  ctx.draw(x, y, this._ch, this._fg, this._bg);
}

Game.Glyph.Null = new Game.Glyph();
Game.Glyph.Player = new Game.Glyph('@', 'white', 'black');
Game.Glyph.NPC = new Game.Glyph('@', 'yellow', 'black');
