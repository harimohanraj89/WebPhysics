/**
 * @author Hariharan Mohanraj
 */

var BOXHEIGHT = 8;
var BOXWIDTH  = 12;
var GRAVITY   = new Vec2(0,-100);
var DELTA     = 0.01;

var c;
var ctx;
var ball1;
var ball2;

window.onload = function () {

	c = document.getElementById("mainCanvas");
	c.width = 1200;
	c.height = 800;
	ctx = c.getContext("2d");

	ball1 = new Ball(1,new Vec2(2,6),1,c);
	ball2 = new Ball(1,new Vec2(10,5),1,c);

	ball1.Draw(ctx,100);
	ball2.Draw(ctx,100);

	UpdateForces();

	console.log(GRAVITY);
	console.log(ball1);
	console.log(ball2);
}

UpdateBalls = function () {
	ball1.PreVerlet(DELTA);
	ball2.PreVerlet(DELTA);

	UpdateForces();

	ball1.PostVerlet(DELTA);
	ball2.PostVerlet(DELTA);

	ctx.clearRect(0,0,c.width,c.height);
	ball1.Draw(ctx,100);
	ball2.Draw(ctx,100);
}

UpdateForces = function () {
	ball1.ResetForce();
	ball2.ResetForce();
	ball1.AddForce(GRAVITY);
	ball2.AddForce(GRAVITY);
}