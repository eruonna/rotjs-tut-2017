
Game.Generator = function (width, height) {
  this._width = width;
  this._height = height;
  this._map = {};

  for (var y = 0; y < height; y++) {
    for (var x = y%2; x < width; x+=2) {
      this._map[x+','+y] = Game.Tile.Wall;
    }
  }
}

Game.Generator.prototype.compute = function (place) {
  this.generate();
  this.pickEntrance();

  for (var y = 0; y < this._height; y++) {
    for (var x = y%2; x < this._width; x+=2) {
      place(x, y, this._map[x+','+y]);
    }
  }

  place(this._entrance.x, this._entrance.y, Game.Tile.UpStair);
}

Game.Generator.prototype.pickEntrance = function () {
  var candidates = [];
  for (var y = 0; y < this._height; y++) {
    for (var x = y % 2; x < this._width; x+=2) {
      if (this._map[x+','+y] === Game.Tile.Floor) {
        candidates.push({x: x, y: y});
      }
    }
  }
  this._entrance = candidates.random();
}

Game.Generator.prototype.pickRoom = function (rooms) {
  var choices = {};
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].weight) {
      choices[i] = rooms[i].weight;
    }
  }
  var room = rooms[ROT.RNG.getWeightedValue(choices)], props = {};
  for (var idx in room.props) {
    props[idx] = room.props[idx].random();
  }
  return new Game.Generator.Room(room.type, props);
}

Game.Generator.prototype.pickCoords = function (room) {
  return Game.Util.roundHex({
    x: ROT.RNG.getUniform() * (this._width - room._width - 3) + 2,
    y: ROT.RNG.getUniform() * (this._height - room._height - 2) + 1});
}

Game.Generator.prototype.generate = function () {
  var firstRooms =
    [ { type: 'Star', weight: 1, props: {
          maxRadius: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] } }
    , { type: 'Rect', weight: 1, props: {
          width: [6, 8, 10, 12, 14, 16, 18],
          height: [3, 4, 5, 6, 7, 8, 9] } }
    , { type: 'Hex', weight: 1, props: {
          size: [2, 3, 4, 5, 6, 7] } }
    ]
  var rooms =
    [ { type: 'Star', weight: 3, props: {
          maxRadius: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] } }
    , { type: 'Rect', weight: 2, props: {
          width: [6, 8, 10, 12, 14, 16, 18],
          height: [3, 4, 5, 6, 7, 8, 9] } }
    , { type: 'Hex', weight: 2, props: {
          size: [2, 3, 4, 5, 6, 7] } }
    , { type: 'Hall', weight: 1, props: {
          length: [4, 5, 6, 7, 8, 9, 10],
          dir: [0, 1, 2] } }
    , { type: 'Tunnel', weight: 3, props: {
          length: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] } }
    ];
  var lakes =
    [ { type: 'Star', weight: 1, props: {
          maxRadius: [10, 11, 12, 13, 14, 15, 16] } }
    ];

  this._keypoints = [];
  this._digCount = 0;

  var started = false;
  while (!started) {
    var firstRoom = this.pickRoom(firstRooms);
    var pt = this.pickCoords(firstRoom);
    started = this.tryRoom(firstRoom, pt, true);
  }

  var room = {};
  var count = 0;
  while (this._digCount < 0.2 * this._width * this._height) {
    for (var i = 0; i < 60; i++) {
      room = this.pickRoom(rooms);
      if (this._keypoints.length > 0) {
        var idx = Math.floor(ROT.RNG.getUniform() * this._keypoints.length);
        pt = this._keypoints[idx];
      } else {
        pt = this.pickCoords(room);
      }
      if (this.tryRoom(room, pt, false)) {
        this._keypoints.splice(idx, 1);
        count++;
      }
    }
  }

  var map = this._map;
  var lake = this.pickRoom(lakes);
  pt = this.pickCoords(lake);
  lake.place(pt.x, pt.y, function(x, y, val) {
    if (val === 1) {
      map[x+','+y] = Game.Tile.Water;
    }
  });
}

