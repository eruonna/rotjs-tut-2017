
Game.Display = function (div, width, height) {
  this._div = div;

  this._displayOpts = {
    width: width,
    height: height,
    fontFamily: "FreeMono, monospace",
    layout: "hex",
    spacing: 0.75
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

Game.Display.prototype.clear = function() {
  this._console.clear();
}
