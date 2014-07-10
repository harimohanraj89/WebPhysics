// ========================================
// 
//	 	VERLET IMPLEMENTATIONS OF BALLS
// 		IN A BOX
//		
//		(c) 2013, HARIHARAN MOHANRAJ
// 
// ========================================

var CHEIGHT   	= 800;
var CWIDTH    	= 1200; 
var CSCALE		= 100;
var ASCALE 		= 50;
var PHEIGHT		= CHEIGHT / CSCALE;
var PWIDTH		= CWIDTH  / CSCALE;

var PHYSRATE 	= 10 	// milliseconds
var FRAMERATE   = 10 	// milliseconds
var SPAWNRATE	= 100 	// milliseconds

var c;
var ctx;
var animTickHandle	= false;
var physTickHandle  = false;
var spawnTickHandle = false;

var bubblesPerSpawn = 3;
var minRadius	= 0.05;
var maxRadius	= 0.4;
var minX		= 0;
var maxX 		= PWIDTH;
var minY		= -1 * maxRadius;
var maxY		= -1 * (maxRadius + 0.1*PHEIGHT); 

// Input variables
var mouse = {
				mousePos:new Vec2(0,0), 
				mouseDown:false, 
				mouseMin:1, 
				mouseMax:3,
				mouseK:50
			};
mouse.mouseMinSq = mouse.mouseMin * mouse.mouseMin;
mouse.mouseMaxSq = mouse.mouseMax * mouse.mouseMax;

var bubbles = new Array();



window.onload = function () {
	Init();
}

// ------------------------
// 		  UTILIITES
// ------------------------

Init = function () {

	InitCanvas();
	InitBubbles();
	Draw();
}

InitCanvas = function () {

	// Canvas Init
	c = document.getElementById("mainCanvas");
	c.width = CWIDTH;
	c.height = CHEIGHT;
	ctx = c.getContext("2d");
	c.addEventListener("mousedown", BallsMouseDown, false);
	c.addEventListener("mouseup", BallsMouseUp, false);
}

InitBubbles = function () {

	// Bubbles Init
}

StartSimulation = function () {
	if (!animTickHandle) {
		animTickHandle = setInterval("Draw()",FRAMERATE);	
	}

	if (!physTickHandle) {
		physTickHandle = setInterval("Update()",PHYSRATE);
	}

	if (!spawnTickHandle) {
		spawnTickHandle = setInterval("Spawn()",SPAWNRATE);
	}
}

StopSimulation = function () {
	clearInterval(animTickHandle);
	clearInterval(physTickHandle);
	clearInterval(spawnTickHandle);

	animTickHandle  = false;
	physTickHandle  = false;
	spawnTickHandle = false;
}

ResetBubbles = function () {
	ClearCanvas();
	StopSimulation();
	bubbles = [];
}

// ------------------------
// 		   UPDATES
// ------------------------

Spawn = function () {
	var radius;
	var x;
	var y;

	for (var i=0; i<bubblesPerSpawn; i++) {
		radius = minRadius + (maxRadius - minRadius) * Math.random();
		x = minX + (maxX - minX) * Math.random();
		y = minY + (maxY - minY) * Math.random();
		bubbles.push(new Bubble(radius, new Vec2(x,y), c));
	}
}

Update = function () {
	for (var i=bubbles.length-1; i >= 0; i--) {
		if (bubbles[i].Update(PHYSRATE/1000)) {
			bubbles.splice(i,1)[0].Kill(ctx, CSCALE);
		}
	}
}

// ------------------------
// 		   DRAW
// ------------------------

Draw = function () {

	ClearCanvas();
	DrawBubbles();
	if (mouse.mouseDown) {
		DrawMouse();
	}


}

ClearCanvas = function () {
	ctx.clearRect(0,0,c.width,c.height);
}

DrawBubbles = function () {
	for (var i=bubbles.length-1; i >= 0; i--) {
		bubbles[i].DrawBubble(ctx, CSCALE);
	}
}

DrawMouse = function () {
	ctx.strokeStyle = "#68b";
	ctx.fillStyle = "#68b";
	ctx.beginPath();
	ctx.arc(mouse.mousePos.x * CSCALE, CHEIGHT - mouse.mousePos.y * CSCALE, mouse.mouseMax*CSCALE, 0, 2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(mouse.mousePos.x * CSCALE, CHEIGHT - mouse.mousePos.y * CSCALE, 0.5*CSCALE, 0, 2*Math.PI);
	ctx.fill();
}

// ------------------
// 		 MOUSE
// ------------------

function BallsMouseDown(event){
    UpdateMousePos(event);
    mouse.mouseDown = true;
    c.addEventListener("mousemove", UpdateMousePos, false);
}

function BallsMouseUp(event){
	mouse.mouseDown = false;
	c.removeEventListener("mousemove", UpdateMousePos, false);
}

function UpdateMousePos(event) {
    var clientRect = c.getBoundingClientRect();
    mouse.mousePos.x = (event.clientX - clientRect.left) / ASCALE;
    mouse.mousePos.y = (400 - (event.clientY - clientRect.top)) / ASCALE; // TODO: This 400 shouldn't be hardcoded.
}