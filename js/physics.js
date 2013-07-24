/**
 * @author Hariharan Mohanraj
 */

var CHEIGHT   	= 800;
var CWIDTH    	= 1200; 
var SCALE		= 100;
var PHEIGHT		= CHEIGHT / SCALE;
var PWIDTH		= CWIDTH  / SCALE;
var RESTITUTION	= 0.8;
var DRESTITUTION= 0.4;
var GRAVITY		= new Vec2(0,-100);
var DELTA		= 0.01;
var FRAMERATE 	= 25 // milliseconds
var c;
var ctx;
var tickHandle;

var ballstarts = new Array();
var balls = new Array();

window.onload = function () {

	// Initial Conditions
	// ------------------
	ballstarts.push(new Vec2(2,6));
	ballstarts.push(new Vec2(10,5));
	// ------------------

	c = document.getElementById("mainCanvas");
	c.width = CWIDTH;
	c.height = CHEIGHT;
	ctx = c.getContext("2d");

	for (var i=0, len=ballstarts.length; i<len; i++)
	{
		balls.push(new Ball(1,ballstarts[i],1,c));
		balls[i].velocity.x = -(PHEIGHT/2 - balls[i].position.x);
	}

	UpdateForces();

	DrawBalls();
}


// ------------------------
// 		  UTILIITES
// ------------------------
StartSimulation = function () {
	tickHandle = setInterval("UpdateBalls()",FRAMERATE);
}

StopSimulation = function () {
	clearInterval(tickHandle);
}

ResetBalls = function () {

	StopSimulation();

	for (var i=0, len=balls.length; i<len; i++)
	{
		balls[i].position.Set(ballstarts[i]);
		balls[i].velocity.Set(new Vec2(-(PHEIGHT/2 - balls[i].position.x),0));
	}

	UpdateForces();

	DrawBalls();
}

DrawBalls = function () {
	ctx.clearRect(0,0,c.width,c.height);
	for (var i=0,len=balls.length; i<len; i++)
	{
		balls[i].Draw(ctx,SCALE);
	}
}

// ------------------------
// 		   UPDATES
// ------------------------

UpdateBalls = function () {
	for (var i=0,len=balls.length; i<len; i++)
	{
		balls[i].PreVerlet(DELTA);
	}
	
	UpdateForces();
	for (var i=0,len=balls.length; i<len; i++)
	{
		balls[i].PostVerlet(DELTA);
	}

	CheckWalls();
	DrawBalls();
}

UpdateForces = function () {
	for (var i=0,len=balls.length; i<len; i++)
	{
		balls[i].ResetForce();
		balls[i].AddForce(GRAVITY);
	}
}

// ------------------------
// 		 COLLISIONS
// ------------------------

CheckWalls = function () {
	for (var i=0,len=balls.length; i<len; i++)
	{
		// Bottom wall
		if (balls[i].position.y - balls[i].radius < 0 && balls[i].velocity.y < 0)
		{
			balls[i].position.y = balls[i].radius + DRESTITUTION * (balls[i].radius - balls[i].position.y);
			balls[i].velocity.y = (-1) * RESTITUTION * balls[i].velocity.y;
		}

		// Top wall
		if (balls[i].position.y + balls[i].radius > PHEIGHT && balls[i].velocity.y > 0)
		{
			console.log('OSIEJGH');
			balls[i].position.y = PHEIGHT + DRESTITUTION * (PHEIGHT - balls[i].position.y - balls[i].radius) - balls[i].radius;
			balls[i].velocity.y = (-1) * RESTITUTION * balls[i].velocity.y;
		}

		// Left wall
		if (balls[i].position.x < balls[i].radius && balls[i].velocity.x < 0)
		{
			balls[i].position.x = balls[i].radius + DRESTITUTION * (balls[i].radius - balls[i].position.x);
			balls[i].velocity.x = (-1) * RESTITUTION * balls[i].velocity.x;
		}

		// Right wall
		if (balls[i].position.x + balls[i].radius > PWIDTH && balls[i].velocity.x > 0)
		{
			balls[i].position.x = PWIDTH + DRESTITUTION * (PWIDTH - balls[i].position.x - balls[i].radius) - balls[i].radius;
			balls[i].velocity.x = (-1) * RESTITUTION * balls[i].velocity.x;
		}
	}
}