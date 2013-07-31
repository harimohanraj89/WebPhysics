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
var stringLen       = 1;     	// Meters
var tension         = 75;    	// Newtons
var linDensity      = 0.2;   	// Kg/meter
var amplitude       = 0.0001;

// Computational Parameters
var numSegs         = 64;
var delta           = 0.00001;	// Seconds
var stepsPerFrame   = 10;
var totalTime       = 5;		// Seconds

// Derived Parameters
var segmentLen      = stringLen / numSegs;
var numFrames       = Math.floor(totalTime / (delta * stepsPerFrame));

// String variables
var x 		= new Array(numSegs);
var y 		= new Array(numSegs);
var prevy 	= new Array(numSegs);
var nexty 	= new Array(numSegs);
var accel 	= new Array(numSegs);

// User variables
var initType	= "harmonic";
var harmonic	= 1;
var fraction	= 0.5;

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
			}
			break;

		case "pluck" :
			var len=Math.floor(numSegs*fraction);
			for (var i=0; i<len; i++) {
				y[i] = amplitude * i / (len-1);
			}

			for (var i=Math.floor(numSegs*fraction);i<numSegs;i++) {
				y[i] = amplitude * (numSegs-i-1) / (numSegs-len-1);
			}
	}
}