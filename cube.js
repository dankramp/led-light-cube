'use strict;'

// DOM Elements
var canvas = document.getElementById("the-canvas");
var ctx = canvas.getContext("2d");
var slider = document.getElementById("frame-selector");

var frames = [];
const LPR = 8; // lights per row
const NUM_LIGHTS = LPR * LPR * LPR;
var layer = 0;
var axis = 3; // 0 = x, 1 = y, z = 2, all = 3
var frame_index = 0;
var playing = false;
var timer;

// Display settings
const ox = 300, oy = 600;
const cube_size = 60;
const s_light_size = 6, u_light_size = 4; // selected / unselected

// Event Listeners
document.onkeydown = keyboardInput;
canvas.onmousedown = mouseDown;
slider.onchange = changeFrame;


// Back bottom left corner is 0, across horiz, then each line vertically, then forward
// Initialize 10 random frames of cube
for (var fr = 0; fr < 10; fr++) {
	var random = [];
	for (var i = 0; i < NUM_LIGHTS; i++) {
		random[i] = (Math.random() < .5);	
	}
	frames[fr] = random;
}


//--- RENDER ---//

function drawCube(frame) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var i, j, k;
	var y_offset = 0;
	var x_offset = 0;
	var size = 4;

	ctx.strokeStyle = "rgba(200, 200, 200, .2)";
	for (i = 0; i < LPR; i++) {
		// repeat squares
		var i_index = i * 64;
		for ( j = 0; j < LPR; j++) {
			// repeat lines
			var j_index = j * 8;
			for (k = 0; k < LPR; k++) {
				// draw edges
				if (k > 0) {
					ctx.moveTo(ox + x_offset + k * cube_size, oy + y_offset - k * 2);
					ctx.lineTo(ox + x_offset + (k-1) * cube_size, oy + y_offset - (k-1) * 2);
				}
				if (j > 0) {
					ctx.moveTo(ox + x_offset + k * cube_size, oy + y_offset - k * 2);
					ctx.lineTo(ox + x_offset + k * cube_size, oy + (y_offset + cube_size) - k * 2);
				}
				if (i < LPR - 1) {
					ctx.moveTo(ox + x_offset + k * cube_size, oy + y_offset - k * 2);
					ctx.lineTo(ox + (x_offset + cube_size / 2) + k * cube_size, oy + (y_offset + cube_size / 4) - k * 2);
				}
				ctx.stroke();

				// draw selected lights larger
				if ( (axis == 0 && k == layer) || (axis == 1 && j == layer) || ( axis == 2 && i == layer) || axis == 3 || playing ) {
					ctx.fillStyle = frame[i_index + j_index + k] ? "rgba(90, 150, 255, .2)" : "rgba(90, 90, 90, .5)";
					size = s_light_size;
				} else {
					ctx.fillStyle = frame[i_index + j_index + k] ? "rgba(90, 150, 255, .06)" : "rgba(200, 200, 200, .2)";
					size = u_light_size;
				}				
				if (frame[i_index + j_index + k]) { // glowing
					for (var g = 0; g < 4; g++) {						
						ctx.beginPath();
						ctx.arc(ox + x_offset + k * cube_size, oy + y_offset - k * 2, (size+4-g*2), 0, Math.PI * 2, true);
						ctx.fill();
					}
					ctx.fillStyle = "rgb(255, 255, 255)";
					size -=2;
				}
				ctx.beginPath();
				ctx.arc(ox + x_offset + k * cube_size, oy + y_offset - k * 2, size, 0, Math.PI * 2, true);
				ctx.fill();
				
			}
			y_offset -= cube_size;
		}
		y_offset += (cube_size / 4 + cube_size * LPR);
		x_offset += cube_size / 2;
	}
};

function togglePlay() {
	if (!playing) {
		playing = true;
		timer = setInterval(function() {
			frame_index = (frame_index + 1) % 10;
			updateSlider();
			drawCube(frames[frame_index]);			
		}, 1000);
	} else {
		playing = false;
		clearInterval(timer);
	}
}


//--- EVENT LISTENERS ---//

function mouseDown(e) {
	// offsetX, offsetY
	if (axis < 3) { // cannot edit in "all" mode
		// find corresponding light in layer/axis
		switch (axis) {
			case 0: // x-axis				
				for (i = 0; i < LPR; i++) { // z
					for (j = 0; j < LPR; j++) { // y
						var posx = ox + layer * cube_size + i * cube_size / 2;
						var posy = oy + i * cube_size / 4 - j * cube_size - layer * 2;
						var a = e.offsetX - posx;
						var b = e.offsetY - posy;
						if (Math.sqrt(a * a + b * b) < s_light_size) {
							frames[frame_index][(j * LPR) + (i * LPR * LPR) + layer] ^= true;
							drawCube(frames[frame_index]);
							break;
						}
					}
				}
				break;
			case 1: // y-axis
				for (i = 0; i < LPR; i++) { // z
					for (j = 0; j < LPR; j++) { // x
						var posx = ox + j * cube_size + i * cube_size / 2;
						var posy = oy + i * cube_size / 4 - layer * cube_size - j * 2;
						var a = e.offsetX - posx;
						var b = e.offsetY - posy;						
						if (Math.sqrt(a * a + b * b) < s_light_size) {
							frames[frame_index][i * LPR * LPR + j + layer * LPR] ^= true;
							drawCube(frames[frame_index]);
							break;
						}
					}
				}
				break;
			case 2: // z-axis
				for (i = 0; i < LPR; i++) { // y
					for (j = 0; j < LPR; j++) { // x
						var posx = ox + j * cube_size + layer * cube_size / 2;
						var posy = oy + layer * cube_size / 4 - i * cube_size - j * 2;
						var a = e.offsetX - posx;
						var b = e.offsetY - posy;						
						if (Math.sqrt(a * a + b * b) < s_light_size) {
							frames[frame_index][i * LPR + j + layer * LPR * LPR] ^= true;
							drawCube(frames[frame_index]);
							break;
						}
					}
				}
				break;
		}
	}
};

function keyboardInput(e) {
    e = e || window.event;
    console.log(e.keyCode);
    if (e.keyCode >= 88 && e.keyCode <= 90) { // x, y, or z
    	axis = e.keyCode - 88;
    } else if (e.keyCode == 65) { // 'a' for all-axis
    	axis = 3;
    } else if (e.keyCode == 32) { // space -> play
    	togglePlay();
     } else if (e.keyCode == 219 || e.keyCode == 221) { // brackets
     	frame_index = (frame_index + e.keyCode - 220) % 10;
     	if (frame_index < 0) {
     		frame_index += 10;
     	}
     	updateSlider();
     } else if (e.keyCode >= 37 && e.keyCode <= 40) { // arrow key
    	if (axis == 1) { // y-axis layer change
		    if (e.keyCode == 38 && layer < LPR - 1) { // up arrow
		    	layer++;
		    }
		    else if (e.keyCode == 40 && layer > 0) { // down arrow
		    	layer--;
		    }
		} else if (axis <= 2){ // x or z-axis
			if (e.keyCode == 37 && layer > 0) { // left arrow
				layer--;
			}
			else if (e.keyCode == 39 && layer < LPR - 1) { // right arrow
				layer++;
			}
		}
    } else {
    	return;
    }
	drawCube(frames[frame_index]);
};

function changeFrame(e) {
	frame_index = slider.value;
	drawCube(frames[frame_index]);
};

function updateSlider() {
	slider.value = frame_index;
}


//--- INIT ---//

drawCube(frames[frame_index]);
