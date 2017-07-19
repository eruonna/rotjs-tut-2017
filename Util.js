Game.Util = {}

Game.Util._CubeCoords = function (x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Game.Util._CubeCoords.fromDouble = function (coords) {
  return new Game.Util._CubeCoords((coords.y - coords.x) / 2,
                                   (coords.y + coords.x) / 2,
                                   -coords.y);
}

Game.Util._CubeCoords.prototype.toDouble = function () {
  return { x: this.y - this.x,
           y: -this.z };
}

Game.Util._CubeCoords.dirs = [
  new Game.Util._CubeCoords(1, -1, 0),
  new Game.Util._CubeCoords(0, -1, 1),
  new Game.Util._CubeCoords(-1, 0, 1),
  new Game.Util._CubeCoords(-1, 1, 0),
  new Game.Util._CubeCoords(0, 1, -1),
  new Game.Util._CubeCoords(1, 0, -1) ]

Game.Util._CubeCoords.prototype.scale = function (r) {
  return new Game.Util._CubeCoords(this.x * r, this.y * r, this.z * r);
}

Game.Util._CubeCoords.prototype.add = function (other) {
  return new Game.Util._CubeCoords(this.x + other.x,
                                   this.y + other.y,
                                   this.z + other.z);
}

Game.Util._CubeCoords.prototype.rotateLeft = function () {
  return new Game.Util._CubeCoords(this.x + this.z,
                                   this.x + this.y,
                                   this.y + this.z);
}

Game.Util._CubeCoords.prototype.rotateRight = function () {
  return new Game.Util._CubeCoords(this.x + this.y,
                                   this.y + this.z,
                                   this.x + this.z);
}

Game.Util._CubeCoords.prototype.neighbors = function() {
  return Game.Util._CubeCoords.dirs.map(this.add.bind(this));
}

Game.Util._CubeCoords.ring = function (center, radius, cb) {
  var dirs = Game.Util._CubeCoords.dirs;

  var pt = center.add(dirs[4].scale(radius));

  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < radius; j++) {
      cb(pt);
      pt = pt.add(dirs[i]);
    }
  }
}

Game.Util._CubeCoords.prototype.round = function () {
  var rx = Math.round(this.x);
  var ry = Math.round(this.y);
  var rz = Math.round(this.z);

  var dx = Math.abs(rx - this.x);
  var dy = Math.abs(ry - this.y);
  var dz = Math.abs(rz - this.z);

  if (dx > dy && dx > dz) {
    rx = - ry - rz;
  } else if (dy > dz) {
    ry = - rx - rz;
  } else {
    rz = - rx - ry;
  }

  return new Game.Util._CubeCoords(rx, ry, rz);
}

Game.Util._CubeCoords.prototype.dist = function (other) {
  return (Math.abs(this.x - other.x)
        + Math.abs(this.y - other.y)
        + Math.abs(this.z - other.z)) / 2;
}

Game.Util.ring = function (center, radius, cb) {
  Game.Util._CubeCoords.ring(Game.Util._CubeCoords.fromDouble(center),
                             radius,
                             function (cube) { cb(cube.toDouble()); });
}

Game.Util.hexDist = function (pt1, pt2) {
  return Game.Util._CubeCoords.fromDouble(pt1)
             .dist(Game.Util._CubeCoords.fromDouble(pt2));
}

Game.Util.neighbors = function (pt) {
  return Game.Util._CubeCoords.fromDouble(pt).neighbors()
             .map(function (coords) { return coords.toDouble(); });
}

Game.Util.roundHex = function (pt) {
  return Game.Util._CubeCoords.fromDouble(pt).round().toDouble();
}

Game.Util.rotateLeft = function (pt) {
  return Game.Util._CubeCoords.fromDouble(pt).rotateLeft().toDouble();
}

Game.Util.rotateRight = function (pt) {
  return Game.Util._CubeCoords.fromDouble(pt).rotateRight().toDouble();
}

Game.Util.floodFill = function (pt, passes, visit) {
  if (!passes(pt)) return;
  visit(pt);
  var visited = {};
  visited[pt.x+','+pt.y] = true;
  var fringe = [pt];

  while (fringe.length > 0) {
    pt = fringe.pop();
    var neighbors = Game.Util.neighbors(pt);
    for (var i = 0; i < neighbors.length; i++) {
      var n = neighbors[i];
      if (!visited[n.x+','+n.y] && passes(n)) {
        visit(n);
        visited[n.x+','+n.y] = true;
        fringe.push(n);
      }
    }
  }
}

Game.Util.pickRandomProps = function (choices) {
  var weighted = {};
  for (var i = 0; i < choices.length; i++) {
    if (choices[i].weight) {
      weighted[i] = choices[i].weight;
    }
  }
  var choice = choices[ROT.RNG.getWeightedValue(weighted)], props = {};
  for (var idx in choice.props) {
    if (typeof choice.props[idx] === 'object'
        && 'random' in choice.props[idx]) {
      props[idx] = choice.props[idx].random();
    } else {
      props[idx] = choice.props[idx];
    }
  }

  var ret = {};
  for (idx in choice) {
    if (idx != 'props') {
      ret[idx] = choice[idx];
    }
  }
  ret.props = props;

  return ret;
}
