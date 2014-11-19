// ========================================
//
//	 	2-D VECTOR JAVASCRIPT LIBRARY
//
//		(c) 2013, HARIHARAN MOHANRAJ
//
// ========================================

// ------------------------
// 		Constructor
// ------------------------

function Vec2 (argX, argY) {
	this.x = argX;
	this.y = argY;
}

// ------------------------
// 		Object methods
// ------------------------

Vec2.prototype.Set = function (argVec) {
	this.x = argVec.x;
	this.y = argVec.y;
}

Vec2.prototype.Display = function () {
	console.log('X:'+this.x+'  Y:'+this.y);
};

Vec2.prototype.Magnitude = function () {
	return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vec2.prototype.SqrMagnitude = function () {
	return (this.x*this.x + this.y*this.y);
};

Vec2.prototype.Normalized = function () {
	var mag = this.Magnitude();
	var normd = new Vec2(this.x/mag, this.y/mag);
	return normd;
};

Vec2.prototype.Reversed = function () {
	var rev = new Vec2(-this.x, -this.y);
	return rev;
};

Vec2.prototype.Normal = function () {
	var normal = new Vec2(-this.y, this.x);
	return normal.Normalized();
};

Vec2.prototype.Project = function (argVec) {
	var magnitude = Vec2.Dot(this,argVec) / argVec.Magnitude();
	var projection = Vec2.Mult(argVec.Normalized(), magnitude);
	return projection;
};

Vec2.prototype.Add = function (argVec) {
	this.x += argVec.x;
	this.y += argVec.y;
	return this;
}

Vec2.prototype.Sub = function (argVec) {
	this.x -= argVec.x;
	this.y -= argVec.y;
	return this;
}

Vec2.prototype.Mult = function (argScalar) {
	this.x *= argScalar;
	this.y *= argScalar;
	return this;
}

// ------------------------
// 		Class methods
// ------------------------
Vec2.Add = function (argVec1, argVec2) {
	var x = argVec1.x + argVec2.x;
	var y = argVec1.y + argVec2.y;
	var add = new Vec2(x,y);
	return add;
}

Vec2.Sub = function (argVec1, argVec2) {
	var x = argVec1.x - argVec2.x;
	var y = argVec1.y - argVec2.y;
	var sub = new Vec2(x,y);
	return sub;
}

Vec2.Mult = function (argVec, argScalar) {
	var x = argVec.x * argScalar;
	var y = argVec.y * argScalar;
	var mult = new Vec2(x,y);
	return mult;
}

Vec2.Dot = function (argVec1, argVec2) {
	return (argVec1.x*argVec2.x + argVec1.y*argVec2.y);
};

Vec2.X = function () {
	return (new Vec2(1,0));
}

Vec2.Y = function () {
	return (new Vec2(0,1));
}
