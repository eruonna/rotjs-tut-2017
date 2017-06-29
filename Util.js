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

Game.Util.ring = function (center, radius, cb) {
  Game.Util._CubeCoords.ring(Game.Util._CubeCoords.fromDouble(center),
                             radius,
                             function (cube) { cb(cube.toDouble()); });
}
