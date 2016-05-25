loader.executeModule('main',
'B', 'canvas', 'character', 'GUI', 'screenSize', 'cheeses',
function (B, canvas, Character, GUI, screenSize, cheeses) {
	"use strict";

	/**
	 * Main module of the game, manage the game loop.
	 */

	var debug = false,
		fox, crow,
		timePreviousFrame,
		maxFPS = 60,
		interval = 1000 / maxFPS,
		loadingPadding,
		loadingWidth,
		loadingColor = '#0069b1',
		lives = 3,
		grabbedCheeses = 0,
		state,
		STATES = {
			LOST: 0,
			PLAYING: 1
		},
		livesResources = [];

	/**
	 * Method to load the resources needed for the game
	 */
	function loadResources (callback) {
		var nbResources = 3,
			loaded = 0;

		function onLoadResource () {
			loaded++;

			B.Events.fire('resourceloaded', [loaded, nbResources]);

			if (loaded == nbResources) {
				callback();
			}
		}

		B.Events.fire('resourceloaded', [loaded, nbResources]);
		loadLivesResources(onLoadResource);
	}

	function loadLivesResources (loaded) {
		var c = document.createElement('canvas'),
			ctx = c.getContext('2d'),
			resource,
			resourceWidth = 100,
			resourceHeight = 100;
		c.width = resourceWidth;
		c.height = resourceHeight;
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'black';

		ctx.beginPath();
		for (var i = -1; i < 3; i++) {
			if (i >= 0) {
				ctx.arc(
					resourceWidth / 2, resourceHeight / 2,
					resourceWidth / 2,
					i * 2 * Math.PI / 3, (i + 1) * 2 * Math.PI / 3,
					false
				);
				ctx.lineTo(resourceWidth / 2, resourceHeight / 2);
				ctx.stroke();
				ctx.fill();
			}

			resource = document.createElement('img');
			resource.src = c.toDataURL('image/png').replace('image/png', "image/octet-stream");
			resource.onload = loaded;
			livesResources.push(resource);

			if (i == -1) {
				ctx.moveTo(resourceWidth / 2, resourceHeight / 2);
				ctx.lineTo(resourceWidth, resourceHeight / 2);
			}
		}
	}

	/**
	 * Method to adapt the canvas dimensions to the screen and the camera to the
	 * canvas
	 */
	function resize (dimensions) {
		dimensions.x = Math.min(800, dimensions.x);
		dimensions.y = Math.min(600, dimensions.y);
		canvas.resize(dimensions);
		if (fox) {
			fox.y = canvas.getHeight() - fox.h - 50;
		}
	}

	function update () {
		if (state == STATES.PLAYING) {
			fox.update();
			crow.update();
			cheeses.update(fox);
		}
	}

	/**
	 * Main draw method. Draws the sky, the map and its objects
	 */
	function draw () {
		if (state == STATES.PLAYING) {
			canvas.clear();
			crow.draw();
			fox.draw();
			cheeses.draw();
		}
	}

	/**
	 * Method called at each frame of the game. Updates all the entities and
	 * then draw them.
	 */
	function mainLoop () {
		requestAnimationFrame(mainLoop);
		var now = Date.now(),
			delta = now - timePreviousFrame;

		// cap the refresh to a defined FPS
		if (delta > interval) {
			timePreviousFrame = now - (delta % interval);

			update();
			draw();
		}
	}

	function initEvents () {
		/**
		 * Event fired when the mouse is moved, must move the fox
		 */
		B.Events.on('mousemove', null, function (mouseX, mouseY) {
			fox.x = Math.max(0, Math.min(mouseX, canvas.getWidth() - fox.w));
		});

		/**
		 * Event fired when the mouse is clicked
		 */
		B.Events.on('click', null, function (mouseX, mouseY) {

		});

		/**
		 * Event fired when a cheese is missed and touches the floor
		 */
		B.Events.on('cheese_missed', null, function (mouseX, mouseY) {
			lives--;
			if (lives == 0) {
				state = STATES.LOST;
			}
		});

		/**
		 * Event fired when a cheese is grabbed
		 */
		B.Events.on('cheese_grabbed', null, function (mouseX, mouseY) {
			grabbedCheeses++;
		});
	}

	/**
	 * Entry point of the game. Initialises the map, plugs the event and does a
	 * certain amount of mess. @TODO To be refactored
	 */
	function startGame () {
		resize(screenSize.get());

		loadingPadding = canvas.getWidth() / 5;
		loadingWidth = 3 * loadingPadding;

		/**
		 * Event fired when the window is resized
		 */
		B.Events.on('resize', null, resize);

		/**
		 * Event fired when a resource is loaded
		 */
		B.Events.on('resourceloaded', null, function (nbLoaded, nbTotal) {
			GUI.progressBar(
				loadingPadding, canvas.getHeight() / 2,
				loadingWidth, 30,
				nbLoaded / nbTotal,
				loadingColor, 'white', loadingColor
			);
		});

		// load all the resources. When they are loaded, prerender the map and
		// then start the main loop
		loadResources(function () {
			fox = new Character.Fox();
			fox.y = canvas.getHeight() - fox.h - 50;
			crow = new Character.Crow();
			crow.y = 50;
			initEvents();
			timePreviousFrame = Date.now();

			state = STATES.PLAYING;
			mainLoop();
		});
	}


	startGame();
});
