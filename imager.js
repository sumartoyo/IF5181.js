var Imager = {
	fromImage: function (image, sx, sy, swidth, sheight, x, y, width, height) {
		var canvas = Elementer.create('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext('2d');
		context.drawImage(image, sx, sy, swidth, sheight, x, y, width, height);
		return context;
	},
	fromData: function (data, x, y, width, height) {
		var canvas = Elementer.create('canvas');
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext('2d');
		context.putImageData(data, x, y);
		return context;
	},
	toGrayScale: function (data) {
		var i;
		var grayScale;
		for (i = 0; i < data.length; i += 4) {
			grayScale = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
			data[i] = data[i + 1] = data[i + 2] = grayScale;
		}
	},
	createHistogram: function (data) {
		var i;
		var histogram = Array.apply(null, Array(256)).map(function () { return 0; });
		for (i = 0; i < data.length; i += 4) {
			histogram[data[i]] += 1; // histogramming
		}
		return histogram;
	},
	drawHistogram: function (canvas, histogram) {
		var i, j;
		var width = 258;
		var height = 172;
		var half = Math.floor(width / 2);
		var halfLeft = Math.round(width / 4);
		var halfRight = width - halfLeft;
		var right = width - 1;
		var bottom = height - 1;
		
		canvas.width = width;
		canvas.height = height;
		var context = canvas.getContext('2d');
		
		var imageData = context.getImageData(0, 0, width, height);
		var data = imageData.data;
		
		// draw outer box
		var startData = 0;
		for (j = 0; j < height; j += 1) {
			for (i = 0; i < width; i += 1) {
				if (i == 0 || j == 0 || i == right || j == bottom || i == half || i == halfLeft | i == halfRight) {
					data[startData] = data[startData + 1] = data[startData + 2] = 222;
				} else {
					data[startData] = data[startData + 1] = data[startData + 2] = 255;
				}
				data[startData + 3] = 255;
				startData += 4;
			}
		}
		
		// find histogram max
		var max = 0;
		for (i = 0; i < 256; i++) {
			if (histogram[i] > max) {
				max = histogram[i];
			}
		}
		
		// draw histogram
		var value;
		var flatIdx;
		for (i = 0; i < 256; i++) {
			value = histogram[i] / max * (height - 20);
			for (j = 0; j < value; j++) {
				flatIdx = Mather.transformToFlat(i + 1, height - 2 - j, width);
				data[flatIdx] = data[flatIdx + 1] = data[flatIdx + 2] = 0;
			}
		}
		
		context.putImageData(imageData, 0, 0);
	},
};