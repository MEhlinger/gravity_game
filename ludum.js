// Gravity Game??
// LD34: GROWING and TWO-BUTTON-CONTROLS
// Code Input by Marshall Ehlinger and Francis King
// Art Input by Will Zaret and Brian Rezek

// Set-Up
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 960;
canvas.height = 580;
document.body.appendChild(canvas);

bgColor = BLACK = "#000000";
// MAX_BIOMASS = 100;
// MAX_SPEED = 50;
// MAX_MASS = 100

var keysPressed = {};
addEventListener("keydown", function(e) {keysPressed[e.keyCode] = true;}, false);
addEventListener("keyup", function(e) {delete keysPressed[e.keyCode];}, false);

var pc = {
	position : {x: 0, y: 0},
	speed : {x: 10, y: 5},
	mass : 10,
	biomass : 1,
	image : "/assets/images/pc.png"
};

var pcReady = false;
var pcImage = new Image();
pcImage.src = "assets/images/pc.png";
pcImage.onload = function() {
	pcReady = true;
};

var map = {
	width : 1920,
	height : 1060
};

var setup = function() {
	pc.position.x = 10;
	pc.position.y = 10;
	pc.mass = 10;
	pc.biomass = 1;
};

var update = function(modifier) {
	//Handle key presses
};

var clearAndRedrawBackground = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
};

// var drawCircle(centerX, centerY, radius, color) {
// 	context.beginPath();
// 	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
// 	context.fillStyle = 'green';
// 	context.fill();
// 	context.lineWidth = 5;
// 	context.strokeStyle = '#003300';
// 	context.stroke();
// }

var render = function() {
	clearAndRedrawBackground();
	if (pcReady) {
		context.drawImage(pcImage,
			canvas.width / 2 - pc.mass / 2, 
			canvas.height / 2 - pc.mass / 2,
			32, 32);
	}
};

var main = function() {
	var MILLISECONDS = 1000;
	var now = Date.now();
	var delta = now - lastUpdate;
	update(delta / MILLISECONDS);
	render();
	lastUpdate = now;
	requestAnimationFrame(main);
};

var supportRequestAnimationFrameCrossBrowser = function() {
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
};

//////////////
// THE GAME //
/////////////
supportRequestAnimationFrameCrossBrowser();

var lastUpdate = Date.now();
setup(); 
main();