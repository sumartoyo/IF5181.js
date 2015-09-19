/*

dir = direction
	5 6 7
	4 + 0
	3 2 1

*/

var Chainer = function (data, width, height) {
	var that = this;
	
	that.data = data;
	that.width = width;
	that.height = height;
	
	that.getCode = function () {
		var i, j, k;
		
		var codes = [];
		
		var background = that.getValue(0, 0);
		var top, right, bottom, left;
		for (j = 0; j < height; j++) {
			for (i = 0; i < width; i++) {
				if (that.getValue(i, j) != background) {
					top = that.move(6, i, j);
					right = that.move(0, i, j);
					bottom = that.move(2, i, j);
					left = that.move(4, i, j);
					if (that.getValue(top.x, top.y) == background || that.getValue(right.x, right.y) == background || that.getValue(bottom.x, bottom.y) == background || that.getValue(left.x, left.y) == background) {
						for (k = 0; k < codes.length; k++) {
							if (that.isVisited(codes[k].border, i, j)) {
								break;
							}
						}
						if (k == codes.length) {
							codes.push(that.traceBorder(i, j, that.getValue(i, j), background));
						}
					}
				}
			}
		}
		
		return codes;
	};
	
	that.traceBorder = function (startX, startY, foreground, background) {
		var code = [0];
		var visited = [];
		var x = startX;
		var y = startY;
		var i, next, isFound;
		while (true) {
			isFound = false;
			visited.push([x, y]);
			for (i = 0; i < 8; i++) { // for every direction
				if (Math.abs(i - code[code.length - 1]) != 4) { // but only if not go back
					next = that.move(i, x, y);
					if (that.isInside(next.x, next.y)) { // if point inside image
						if (that.getValue(next.x, next.y) == foreground) { // if next point is object
							if (that.isLeftBackground(next.x, next.y, i, background)) { // if left of the point is not object
								if (visited[0][0] == next.x && visited[0][1] == next.y) { // but what if we have come back to starting point
									code.push(i);
									break;
								} else if (!that.isVisited(visited, next.x, next.y)) { // if point hasn't been visited
									isFound = true;
									code.push(i);
									break;
								}
							}
						}
					}
				}
			}
			
			if (!isFound) {
				break;
			} else {
				x = next.x;
				y = next.y;
			}
		}
		
		code.shift();
		return { code: code, border: visited };
	};
	
	that.move = function (dir, x, y) {
		var result = { x: x, y: y };
		
		// x
		if (dir == 7 || dir == 0 || dir == 1) {
			result.x += 1;
		} else if (dir == 5 || dir == 4 || dir == 3) {
			result.x -= 1;
		}
		// y
		if (dir == 5 || dir == 6 || dir == 7) {
			result.y -= 1;
		} else if (dir == 3 || dir == 2 || dir == 1) {
			result.y += 1;
		}
		
		return result;
	};
	that.isInside = function (x, y) {
		return x >= 0 && x < that.width && y >= 0 && y < that.height;
	};
	that.getLeftDir = function (dir) {
		if (dir < 2) {
			return 6;
		} else if (dir < 4) {
			return 0;
		} else if (dir < 6) {
			return 2;
		} else if (dir < 8) {
			return 4;
		}
	};
	that.isLeftBackground = function (x, y, dir, background) {
		var left = that.move(that.getLeftDir(dir), x, y);
		if (!that.isInside(left.x, left.y)) {
			return true;
		}
		if (that.getValue(left.x, left.y) == background) {
			return true;
		}
		return false;
	};
	that.isVisited = function(visited, x, y) {
		var i;
		for (i = 0; i < visited.length; i++) {
			if (visited[i][0] == x && visited[i][1] == y) {
				return true;
			}
		}
		return false;
	};
	that.getValue = function (x, y) {
		return that.data[Mather.transformToFlat(x, y, that.width)];
	};
};