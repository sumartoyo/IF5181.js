var Mather = {
	getResize: function (width, height, max) {
		var result = { width: width, height: height };
		if (width > max || height > max) {
			var newWidth, newHeight;
			if (width > height) {
				newWidth = max;
				newHeight = Math.round(max / width * height);
			} else {
				newWidth = Math.round(max / height * width);
				newHeight = max;
			}
			result = { width: newWidth, height: newHeight };
		}
		return result;
	},
	transformToFlat: function (x, y, width) {
		return ((y * width) + x) * 4;
	},
	findArray: function(array, item) {
		var i, j;
		for (i = 0; i < array.length; i++) {
			for (j = 0; j < item.length; j++) {
				if (array[i][j] != item[j]) {
					break;
				}
			}
			if (j == item.length) {
				return i;
			}
		}
		return -1;
	},
};