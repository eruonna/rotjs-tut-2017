
Game = {}

Game.properties = {
  mapWidth: 160,
  mapHeight: 50,
  barWidth: 10,
  logHeight: 3
}

Game.initialized = false
Game.fontsLoaded = false

Game.init = function() {
  Game._div = document.getElementById("game");

  if (!("ROT" in window)) {
    Game._div.innerHTML = "Failed to load rot.js :-(";
    return;
  }

  if (!ROT.isSupported()) {
    Game._div.innerHTML = "Rot.js is not supported in your browser :-(";
    return;
  }

  //ROT.RNG.setSeed(1500009600743);
  console.log(ROT.RNG.getSeed());

  Game._div.innerHTML = "";

  Game._scheduler = new ROT.Scheduler.Simple();
  Game._engine = new ROT.Engine(Game._scheduler);

  Game._mode = null;
  Game._entities = [];

  Game._display = new Game.Display(Game._div,
    Game.properties.mapWidth + 2*Game.properties.barWidth,
    Game.properties.mapHeight + 2*Game.properties.logHeight);

  Game._map = new Game.Map(Game.properties.mapWidth, Game.properties.mapHeight);

  Game._player = new Game.Entity({
    x: Game._map._upStair.x,
    y: Game._map._upStair.y,
    name: 'player',
    glyph: Game.Glyph.Player,
    maxHp: 30,
    defense: 2,
    power: 5
  }, ['Position', 'Renderable', 'Fighter', 'PlayerActor']);

  Game.addEntity(Game._player);

  Game._log = [];

  Game.initialized = true;
  Game.run();
};

Game.run = function() {
  if (!Game.fontsLoaded) { return; }
  if (!Game.initialized) { Game.init(); }
  window.addEventListener('keydown', Game.handleEvent);
  Game.switchMode(Game.Mode.playing);
  Game.render();
};

Game.render = function() {
  if (Game._mode !== null) {
    Game._mode.render(Game._display);
  }
}

Game.update = function() {
}

Game.handleEvent = function (ev) {
  if (Game._mode !== null) {
    Game._mode.handleInput(ev);
  }
}

Game.switchMode = function (newMode) {
  if (Game._mode !== null) {
    Game._mode.exit();
  }

  Game._mode = newMode;

  if (Game._mode !== null) {
    Game._mode.enter();
    Game._mode.render(Game._display);
  }
}

Game.addEntity = function (e) {
  Game._entities.push(e);
  if (e.act) {
    Game._scheduler.add(e, true);
  }
}

Game.removeEntity = function (e) {
  var i = Game._entities.indexOf(e);
  if (i >= 0) Game._entities.splice(i, 1);

  if (e.act) {
    Game._scheduler.remove(e);
  }
  if (e === Game._player) {
    // Since the player is no longer on the schedule, lock the engine
    Game._engine.lock();
  }
}

Game.getEntityAt = function (x, y) {
  for (var i = 0; i < Game._entities.length; i++) {
    if (Game._entities[i]._x === x && Game._entities[i]._y === y) {
      return Game._entities[i];
    }
  }
  return false;
}

Game.log = function (msg) {
  Game._log.push(msg);
}

Game.renderLog = function (ctx) {
  var msgs = Game._log.slice(-Game.properties.logHeight);
  for (var i = 0; i < msgs.length; i++) {
    ctx.drawText(0, Game.properties.mapHeight + 2*i, msgs[i]);
  }
}
