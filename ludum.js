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

const bgColor = BLACK = "#000000";
const MAX_BIOMASS = 100;
const MAX_SPEED = 50;
const MAX_MASS = 100

var clock = 0;

var keysPressed = {};
addEventListener("keydown", function(e) {keysPressed[e.keyCode] = true;}, false);
addEventListener("keyup", function(e) {delete keysPressed[e.keyCode];}, false);

var pc = {
	position : {x: 0, y: 0},
	speed : {x: 0, y: 0},
	mass : 10,
	biomass : 1,
	image : "assets/images/pc.png"
};

var testMeteor = {
	position : {x: 0, y: 0},
	speed : {x: -5, y: 0},
	mass : 5,
	renderX: 0,
	renderY:0,
	id : 0
}

var pcReady = false;
var pcImage = new Image();
pcImage.src = pc.image;
pcImage.onload = function() {
	pcReady = true;
};

var map = {
	width : 1920,
	height : 1060,
	massiveObjects : [pc, testMeteor]
};

var setup = function() {
	pc.position.x = 10;
	pc.position.y = 10;
	testMeteor.position = {x:pc.position.x + canvas.width / 2, y: pc.position.y + 50};
	pc.mass = 32;
	pc.biomass = 1;
	clock = 0
};

var isOnScreen = function(objectInSpaceX, objectInSpaceY) {
	if (
		(objectInSpaceX <= pc.x + canvas.width / 2)
		&& (objectInSpaceX >= pc.x - canvas.width / 2)
		&& (objectInSpaceY <= pc.y + canvas.height / 2)
		&& (objectInSpaceY >= pc.y - canvas.height / 2)
		) {
		return true;	
	}
	return false;
};

var orderObjectsByMass = function(obj1, obj2) {
	// larger object is first
	if (obj1.mass > obj2.mass) {
		return [obj1, obj2];
	}
	return [obj2, obj1];
}

var gravityRadius = function(object) {
	return object.mass * 3;
}

var exertGravityOnMassiveObjects = function() {
	for (i = 0; i < map.massiveObjects.length; i++){
		for (j = i+1; j < map.massiveObjects.length; j++) {
			orderedObjects = orderObjectsByMass(map.massiveObjects[i], map.massiveObjects[j]);
			xDiff = orderedObjects[0].position.x - orderedObjects[1].position.x;
			yDiff = orderedObjects[0].position.y - orderedObjects[1].position.y;
			if (xDiff <= gravityRadius(orderedObjects[0]) && xDiff > 0) {
				orderedObjects[1].speed.x += orderedObjects[0].mass / orderedObjects[1].mass;
			} else if (xDiff <= gravityRadius(orderedObjects[0]) && xDiff < 0) {
				orderedObjects[1].speed.x -= orderedObjects[0].mass / orderedObjects[1].mass;
			}
			if (yDiff <= gravityRadius(orderedObjects[0]) && yDiff > 0) {
				orderedObjects[1].speed.y += orderedObjects[0].mass / orderedObjects[1].mass;
			} else if (yDiff <= gravityRadius(orderedObjects[0]) && yDiff < 0) {
				orderedObjects[1].speed.y -= orderedObjects[0].mass / orderedObjects[1].mass;
			}
		}
	}
}

var moveObjects = function() {
	for (i = 0; i < map.massiveObjects.length; i++) {
		map.massiveObjects[i].position.x += map.massiveObjects[i].speed.x;
		map.massiveObjects[i].position.y += map.massiveObjects[i].speed.y;
	}
}

var setAllObjectRenderCoordinates = function() {
	for (i = 1; i < map.massiveObjects.length; i++){
		setRenderCoordinates(map.massiveObjects[i]);
	}
}

var setRenderCoordinates = function(object) {
	object.renderX = canvas.width / 2 + (object.position.x - pc.position.x);
	object.renderY = canvas.height / 2 + (object.position.y - pc.position.y);
}

var update = function(modifier) {
	// Handle key presses
	// Handle gravity and speed logic
	exertGravityOnMassiveObjects();
	moveObjects();
	setAllObjectRenderCoordinates();
};

var clearAndRedrawBackground = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
};

var drawCircle = function(centerX, centerY, radius, color) {
	context.beginPath();
	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = color;
	context.stroke();
};

var render = function() {
	clearAndRedrawBackground();
	if (pcReady) {
		context.drawImage(pcImage,
			canvas.width / 2 - pc.mass / 2, 
			canvas.height / 2 - pc.mass / 2,
			pc.mass, pc.mass);
	}

	drawCircle(testMeteor.renderX, testMeteor.renderY, testMeteor.mass / 2, "#FFFFFF");
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