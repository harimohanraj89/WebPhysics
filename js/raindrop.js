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
  this.trailAmt    = 0.02;
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

Raindrop.prototype.Verlet = function (delta) {
  this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
  this.position.Add(Vec2.Mult(this.velocity,delta));
  this.velocity.Add(Vec2.Mult(this.force,delta*this.imass/2));
}

Raindrop.prototype.Draw = function (ctx, scale) {
  var x = this.position.x;
  var y = this.position.y;
  ctx.fillStyle="#79f";
  ctx.strokeStyle = "#79f";
  ctx.lineWidth = this.radius * scale * 2;
  ctx.beginPath();
  ctx.arc(Math.round(x*scale), this.canvasHeight - Math.round(y*scale), this.radius*scale, 0, 2*Math.PI);
  ctx.fill();

  if (this.velocity.Magnitude() > 0) {
    var offset = this.velocity.Normal();
    offset.Mult(this.radius);
    var trail = new Vec2(this.position.x - this.velocity.x * this.trailAmt, this.position.y - this.velocity.y * this.trailAmt);

    ctx.moveTo(Math.round((this.position.x + offset.x)*scale), this.canvasHeight - Math.round((this.position.y + offset.y)*scale));
    ctx.beginPath();
    ctx.lineTo(Math.round((trail.x)*scale), this.canvasHeight - Math.round((trail.y)*scale));
    ctx.lineTo(Math.round((this.position.x - offset.x)*scale), this.canvasHeight - Math.round((this.position.y - offset.y)*scale));
    ctx.lineTo(Math.round((this.position.x + offset.x)*scale), this.canvasHeight - Math.round((this.position.y + offset.y)*scale));
    ctx.fill();
  }
}
