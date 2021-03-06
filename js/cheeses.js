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
			cheeses.push({x: x, y: y, w: 30, h: 30});
		},

		update: function (fox) {
			var c, contact;
			for (c = 0; c < cheeses.length; c++) {
				cheeses[c].y += verticalSpeed;
				if (cheeses[c].y > canvas.getHeight()) {
					cheeses.splice(c, 1);
					B.Events.fire('cheese_missed');
					c--;
				}
				else {
					contact = fox.touchesCheese(cheeses[c]);
					// the fox grabbed the cheese
					if (contact === true) {
						cheeses.splice(c, 1);
						B.Events.fire('cheese_grabbed');
					}
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
