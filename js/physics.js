/**
 * @author Hariharan Mohanraj
 */

window.onload = function () {

	var BOXHEIGHT = 8;
	var BOXWIDTH  = 12;

	var c = document.getElementById("mainCanvas");
	c.width = 1200;
	c.height = 800;
	var ctx = c.getContext("2d");

	var ball1 = new Ball(1,new Vec2(2,2),c);
	var ball2 = new Ball(1,new Vec2(10,2),c);

	ball1.Draw(ctx,100);
	ball2.Draw(ctx,100);

	if (ball1.radius + ball2.radius > Vec2.Sub(ball1.position,ball2.position).Magnitude() ) {
		console.log('Collision!');
	}
}