Game.Generator.prototype.tryRoom = function (room, start, first) {
  var map = this._map;
  var pt = { x: start.x, y: start.y };

  var isCarved = function (x, y) {
    var idx = x+','+y;
    return (idx in map) && !map[idx].isBlocked();
  }

  var slide = [
    { x: 1, y: 1 },
    { x: 2, y: 0 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
    { x: -2, y: 0 },
    { x: -1, y: 1 }].random();

  while (2 <= pt.x && pt.x < this._width - room._width - 1
      && 1 <= pt.y && pt.y < this._height - room._height - 1) {
    if (first || room.placeable(pt.x, pt.y, isCarved)) {
      var gen = this;
      room.place(pt.x, pt.y, function (x, y, val) {
        if (val === 1) {
          map[x+','+y] = Game.Tile.Floor;
          gen._digCount++;
        }
      });
      var keypoints = this._keypoints;
      room.keypoints().forEach(function (p) {
        keypoints.push({x: p.x + pt.x, y: p.y + pt.y});
      });
      return true;
    }
    pt.x += slide.x; pt.y += slide.y;
  }

  return false;
}

Game.Generator.Room = function (type, props) {
  if (type in Game.Generator.Room) {
    return new Game.Generator.Room[type](props);
  }
}

Game.Generator.Room.prototype._get = function (x, y) {
  var xMin = this._xMin || 0, yMin = this._yMin || 0;
  var rx = x + xMin, ry = y + yMin;
  var idx = rx+','+ry;
  if (idx in this._room) {
    return this._room[idx].val;
  } else {
    return 0;
  }
}

Game.Generator.Room.prototype.placeable = function (x, y, isCarved) {
  var onBoundary = false;
  for (var ry = 0; ry < this._height; ry++) {
    for (var rx = ry % 2; rx < this._width; rx+=2) {
      if (this._get(rx, ry) === 1) {
        if (isCarved(x+rx, y+ry)) {
          return false;
        }
        Game.Util.neighbors({x: x+rx, y: y+ry}).map(function (pt) {
          if (isCarved(pt.x, pt.y)) { onBoundary = true; } });
      }
    }
  }
  return onBoundary;
}

Game.Generator.Room.prototype.place = function (x, y, carve) {
  for (var ry = 0; ry < this._height; ry++) {
    for (var rx = ry % 2; rx < this._width; rx+=2) {
      var val = this._get(rx, ry);
      if (val) {
        carve(x+rx, y+ry, val);
      }
    }
  }
}

Game.Generator.Room.prototype.keypoints = function () {
  var xMin = this._xMin || 0, yMin = this._yMin || 0;
  return this._keypoints.map(function(pt) {
    return {x: pt.x - xMin, y: pt.y - yMin};
  });
}

Game.Generator.Room.Rect = function (props) {
  var width = props.width, height = props.height;
  this._width = width;
  this._height = height;
  this._room = {};
  this._keypoints = [];

  for (var y = 0; y < height; y++) {
    for (var x = y%2; x < width; x+=2) {
      this._room[x+','+y] = { val: 1 };
      if (y == 0 || y == height-1 || x <= 1 || x >= width-2) {
        this._keypoints.push({x: x, y: y});
      }
    }
  }
}

Game.Generator.Room.Rect.extend(Game.Generator.Room);

Game.Generator.Room.Hex = function (props) {
  var size = props.size;
  this._width = 4*size - 2;
  this._height = 2*size - 1;
  this._room = {};
  this._keypoints = [];

  var xMin = 0, yMin = 0;
  var room = this._room;
  var keypoints = this._keypoints;
  for (var r = 0; r < size; r++) {
    Game.Util.ring({ x: 0, y: 0 }, r, function (pt) {
      room[pt.x+','+pt.y] = { val: 1 };
      if (pt.x < xMin) xMin = pt.x;
      if (pt.y < yMin) yMin = pt.y;
      if (r == size-1) {
        keypoints.push({x: pt.x, y: pt.y});
      }
    });
  }
  this._room['0,0'] = { val: 1 };
  this._xMin = xMin - (xMin+yMin)%2;
  this._yMin = yMin;
  this._width += 2*((xMin+yMin)%2);
}

Game.Generator.Room.Hex.extend(Game.Generator.Room);

Game.Generator.Room.Star = function (props) {
  var maxRadius = props.maxRadius;
  var xMin = 0, xMax = 0, yMin = 0, yMax = 0;

  this._room = {};
  this._keypoints = [];
  var room = this._room;
  var keypoints = this._keypoints;

  var center = { x: 0, y: 0 };

  var lightPasses = function (x, y) {
    var r = Game.Util.hexDist(center, {x:x,y:y});
    var lim = 2 - maxRadius/(r+1);
    var ret = ROT.RNG.getUniform() > lim;
    if (ret) {
      keypoints.push({x: x, y: y});
    }
    return ret;
  }

  var fov = new ROT.FOV.PreciseShadowcasting(lightPasses, {topology:6});

  fov.compute(0,0,maxRadius, function (x, y) {
    room[x+','+y] = { val: 1 };
    if (x < xMin) {
      xMin = x;
    } else if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    } else if (y > yMax) {
      yMax = y;
    }
  });

  xMin -= (xMin+yMin) % 2;
  this._xMin = xMin;
  this._yMin = yMin;
  this._width = xMax - xMin + 1;
  this._height = yMax - yMin + 1;
}

