// ========================================
//
//	  PHYSICS CHAIN LINK JAVASCRIPT LIBRARY
//
//		(c)2013, HARIHARAN MOHANRAJ
//
// 	*****   Requires Vec2 Library   *****

// ========================================

// ------------------------
// 		Constructor
// ------------------------

function Chain (argRadius, argPosition, argMass, canvas) {
  this.radius 		   = argRadius;
  this.position 		 = argPosition;
  this.velocity 		 = new Vec2(0,0);
  this.mass          = argMass;
  this.force         = new Vec2(1,1);
  // this.nextChain     = argNextChain;
  // this.previousChain = argPreviousChain;
  this.canvasWidth   = canvas.width;
  this.canvasHeight	 = canvas.height;
}

// ------------------------
// 		Object Methods
// ------------------------

Chain.prototype.SetPos = function (argX, argY) {
  this.position.x = argX;
  this.position.y = argY;
}

Chain.prototype.SetVel = function (argX, argY) {
  this.velocity.x = argX;
  this.velocity.y = argY;
}

Chain.prototype.ResetVel = function (argVel) {
  this.velocity.Mult(0);
}

Chain.prototype.ResetForce = function () {
  this.force.Mult(0);
}

Chain.prototype.AddForce = function (argForce) {
  this.force.Add(argForce);
}

Chain.prototype.Verlet = function (delta) {
  // Executes position update and velocity half-update
  // To be called before force update
  this.velocity.Add(Vec2.Mult(this.force,delta / (this.mass * 2)));
  this.position.Add(Vec2.Mult(this.velocity,delta));
  this.velocity.Add(Vec2.Mult(this.force,delta / (this.mass * 2)));
}

Chain.prototype.CalcForces = function () {
  this.ResetForce();
  this.AddForce(new Vec2(0, -1 * GRAVITY * this.mass));

  if (this.previousChain) {
    var prevDistance = Vec2.Sub(this.previousChain.position, this.position).Magnitude();
    var prevVec = Vec2.Sub(this.previousChain.position, this.position).Normalized();
    var x = prevDistance - linkLength;
    this.AddForce(Vec2.Mult(prevVec, k * x));
  }

  if (this.nextChain) {
    var nextDistance = Vec2.Sub(this.nextChain.position, this.position).Magnitude();
    var nextVec = Vec2.Sub(this.nextChain.position, this.position).Normalized();
    var x = nextDistance - linkLength;
    this.AddForce(Vec2.Mult(nextVec, k * x));
  }

  this.AddForce(Vec2.Mult(this.velocity, -0.02));
}

Chain.prototype.PreVerlet = function (delta) {
  // Executes position update and velocity half-update
  // To be called before force update
  this.velocity.Add(Vec2.Mult(this.force,delta / (this.mass * 2)));
  this.position.Add(Vec2.Mult(this.velocity,delta));
}

Chain.prototype.PostVerlet = function (delta) {
  // Executes velocity velocity second-half-update
  // To be called after force update
  this.velocity.Add(Vec2.Mult(this.force,delta / (this.mass * 2)));
}

Chain.prototype.Update = function (delta) {
  this.CalcForces();
  this.PreVerlet(delta);
  this.CalcForces();
  this.PostVerlet(delta);
}

Chain.prototype.Draw = function (ctx, scale) {
  ctx.fillStyle="#444";
  ctx.beginPath();
  ctx.arc(Math.round(this.position.x*scale), this.canvasHeight - Math.round(this.position.y*scale), this.radius*scale, 0, 2*Math.PI);
  ctx.fill();
}
