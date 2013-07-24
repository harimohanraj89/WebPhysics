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

function Ball (argRadius, argPosition, argDensity, canvas) {
	this.radius 		= argRadius;
	this.position 		= argPosition;
	this.velocity 		= new Vec2(0,0);
	this.force 			= new Vec2(1,1);
	this.density 		= argDensity;
	this.imass			= 1/(argDensity * this.radius * this.radius);
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

Ball.prototype.ResetVel = function (argVel) {
	this.velocity.Set(new Vec(0,0));
}

Ball.prototype.ResetForce = function () {
	this.force.Mult(0);
}

Ball.prototype.AddForce = function (argForce) {
	this.force.Add(argForce);
}

Ball.prototype.Draw = function (ctx, scale) {
	ctx.fillStyle="#444";
	ctx.beginPath();
	ctx.arc(Math.round(this.position.x*scale), this.canvasHeight - Math.round(this.position.y*scale), this.radius*scale, 0, 2*Math.PI);
	ctx.fill();
}

Ball.prototype.PreVerlet = function (delta) { 	
// Executes position update and velocity half-update
// To be called before force update
	this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
	this.position.Add(Vec2.Mult(this.velocity,delta));
}

Ball.prototype.PostVerlet = function (delta) {	
// Executes velocity velocity second-half-update
// To be called after force update
	this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
}