Game.Generator.Room.Star.extend(Game.Generator.Room);

Game.Generator.Room.Hall = function (props) {
  var delta = ([{ x: 1, y: -1 }, { x: 2, y: 0 }, { x: 1, y: 1 }])[props.dir];
  this._width = delta.x * props.length;
  this._height = delta.y ? props.length : 1;
  this._yMin = delta.y < 0 ? 1-props.length : 0;

  this._room = {};
  this._keypoints = [{x: 0, y: 0}];
  var x = 0, y = 0;
  for (var i = 0; i < props.length; i++) {
    this._room[x+','+y] = { val: 1 };
    x += delta.x; y += delta.y;
  }
  this._keypoints.push({x: x-delta.x, y: y-delta.y});
}

Game.Generator.Room.Hall.extend(Game.Generator.Room);

Game.Generator.Room.Tunnel = function (props) {
  this._room = {};
  var xMin = 0, xMax = 0, yMin = 0, yMax = 0;
  var delta = [ { x: 1, y: -1 }
              , { x: 2, y: 0 }
              , { x: 1, y: 1 }
              , { x: -1, y: 1 }
              , { x: -2, y: 0 }
              , { x: -1, y: -1 }
              ].random();
  var turns = { 'straight': 2, 'left': 1, 'right': 1 };
  var x = 0, y = 0;

  this._keypoints = [{x: 0, y: 0}];
  for (var i = 0; i < props.length; i++) {
    this._room[x+','+y] = { val: 1 }

    if (x < xMin) {
      xMin = x;
    } else if (x > xMax) {
      xMax = x;
    }
    if (y < yMin) {
      yMin = y;
    } else if (y > yMax) {
      yMax = y;
    }

    if (i == props.length - 1) {
      this._keypoints.push({x: x, y: y});
    }

    x += delta.x; y += delta.y;

    switch (ROT.RNG.getWeightedValue(turns)) {
      case 'straight':
        break;
      case 'left':
        delta = Game.Util.rotateLeft(delta);
        break;
      case 'right':
        delta = Game.Util.rotateRight(delta);
        break;
    }
  }

  this._width = xMax - xMin + 1;
  this._height = yMax - yMin + 1;
  this._xMin = xMin; this._yMin = yMin;
}

Game.Generator.Room.Tunnel.extend(Game.Generator.Room);
