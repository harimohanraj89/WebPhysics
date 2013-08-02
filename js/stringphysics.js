/**
 * @author Hariharan Mohanraj
 */

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
var stringLen       = 1;     	// meters
var tension         = 75;    	// newtons
var linDensity      = 0.2;   	// kg/meter
var amplitude       = 0.0001;

// Computational Parameters
var numSegs         = 256;
var delta           = 0.00001;	// seconds
var stepsPerFrame   = 4;
var spfCount		= 0;
var totalTime       = 5;		// seconds

// Derived Parameters
var segmentLen      = stringLen / numSegs;
var numFrames       = Math.floor(totalTime / (delta * stepsPerFrame));

// String variables
var x 		= new Array(numSegs);
var y 		= new Array(numSegs);
var prevy 	= new Array(numSegs);
var nexty 	= new Array(numSegs);
var accel 	= new Array(numSegs);
var dxdy2	= new Array(numSegs);

// User variables
var initType	= "pluck";
var harmonic	= 3;
var fraction	= 0.3;

// Canvas variables
var c;
var ctx;
var cwidth			= 1200;
var cheight			= 800;
var pheight			= 5 * amplitude;
var pwidth			= stringLen;
var stringColor		= "#333";
var stringThickness	= 5;

// Animation variables
var tickHandle	= false;
var framerate	= 10;		// milliseconds

// Misc variables
var toggleButtonDom;
var pwheight = 150;
var pwhandle;
var wavetypeDom;
var harmonicDom;
var fractionDom;

window.onload = function () {
	
	// Canvas
	c = document.getElementById("mainCanvas");
	c.width = cwidth;
	c.height = cheight;
	ctx = c.getContext("2d");
	ctx.strokeStyle = stringColor;
	ctx.lineWidth = stringThickness;

	// Misc
	toggleButtonDom = document.getElementById("toggleparametersbutton");
	pwhandle = document.getElementById("parameterswrapper");
	pwhandle.style.height = "0px";

	// User DOM handles
	wavetypeDom = document.getElementsByClassName("wavetyperadio");
	harmonicDom = document.getElementById("harmonictext");
	fractionDom = document.getElementById("fractiontext");

	for (var i=0,len=wavetypeDom.length; i<len; i++) {
		if (wavetypeDom[i].value == initType) {
			wavetypeDom[i].checked = true;
		}
	}
	harmonicDom.value = ""+harmonic;
	fractionDom.value = ""+fraction;

	// String
	XInit();
	DrawString();
}


// --------------------------
// STRING UTILITIES
// --------------------------

XInit = function() {
	for (var i=0; i<numSegs; i++) {
		x[i] = i * stringLen / numSegs;
	}
	StringInit();
}

StringInit = function() {

	switch (initType) {

		case "harmonic" :
			for (var i=0; i<numSegs; i++) {
					y[i] = amplitude * Math.sin(i * harmonic * Math.PI / (numSegs-1) );
					prevy[i] = amplitude * Math.sin(i * harmonic * Math.PI / (numSegs-1) );
			}
			break;

		// case "harmonicseries" :
		// 	for (var i=0; i<numSegs; i++) {
		// 		y[i] = 0;
		// 		prevy[i] = 0;
		// 	}
		// 	for (var currharmonic = 1; currharmonic<=harmonic; currharmonic++) {
		// 		for (var i=0; i<numSegs; i++) {
		// 			y[i] += amplitude * Math.sin(i * currharmonic * Math.PI / (numSegs-1) ) / currharmonic;
		// 			prevy[i] = amplitude * Math.sin(i * currharmonic * Math.PI / (numSegs-1) ) / currharmonic;
		// 		}
		// 	}
		// 	break;
			
		case "pluck" :
			var len=Math.floor(numSegs*fraction);
			for (var i=0; i<len; i++) {
				y[i] = amplitude * i / (len-1);
				prevy[i] = amplitude * i / (len-1);
			}

			for (var i=Math.floor(numSegs*fraction);i<numSegs;i++) {
				y[i] = amplitude * (numSegs-i-1) / (numSegs-len-1);
				prevy[i] = amplitude * (numSegs-i-1) / (numSegs-len-1);
			}
	}
}

