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

function Splash (argRadius, argPosition, argVelocity, argForce, argDensity, canvas) {
	this.radius 		= argRadius;
	this.position 		= argPosition;
	this.velocity 		= argVelocity;
	this.force 			= argForce;
	this.density 		= argDensity;
	this.imass			= 1/(argDensity * this.radius * this.radius);
	this.canvasWidth	= canvas.width;
	this.canvasHeight	= canvas.height;
	this.trailAmt    = 0.02;
}

// ------------------------
// 		Object Methods
// ------------------------

Splash.prototype.SetPos = function (argX, argY) {
	this.position.x = argX;
	this.position.y = argY;
}

Splash.prototype.SetVel = function (argX, argY) {
	this.velocity.x = argX;
	this.velocity.y = argY;
}

Splash.prototype.ResetVel = function (argVel) {
	this.velocity.Mult(0);
}

Splash.prototype.ResetForce = function () {
	this.force.Mult(0);
}

Splash.prototype.Verlet = function (delta) {
	this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
	this.position.Add(Vec2.Mult(this.velocity,delta));
	this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
}

Splash.prototype.Draw = function (ctx, scale) {
	var x = this.position.x;
	var y = this.position.y;
	ctx.fillStyle="#79f";
	ctx.strokeStyle = "#79f";
	ctx.lineWidth = this.radius * scale * 2;
	ctx.beginPath();
	ctx.arc(Math.round(x*scale), this.canvasHeight - Math.round(y*scale), this.radius*scale, 0, 2*Math.PI);
	ctx.fill();
}
