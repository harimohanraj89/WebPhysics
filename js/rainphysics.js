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
var splashes = [];
var dropRadius = 0.05;

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
  g.Mult(GRAVITY * dropRadius * dropRadius);
  var rain = new Raindrop(dropRadius, pos, new Vec2(0, 0), g, 1, c);
  rains.push(rain);
}

SpawnSplashes = function(position, speed) {

  for(var i = 0; i < 3; i++) {
    var pos = new Vec2(position.x , dropRadius);
    var g = new Vec2(0, -1);
    g.Mult(GRAVITY * dropRadius * dropRadius);
    var dir = Math.random() * Math.PI/2 + Math.PI/4;
    var vel = new Vec2(Math.cos(dir) * (Math.random()*0.4 + 0.8), Math.sin(dir) * (Math.random()*0.4 + 0.8));
    vel.Mult(speed / 5);
    var splash = new Splash(dropRadius, pos, vel, g, 1, c);
    splashes.push(splash);
  }
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

DrawSplashes = function () {
  splashes.forEach(function(splash) {
    splash.Draw(ctx,CSCALE);
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

    var cleanupDrops = [];
    var cleanupSplashes = [];

    // Updating
    rains.forEach(function(rain, idx) {
      rain.Verlet(delta/1000);
      if (rain.position.y < 0) {
        cleanupDrops.unshift(idx); // Push in reverse order so splice can work
      }
    });
    splashes.forEach(function(splash, idx) {
      splash.Verlet(delta/1000);
      if (splash.position.y < -0.5) {
        cleanupSplashes.unshift(idx); // Push in reverse order so splice can work
      }
    });

    // Cleaning up dead rain drops
    cleanupDrops.forEach(function(rainIdx) {
      SpawnSplashes(rains[rainIdx].position, rains[rainIdx].velocity.Magnitude());
      rains.splice(rainIdx, 1);
    });
    cleanupSplashes.forEach(function(splashIdx) {
      splashes.splice(splashIdx, 1);
    });

    // Drawing
    ClearCanvas();
    DrawRains();
    DrawSplashes();
  }

  requestAnimationFrame(UpdateRain);
}

// ------------------------
// 		 COLLISIONS
// ------------------------