DrawString = function () {

	if (x.length > 0) {
		ctx.beginPath();
		ctx.moveTo(Math.floor((x[0]+segmentLen/2)*cwidth/pwidth), cheight/2 - y[0]*cwidth/pwidth);
		for (var i=1, len=x.length; i<len; i++) {
			ctx.lineTo(Math.floor((x[i]+segmentLen/2)*cwidth/pwidth), cheight/2 - y[i]*cheight/pheight);
		}
		ctx.stroke();
	}
}

ClearCanvas = function () {
	ctx.clearRect(0,0,c.width,c.height);
}

// --------------------------
// MATH UTILITIES
// --------------------------

CustomDiff = function (y, x) {

	if (y.length != x.length) {
		console.log("CustomDiff - Input arguments must be of same length! Returning 0 by default.");
		return 0;
	}

	var len = y.length;
	if (len < 2) {
		console.log("CustomDiff - Inputs must contain at least 2 elements! Returning 0 by default.");
		return 0;
	}

	var dy = new Array(len);

	for (var i=1; i<len-1; i++) {
		dy[i] = (y[i+1]-y[i-1]) / (x[i+1]-x[i-1]);
	}
	dy[0] = (y[1]-y[0]) / (x[1]-x[0]);
	dy[len-1] = (y[len-1]-y[len-2]) / (x[len-1]-x[len-2]);

	return dy;
}

// --------------------------
// UPDATES
// --------------------------
UpdateString = function () {

	// CustomDiff Testing
	// ------------------
	// var testy = [1,2,4,6,8];
	// var testx = [1,2,3,4,5];
	// testy= CustomDiff(CustomDiff(testy,testx),testx);
	// console.log(testy);

	// Implement solution to 1-D wave equation, standard verlet
	// ------------------
	dxdy2 = CustomDiff(CustomDiff(y,x),x);
	for (var i=0; i<numSegs; i++) {

		// Accel
		accel[i] = dxdy2[i] * tension / (linDensity*segmentLen);

		// Next y
		if (i == 0 || i == numSegs-1) {
			nexty[i] = 0;
		}
		else {
			nexty[i] = 2*y[i] - prevy[i] + delta*delta*accel[i];
		}
		
		// Update y
		prevy[i] = y[i];
		y[i] = nexty[i];

	}

	// Draw string
	// ------------------
	spfCount++;
	if (spfCount >= stepsPerFrame) {
		spfCount = 0;
		ClearCanvas();
		DrawString();	
	}
}

StartSimulation = function () {
	if (!tickHandle) {
		tickHandle = setInterval("UpdateString()",framerate);	
	}
}

StopSimulation = function () {
	clearInterval(tickHandle);
	tickHandle = false;
}

ResetString = function () {
	StopSimulation();
	StringInit();
	ClearCanvas();
	DrawString();
}

// Button stuffs
// -------------
ToggleParameters = function () {

	var currpwheight = pwhandle.style.height;
	if (currpwheight != "0px") {
		pwhandle.style.height = "0px";
		toggleButtonDom.innerHTML="Show Parameters";
		pwhandle.style.borderBottom = "none";
	}
	else {
		pwhandle.style.height = pwheight+"px";
		toggleButtonDom.innerHTML="Hide Parameters";
		pwhandle.style.borderBottom = "2px solid #68B";
	}

}

UpdateParameters = function () {
	for (var i=0,len=wavetypeDom.length; i<len; i++) {
		if (wavetypeDom[i].checked) {
			initType = wavetypeDom[i].value;
		}
	}

	if (!isNaN(Number(harmonicDom.value))) {
		harmonic = Number(harmonicDom.value);
	}

	if (!isNaN(Number(fractionDom.value))) {
		fraction = Number(fractionDom.value);
	}

	ResetString();
}