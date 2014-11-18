// ========================================
//
//	 	VERLET IMPLEMENTATIONS OF BALLS
// 		IN A BOX
//
//		(c) 2013, HARIHARAN MOHANRAJ
//
// ========================================

var CHEIGHT   	= 800;
var CWIDTH    	= 1200;
var CSCALE		= 100;
var ASCALE 		= 50;
var PHEIGHT		= CHEIGHT / CSCALE;
var PWIDTH		= CWIDTH  / CSCALE;

var DIRECTION = Math.PI / 8;
var GRAVITY		= 15;
var DELTA		= 0.01;
var FRAMERATE 	= 10 // milliseconds
var c;
var ctx;
var tickHandle	= false;

var rain;

window.onload = function () {

  c = document.getElementById("mainCanvas");
  c.width = CWIDTH;
  c.height = CHEIGHT;
  ctx = c.getContext("2d");

  rain = new Raindrop(0.04, new Vec2(Math.random() * PWIDTH, PHEIGHT), new Vec2(0, 0), 1, c);
  g = new Vec2(Math.sin(DIRECTION), -1 * Math.cos(DIRECTION));
  g.Mult(GRAVITY * 0.0016);
  rain.AddForce(g);
  tickHandle = setInterval("UpdateRain()",FRAMERATE);
}


// ------------------------
// 		  UTILIITES
// ------------------------
StartSimulation = function () {
}

StopSimulation = function () {
}

ResetBalls = function () {
}

DrawRain = function () {
  rain.Draw(ctx,CSCALE);
}

ClearCanvas = function () {
  ctx.clearRect(0,0,c.width,c.height);
}

// ------------------------
// 		   UPDATES
// ------------------------

UpdateRain = function () {
  ClearCanvas();

  rain.PreVerlet(DELTA);
  rain.PostVerlet(DELTA);

  DrawRain();
}

// ------------------------
// 		 COLLISIONS
// ------------------------
