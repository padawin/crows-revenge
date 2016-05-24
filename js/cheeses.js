loader.addModule('cheeses', 'canvas', 'B', function (canvas, B) {
	"use strict";

	/**
	 * Module to manage cheeses dropped by the crow
	 */

	var cheesesModule,
		cheeses = [],
		verticalSpeed = 3;


	cheesesModule = {
		dropCheese: function (x, y) {
			cheeses.push({x: x, y: y});
		},

		update: function (foxCoordinates) {
			var c;
			for (c = 0; c < cheeses.length; c++) {
				cheeses[c].y += verticalSpeed;
				if (cheeses[c].y > canvas.getHeight()) {
					cheeses.splice(c, 1);
					B.Events.fire('CHEESE_MISSED');
					c--;
				}
			}
		},

		draw: function () {
			cheeses.forEach(function (cheese) {
				canvas.drawRectangle(cheese.x, cheese.y, 30, 30, 'green');
			});
		}
	};

	return cheesesModule;
});
