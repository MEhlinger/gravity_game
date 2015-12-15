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

const MAX_SPEED = 5;
const TICS_PER_ACCELERATION = 8; // Number of tics between each calculation and application of gravity
const GRAVITATIONAL_CONSTANT = 39; // Mass / Grav-constant = delta speed


var clock = 0;

const keysPressed = {};
addEventListener("keydown", function(e) {keysPressed[e.keyCode] = true;}, false);
addEventListener("keyup", function(e) {delete keysPressed[e.keyCode];}, false);

var images = [];

crispyPlanet = new Image();
crispyPlanet.src = "assets/images/crispy.png"
images.push(crispyPlanet);

pinkPlanet = new Image();
pinkPlanet.src = "assets/images/pink_planet.png"
images.push(pinkPlanet);

costnerPlanet = new Image();
costnerPlanet.src = "assets/images/costner.png"
images.push(costnerPlanet);

scalesPlanet = new Image();
scalesPlanet.src = "assets/images/scales.png"
images.push(scalesPlanet);

shadowPlanet = new Image();
shadowPlanet.src = "assets/images/shadow.png"
images.push(shadowPlanet);

eightiesPlanet = new Image();
eightiesPlanet.src = "assets/images/eighties.png"
images.push(eightiesPlanet);

meteor = new Image();
meteor.src = "assets/images/meteor.png"
images.push(meteor);

var numLoadedImages = 0;
for (i = 0; i < images.length; i++) {
	images[i].onload = function() {
		numLoadedImages++;
	};
};

var pc = {
	name : "Player",
	id : 0,
	type: "solid",
	position : {x: 0, y: 0},
	speed : {x: 0, y: 0},
	mass : 0,
	maxMass : 100,
	health : this.maxMass,
	minMass : 15,
	img : images[0]
};

var testMeteor = {
	name : "small meteor",
	type: "solid",
	position : {x: 0, y: 0},
	speed : {x: -3.5, y: 2.5},
	mass : 0,
	maxMass : 25,
	health : 0,
	minMass : 10,
	render : {x :0, y:0},
	img : images[6]
}

var testMeteor2 = {
	name : "larger meteor",
	type: "solid",
	position : {x: 0, y: 0},
	speed : {x: 1, y: 1},
	mass : 0,
	maxMass : 50,
	health : 0,
	minMass : 10,
	render : {x :0, y:0},
	img : images[6]
}

var testBoost = {
	name : "boost",
	type: "boost",
	position : {x: 0, y: 0},
	speed : {x: 2, y: -2},
	mass : 0,
	render : {x :0, y:0},
	img : images[1]
}


var map = {
	width : 5000,
	height : 5000,
	massiveObjects : [pc, testMeteor, testBoost, testMeteor2]
};

var setup = function() {
	pc.position.x = 350;
	pc.position.y = 350;
	pc.mass = 32;
	pc.health = pc.maxMass;

	testMeteor.position = {x:pc.position.x + 220, y: pc.position.y - canvas.height/2 + 20};
	testMeteor.mass = 10;
	testMeteor.health = testMeteor.mass;

	testMeteor2.position = {x:pc.position.x - 220, y: pc.position.y - canvas.height/2 + 20};
	testMeteor2.mass = 20;
	testMeteor.health2 = testMeteor.mass;

	testBoost.position = {x:pc.position.x - 220, y: pc.position.y + canvas.height/2 - 15};
	testBoost.mass = 21

	clock = 0;
};

var isOnScreen = function(object) {
	if (
		(object.position.x <= adjustCoordinatesForWrap(pc.position.x + canvas.width / 2).x)
		&& (object.position.x >= adjustCoordinatesForWrap(pc.position.x - canvas.width / 2).x)
		&& (object.position.y <= adjustCoordinatesForWrap(pc.position.y + canvas.height / 2).y)
		&& (object.position.y >= adjustCoordinatesForWrap(pc.position.y - canvas.height / 2).y)
		) {
		return true;	
	}
	return false;
};

var isOnMap = function(object) {
	if (
		(object.position.x <= map.width)
		&& (object.position.x >= 0)
		&& (object.position.y <= map.height)
		&& (object.position.y >= 0)
		) {
		return true;	
	}
	return false;
};

var isCollision = function(obj1, obj2) {
	if ((obj1.position.x + obj1.mass *.8 >= obj2.position.x)
		&& (obj1.position.x <= obj2.position.x + obj2.mass *.8)
		&& (obj1.position.y + obj1.mass *.8 >= obj2.position.y)
		&& (obj1.position.y <= obj2.position.y + obj2.mass *.8)) {
		return true; 
	}
	return false;
};

var orderObjectsByMass = function(obj1, obj2) {
	// larger object is first in return
	if (obj1.mass > obj2.mass) {
		return [obj1, obj2];
	}
	return [obj2, obj1];
};

var gravityRadius = function(object) {
	return object.mass * 3;
};

var checkForAndApplyGravityAndCollisions = function() {
	clock += 1;
	for (i = 0; i < map.massiveObjects.length; i++){
		for (j = i+1; j < map.massiveObjects.length; j++) {
			if (map.massiveObjects[i]) {
				if (isCollision(map.massiveObjects[i], map.massiveObjects[j]))  {
					resolveCollision(map.massiveObjects[i], map.massiveObjects[j]);
				} else {
					if (clock > TICS_PER_ACCELERATION) {
						gravitationalInteraction(map.massiveObjects[i], map.massiveObjects[j]);
					}
				}
			}
		}
	}
	if (clock > TICS_PER_ACCELERATION) {
		clock = 0;
	}
};

