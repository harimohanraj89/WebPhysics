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

function Raindrop (argRadius, argPosition, argVelocity, argForce, argDensity, canvas) {
  this.radius 		= argRadius;
  this.position 		= argPosition;
  this.velocity 		= argVelocity;
  this.force 			= argForce;
  this.density 		= argDensity;
  this.imass			= 1/(argDensity * this.radius * this.radius);
  this.canvasWidth	= canvas.width;
  this.canvasHeight	= canvas.height;
}

// ------------------------
// 		Object Methods
// ------------------------

Raindrop.prototype.SetPos = function (argX, argY) {
  this.position.x = argX;
  this.position.y = argY;
}

Raindrop.prototype.SetVel = function (argX, argY) {
  this.velocity.x = argX;
  this.velocity.y = argY;
}

Raindrop.prototype.ResetVel = function (argVel) {
  this.velocity.Mult(0);
}

Raindrop.prototype.ResetForce = function () {
  this.force.Mult(0);
}

Raindrop.prototype.Draw = function (ctx, scale) {
  ctx.fillStyle="#79f";
  ctx.beginPath();
  ctx.arc(Math.round(this.position.x*scale), this.canvasHeight - Math.round(this.position.y*scale), this.radius*scale, 0, 2*Math.PI);
  ctx.fill();
}

Raindrop.prototype.Verlet = function (delta) {
  this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
  this.position.Add(Vec2.Mult(this.velocity,delta));
  this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
}
