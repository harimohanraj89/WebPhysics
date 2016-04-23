// ========================================
//
//	 	SIMULATION OF VIBRATING STRING
//
//		(c) 2013, HARIHARAN MOHANRAJ
//
// ========================================

// ----------------------
// PARAMETERS
// ----------------------

// Physical Parameters
var linkLength = 0.05;
var k          = 1;
var linkMass   = 0.2;
var GRAVITY    = 0.1;

// Computational Parameters
var numNodes   = 5;
var t;

// String variables
var links = [];

// Canvas variables
var c;
var ctx;
var cwidth			= 1200;
var cheight			= 800;
var scale       = 1200;
var pheight			= cheight / scale;
var pwidth			= cwidth  / scale;
var stringThickness	= 0.002;

var simulating = true;

window.onload = function () {

	// Canvas
	c = document.getElementById("mainCanvas");
	c.width = cwidth;
	c.height = cheight;
	ctx = c.getContext("2d");
	ctx.strokeStyle = "#333";
	ctx.lineWidth = stringThickness * scale;

	for (var i = 0; i < numNodes; i++) {
		var pos = new Vec2(pwidth / 2 + i * 0.1, pheight - i * linkLength);
		var link = new Chain(0.01, pos, linkMass, c);
		links.push(link);
	}

	for (var i = 0; i < numNodes; i++) {
		if (i > 0) {
			links[i].previousChain = links[i - 1];
		}

		if (i < numNodes - 1) {
			links[i].nextChain = links[i + 1];
		}
	}
	requestAnimationFrame(UpdateChain);
}

ClearCanvas = function () {
	ctx.clearRect(0,0,c.width,c.height);
}

UpdateChain = function (time) {
	// Time calculations
	if (t === undefined) {
		t = time;
		delta = 0;
	} else {
		delta = time - t;
		t = time;
	}
	if (simulating) {
		for (var i = 1; i < links.length; i++) {
			links[i].Update(delta/1000);
		}
		ClearCanvas();
		links.forEach(function(link) {
			link.Draw(ctx, scale);
		});
		drawLines();

	}
	// console.log(delta/1000);
	requestAnimationFrame(UpdateChain);
}

function drawLines() {
	ctx.moveTo(links[0].position.x * scale, cheight - links[0].position.y * scale);
	for (var i = 1; i < links.length; i++) {
		ctx.lineTo(links[i].position.x * scale, cheight - links[i].position.y * scale);
	}
	ctx.stroke();
}
