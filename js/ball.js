/**
 * @author Hariharan Mohanraj
 */
// ========================================
// 
//	  PHYSICS BALL JAVASCRIPT LIBRARY
//		
//		(c)2013, HARIHARAN MOHANRAJ
// 
// 	*****   Requires Vec2 Library   *****

// ========================================

// ------------------------
// 		Constructor
// ------------------------

function Ball (argRadius, argPosition, canvas) {
	this.radius 		= argRadius;
	this.position 		= argPosition;
	this.velocity 		= new Vec2(0,0);
	this.force 			= new Vec2(0,0);
	this.nextforce 		= new Vec2(0,0);
	this.canvasWidth	= canvas.width;
	this.canvasHeight	= canvas.height;
}

// ------------------------
// 		Object Methods
// ------------------------

Ball.prototype.SetPos = function (argPos) {
	this.position.Set(argPos);
}

Ball.prototype.SetVel = function (argVel) {
	this.velocity.Set(argVel);
}

Ball.prototype.ResetForce = function () {
	this.force.Mult(0);
}

Ball.prototype.AddForce = function (argForce) {
	this.force = this.force.Add(argForce);
}

Ball.prototype.Draw = function (ctx, scale) {
	ctx.fillStyle="#444";
	ctx.beginPath();
	ctx.arc(Math.round(this.position.x*scale), this.canvasHeight - Math.round(this.position.y*scale), this.radius*scale, 0, 2*Math.PI);
	ctx.fill();
}