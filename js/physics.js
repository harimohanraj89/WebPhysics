/**
 * @author Hariharan Mohanraj
 */

var CHEIGHT   	= 800;
var CWIDTH    	= 1200; 
var SCALE		= 100;
var PHEIGHT		= CHEIGHT / SCALE;
var PWIDTH		= CWIDTH  / SCALE;
var RESTITUTION	= 0.95;
var DRESTITUTION= 0.1;
var GRAVITY		= new Vec2(0,-100);
var DELTA		= 0.01;
var FRAMERATE 	= 10 // milliseconds
var c;
var ctx;
var tickHandle	= false;

var ballstartsx = new Array();
var ballstartsy = new Array();
var balls = new Array();

// Collision variables
var ball1;
var ball2;
var normal;
var vel1n;
var vel2n;
var vel1nn;
var vel2nn;
var vel1t;
var vel2t;

window.onload = function () {

	// Initial Conditions
	// ------------------
	ballstartsx = [2,9, 7];
	ballstartsy = [3, 5, 6];
	ballstartsr = [1, 0.5, 0.25];
	// ------------------
	console.log(ballstartsx);
	c = document.getElementById("mainCanvas");
	c.width = CWIDTH;
	c.height = CHEIGHT;
	ctx = c.getContext("2d");

	for (var i=0, len=ballstartsx.length; i<len; i++)
	{
		balls.push(new Ball(ballstartsr[i], new Vec2(ballstartsx[i],ballstartsy[i]), 1, c));
		balls[i].velocity.x = -(PWIDTH/2 - balls[i].position.x);
	}

	UpdateForces();

	DrawBalls();

	console.log(balls);
}


// ------------------------
// 		  UTILIITES
// ------------------------
StartSimulation = function () {
	if (!tickHandle) {
		tickHandle = setInterval("UpdateBalls()",FRAMERATE);	
	}
}

StopSimulation = function () {
	clearInterval(tickHandle);
	tickHandle = false;
}

ResetBalls = function () {

	StopSimulation();

	for (var i=0, len=balls.length; i<len; i++)
	{
		balls[i].SetPos(ballstartsx[i],ballstartsy[i]);
		balls[i].SetVel(-(PHEIGHT/2 - balls[i].position.x),0);
		balls[i].position.Display();
		balls[i].velocity.Display();
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
	CheckBalls();
	CheckWalls();
	DrawBalls();
}

UpdateForces = function () {
	for (var i=0,len=balls.length; i<len; i++)
	{
		balls[i].ResetForce();
		balls[i].AddForce(Vec2.Mult(GRAVITY, 1/balls[i].imass));
	}
}

// ------------------------
// 		 COLLISIONS
// ------------------------

CheckBalls = function () {
	for (var one=0,len=balls.length; one<len; one++) {
		for (var two=one+1; two<len; two++) {

			// Ball-to-ball collision check
			if (Vec2.Sub(balls[one].position,balls[two].position).SqrMagnitude() < (balls[one].radius + balls[two].radius) * (balls[one].radius + balls[two].radius) ) {
				
				ball1 = balls[one];
				ball2 = balls[two];
				normal = (Vec2.Sub(ball2.position, ball1.position)).Normalized();

				if (Vec2.Dot(normal ,Vec2.Sub(ball2.velocity, ball1.velocity)) < 0)
				{
					vel1n = ball1.velocity.Project(normal);
					vel2n = ball2.velocity.Project(normal);
					
					vel1t = Vec2.Sub(ball1.velocity,vel1n);
					vel2t = Vec2.Sub(ball2.velocity,vel2n);

					vel1nn = Vec2.Add(vel1n, Vec2.Mult(Vec2.Sub(vel2n, vel1n), 2*ball1.imass/(ball1.imass + ball2.imass)));
					vel2nn = Vec2.Add(vel2n, Vec2.Mult(Vec2.Sub(vel1n, vel2n), 2*ball2.imass/(ball2.imass + ball1.imass)));

					vel1n.Set(vel1nn);
					vel2n.Set(vel2nn);

					vel1n.Mult(RESTITUTION);
					vel2n.Mult(RESTITUTION);

					vel1t.Add(vel1n);
					vel2t.Add(vel2n);

					ball1.SetVel(vel1t.x, vel1t.y);
					ball2.SetVel(vel2t.x, vel2t.y);
				}
			}
		}
	}
}

CheckWalls = function () {
	for (var i=0,len=balls.length; i<len; i++)
	{
		// Bottom wall
		if (balls[i].position.y - balls[i].radius < 0 && balls[i].velocity.y < 0)
		{
			balls[i].position.y = balls[i].radius + DRESTITUTION * (balls[i].position.y - balls[i].radius);
			balls[i].velocity.y = (-1) * RESTITUTION * balls[i].velocity.y;
		}

		// Top wall
		if (balls[i].position.y + balls[i].radius > PHEIGHT && balls[i].velocity.y > 0)
		{
			balls[i].position.y = (PHEIGHT - balls[i].radius) - DRESTITUTION * (PHEIGHT - balls[i].position.y - balls[i].radius);
			balls[i].velocity.y = (-1) * RESTITUTION * balls[i].velocity.y;
		}

		// Left wall
		if (balls[i].position.x < balls[i].radius && balls[i].velocity.x < 0)
		{
			balls[i].position.x = balls[i].radius + DRESTITUTION * (balls[i].position.x - balls[i].radius);
			balls[i].velocity.x = (-1) * RESTITUTION * balls[i].velocity.x;
		}

		// Right wall
		if (balls[i].position.x + balls[i].radius > PWIDTH && balls[i].velocity.x > 0)
		{
			balls[i].position.x = (PWIDTH - balls[i].radius) - DRESTITUTION * (PWIDTH - balls[i].position.x - balls[i].radius);
			balls[i].velocity.x = (-1) * RESTITUTION * balls[i].velocity.x;
		}
	}
}