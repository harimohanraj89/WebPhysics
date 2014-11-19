// ========================================
//
//	 	RAIN SIMULATION
//
//
//		(c) 2013, HARIHARAN MOHANRAJ
//
// ========================================

var CHEIGHT   	= 800;
var CWIDTH    	= 1200;
var CSCALE		= 100;
var PHEIGHT		= CHEIGHT / CSCALE;
var PWIDTH		= CWIDTH  / CSCALE;

var DIRECTION = Math.PI / 8;
var PADDING = 0.2;
var GRAVITY		= 10;
var DELTA		= 0.01;
var FRAMERATE 	= 10 // milliseconds
var c;
var ctx;
var simulating	= false;
var t;
var spawnTime = 40;
var lastSpawned;
var rains = [];

window.onload = function () {
  c = document.getElementById("mainCanvas");
  c.width = CWIDTH;
  c.height = CHEIGHT;
  ctx = c.getContext("2d");
  MakeItRain();
}

MakeItRain = function () {
  lastSpawned = 0;
  SpawnDrop();
  requestAnimationFrame(UpdateRain);
}

SpawnDrop = function () {
  var pos = new Vec2(Math.random() * PWIDTH * (1 + PADDING) - (PWIDTH * PADDING) , PHEIGHT * (1 + PADDING));
  var g = new Vec2(Math.sin(DIRECTION), -1 * Math.cos(DIRECTION));
  g.Mult(GRAVITY * 0.0025);
  var rain = new Raindrop(0.05, pos, new Vec2(0, 0), g, 1, c);
  rains.push(rain);
}

// ------------------------
// 		  UTILIITES
// ------------------------
StartSimulation = function () {
  simulating = true;
}

StopSimulation = function () {
  simulating = false;
}

DrawRains = function () {
  rains.forEach(function(rain) {
    rain.Draw(ctx,CSCALE);
  });
}

ClearCanvas = function () {
  ctx.clearRect(0,0,c.width,c.height);
}

// ------------------------
// 		   UPDATES
// ------------------------

UpdateRain = function (time) {
  // Time calculations
  if (t === undefined) {
    t = time;
    delta = 0;
  } else {
    delta = time - t;
    t = time;
  }
  if (simulating) {

    // Spawn new raindrops
    if (time - lastSpawned > spawnTime) {
      SpawnDrop();
      lastSpawned = time;
    }

    // Cleaning up dead rain drops
    var cleanup = [];
    rains.forEach(function(rain, idx) {
      rain.Verlet(delta/1000);
      if (rain.position.y < 0) {
        cleanup.unshift(idx); // Push in reverse order so splice can work
      }
    });
    cleanup.forEach(function(rainIdx) {
      rains.splice(rainIdx, 1);
    });

    // Drawing
    ClearCanvas();
    DrawRains();
  }

  requestAnimationFrame(UpdateRain);
}

// ------------------------
// 		 COLLISIONS
// ------------------------
