
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

    var text = 'HP: ' + Game._player._hp + '/' + Game._player._maxHp,
        pct = Game._player._hp / Game._player._maxHp,
        color = pct > .75 ? 'green' : pct > .45 ? 'yellow' : 'red';
    ctx.drawBar(Game.properties.mapWidth, 2, Game.properties.barWidth,
      Game._player._hp, Game._player._maxHp, color, 'black');
    ctx.drawText(Game.properties.mapWidth, 0, text);

    Game.renderLog(ctx);
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

Game.Mode.dead = {
  enter: function () {
    console.log('You are dead');
  },
  exit: function () { },
  render: function (ctx) {
    ctx.clear();
    ctx.drawText(25, 25, "You have died");
    ctx.drawText(33, 27, "Press any key to try again");
  },
  handleInput: function () {
    Game.init();
  }
}
