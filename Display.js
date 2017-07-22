
Game.Display = function (div, width, height) {
  this._div = div;

  this._displayOpts = {
    width: width,
    height: height,
    fontFamily: "FreeMono, monospace",
    layout: "hex",
    spacing: 0.56
  };

  this._console = new ROT.Display(this._displayOpts);
  var fontSize =
    this._console.computeFontSize(window.innerWidth, window.innerHeight);
  this._console.setOptions({fontSize: fontSize});

  this._div.appendChild(this._console.getContainer());
}

Game.Display.prototype.draw = function(x,y,ch,fg,bg) {
  this._console.draw(x,y,ch,fg,bg);
}

Game.Display.prototype.drawText = function (x, y, text) {
  this._console.drawText(x, y, text.split('').join(' '));
}

Game.Display.prototype.clear = function() {
  this._console.clear();
}

// XXX: width is the number of hexes rather than twice the number of hexes
// as in other places
Game.Display.prototype.drawBar = function (x, y, width, value, max, fg, bg) {
  var barWidth = Math.ceil(value / max * width);

  for (var i = 0; i < width; i++) {
    var bar = i < barWidth ? fg : bg;
    this.draw(x + 2*i, y, ' ', '', bar);
  }
}