var boostCollision = function(boosted, booster) {
		boosted.health += booster.mass;
		if (boosted.health > boosted.maxMass) {
			boosted.health = boosted.maxMass;
		}
		destroyObject(booster);
};

var solidObjectCollision = function(smallObj, bigObj) {
	bigObj.mass -= smallObj.mass;
	bigObj.health -= smallObj.mass;

	if (smallObj.speed.x > 0) {
		bigObj.speed.x += 1;
	} else if (smallObj.speed.x < 0) {
		bigObj.speed.x -= 1;
	}
	if (smallObj.speed.y > 0) {
		bigObj.speed.y += 1;
	} else if (smallObj.speed.y < 0) {
		bigObj.speed.y -= 1;
	} 

	destroyObject(smallObj);
	if (bigObj.health <= bigObj.minMass) {
		destroyObject(bigObj);
	}
}

var resolveCollision = function(obj1, obj2) {
	orderedObjects = orderObjectsByMass(obj1, obj2);
	bigObj = orderedObjects[0];
	smallObj = orderedObjects[1];

	if (smallObj.type === "boost") {
		boostCollision(bigObj, smallObj);
	} else if (smallObj.type === "solid" && bigObj.type === "solid") {
		solidObjectCollision(smallObj, bigObj);
	}
};

var destroyObject = function(obj) {
	if (obj.id === 0) {
		//End Game
		//resolveDeadPlayer();
		map.massiveObjects.splice(0,1);
		return;
	}
	for (i = 1; i < map.massiveObjects.length; i++) {
		if (map.massiveObjects[i] === obj) {
			map.massiveObjects.splice(i,1);
			return;
		}
	}


};

var gravitationalInteraction = function(obj1, obj2) {
	orderedObjects = orderObjectsByMass(obj1, obj2);
	bigObj = orderedObjects[0];
	smallObj = orderedObjects[1];

	xDiff = bigObj.position.x - smallObj.position.x;
	yDiff = bigObj.position.y - smallObj.position.y;

	if (xDiff <= gravityRadius(bigObj) && yDiff <= gravityRadius(bigObj)) {
		if (xDiff > 0) {
			smallObj.speed.x += bigObj.mass / GRAVITATIONAL_CONSTANT;
		} else if (xDiff < 0) {
			smallObj.speed.x -= bigObj.mass / GRAVITATIONAL_CONSTANT;;
		}
		if (yDiff > 0) {
			smallObj.speed.y += bigObj.mass / GRAVITATIONAL_CONSTANT;;
		} else if (yDiff < 0) {
			smallObj.speed.y -= bigObj.mass / GRAVITATIONAL_CONSTANT;;
		}
	}
}

var moveObjects = function() {
	for (i = 0; i < map.massiveObjects.length; i++) { 
		var obj = map.massiveObjects[i];

		if (obj.speed.x > MAX_SPEED) {
			obj.speed.x = MAX_SPEED;
		} else if (obj.speed.x < MAX_SPEED * -1) {
			obj.speed.x = MAX_SPEED * -1;
		}
		if (obj.speed.y > MAX_SPEED) {
			obj.speed.y = MAX_SPEED;
		} else if (obj.speed.y < MAX_SPEED * -1) {
			obj.speed.y = MAX_SPEED * -1;
		}

		obj.position.x += obj.speed.x;
		obj.position.y += obj.speed.y;

		obj.position = adjustCoordinatesForWrap(obj.position.x, obj.position.y);
	}
};

var adjustCoordinatesForWrap = function(x, y) {
	newX = adjustSingleAxisValueForWrap(x, map.width);
	newY = adjustSingleAxisValueForWrap(y, map.height);
	return {x: newX, y: newY};
};

var adjustSingleAxisValueForWrap = function(z, maxValueOfAxis) {
	newZ = z;
	if (z > maxValueOfAxis) {
		newZ = z - maxValueOfAxis;
	} else if (z < 0) {
		newZ = maxValueOfAxis - z;
	}
	return z;
};

var setAllObjectRenderCoordinates = function() {
	for (i = 1; i < map.massiveObjects.length; i++){
		setRenderCoordinates(map.massiveObjects[i]);
	}
}

var setRenderCoordinates = function(object) {
	object.render.x = canvas.width / 2 + (object.position.x - pc.position.x);
	object.render.y = canvas.height / 2 + (object.position.y - pc.position.y);

	object.render = adjustCoordinatesForWrap(object.render.x, object.render.y);
};

var checkForAndApplyInput = function() {
	if (38 in keysPressed) {
		//up
		if (pc.mass < pc.health - 2) {
			pc.mass += 2;
		}
	}
	if (40 in keysPressed) {
		//down
		if (pc.mass > pc.minMass) {
			pc.mass -= 2;
		}
	}
}

var update = function(modifier) {
	// Handle key presses
	checkForAndApplyInput();
	// Handle gravity and speed logic
	checkForAndApplyGravityAndCollisions();
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

var drawMassiveObjects = function() {
	pc.render = {x : canvas.width / 2 - pc.mass / 2, y : canvas.height / 2 - pc.mass / 2};
	for (i = 0; i < map.massiveObjects.length; i++) {
		drawMassiveObject(map.massiveObjects[i]);
	}
};

var drawMassiveObject = function(obj) {
	context.drawImage(obj.img, obj.render.x, obj.render.y, obj.mass, obj.mass);
}

var render = function() {
	if (numLoadedImages === images.length) {
		clearAndRedrawBackground();
		drawMassiveObjects();
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