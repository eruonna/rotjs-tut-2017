
Game.Display = function (div) {
  this._div = div;

  this._displayOpts = {
    width: 160,
    height: 50,
    layout: "hex"
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
