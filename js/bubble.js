// ========================================
//
//	  PHYSICS BUBBLE JAVASCRIPT LIBRARY
//
//		(c)2013, HARIHARAN MOHANRAJ
//
// 	*****   Requires Vec2 Library   *****

// ========================================

// ------------------------
// 		Constructor
// ------------------------

function Bubble (argRadius, argPosition, canvas) {
	this.radius 		= argRadius;
	this.position 		= argPosition;
	this.velocity 		= new Vec2(0,0);
	this.canvasWidth	= canvas.width;
	this.canvasHeight	= canvas.height;
	this.buoyancy		= 12;
	this.shrinkRate		= 1.5;
}



// // ------------------------
// // 		Object Methods
// // ------------------------

Bubble.prototype.SetPos = function (argX, argY) {
	this.position.x = argX;
	this.position.y = argY;
}

Bubble.prototype.SetVel = function (argX, argY) {
	this.velocity.x = argX;
	this.velocity.y = argY;
}

Bubble.prototype.ResetVel = function (argVel) {
	this.velocity.Mult(0);
}

Bubble.prototype.DrawBubble = function (ctx, scale) {
	if (this.radius > 0) {
		ctx.fillStyle="#444";
		ctx.beginPath();
		ctx.arc(Math.round(this.position.x*scale), this.canvasHeight - Math.round(this.position.y*scale), this.radius*scale, 0, 2*Math.PI);
		ctx.fill();
	}
}

// Ball.prototype.Kill = function (callback) {

// }

Bubble.prototype.Update = function (delta) {

	// Bubble shrink
	if (this.position.y >= 0) {
		this.radius -= this.shrinkRate * delta;
	}

	// Bubble float
	// this.velocity.Set(new Vec2(0, this.buoyancy/(0.5+this.radius)))
	this.SetVel(0, this.buoyancy);
	this.position.Add(Vec2.Mult(this.velocity, delta));

	// Bubble death
	if (this.radius <= 0) {
		return true;
	}

	return false;
}

Bubble.prototype.Kill = function (ctx, scale) {
	ctx.fillStyle="#444";
	ctx.beginPath();
	ctx.arc(Math.round( (this.position.x + 0.1)*scale), this.canvasHeight - Math.round((this.position.y + 0.1)*scale), 0.03*scale, 0, 2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(Math.round( (this.position.x + 0.1)*scale), this.canvasHeight - Math.round((this.position.y - 0.1)*scale), 0.03*scale, 0, 2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(Math.round( (this.position.x - 0.1)*scale), this.canvasHeight - Math.round((this.position.y + 0.1)*scale), 0.03*scale, 0, 2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(Math.round( (this.position.x - 0.1)*scale), this.canvasHeight - Math.round((this.position.y - 0.1)*scale), 0.03*scale, 0, 2*Math.PI);
	ctx.fill();
}
