
Game.Mode = {}

Game.Mode.playing = {
  enter: function () {
    Game._engine.start();
  },
  exit: function () {},
  render: function (ctx) {
    ctx.clear();
    Game._map.render(ctx, Game._player);

    for (var i = 0; i < Game._entities.length; i++) {
      var e = Game._entities[i];
      if (e.render && Game._map.getTile(e._x, e._y).lit) {
        e.render(ctx);
      }
    }
  },
  handleInput: function (ev) {
    switch (ev.type) {
      case 'keydown':
        var cmd = Game.Keys.getKeyCommand(ev.keyCode);
        if (cmd !== false) {
          ev.preventDefault();
          var result = cmd.run(Game._player);
          if (result) {
            Game._engine.unlock();
          }
          Game.render();
        }
        break;
    }
  }
}
