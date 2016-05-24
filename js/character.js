loader.addModule('character', 'canvas', 'B', function (canvas, B) {
	"use strict";

	/**
	 * Module to manage the fox and the crow
	 */

	/**
	 * Method to set the good sprite to the player depending of his speed. Used
	 * only when the player is moving
	 */
	function _updateSpriteFromDirection(character) {
		if (character.speed.x > 0) {
			character.sprite = sprites.sprites[
				sprites.SPRITES_ACCESS.PLAYER_MOVE_RIGHT
			];
		}
		else if (character.speed.x < 0) {
			character.sprite = sprites.sprites[
				sprites.SPRITES_ACCESS.PLAYER_MOVE_UP_LEFT
			];
		}
	}

	/**
	 * Player constructor.
	 */
	function Fox () {
		this.w = 50;
		this.h = 50;
		this.x = (canvas.getWidth() - this.w) / 2;
		this.frame = 0;
		this.maxFrame = 4;
		this.tick = 0;
		this.timePerFrame = 8;
		this.speed = {x: 0, y: 0};
	}

	/**
	 * Update the player's position and sprite according to his path.
	 */
	Fox.prototype.update = function (map) {
	};

	/**
	 * Update the character's frame from his ticks
	 */
	Fox.prototype.updateFrame = function () {
		this.tick++;
		if (this.tick == this.timePerFrame) {
			this.tick = 0;
			this.frame = (this.frame + 1) % this.maxFrame;
		}
	};

	/**
	 * Draw the character in the screen depending to the camera position
	 */
	Fox.prototype.draw = function () {
		canvas.drawRectangle(this.x, this.y, this.w, this.h, 'black');
	};

	return {Fox: Fox,};
});
