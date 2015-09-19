var file = Elementer.create('input', 'file');
file.setAttribute('type', 'file');
file.onchange = function () {
	if (this.files && this.files[0]) {
		Inputter.read(this.files[0]);
	}
};
var p = Elementer.create('p');
p.appendChild(file);
var form = Elementer.create('form');
form.appendChild(p);
document.body.appendChild(form);

var Inputter = {
	imageData: null, // imageData
	read: function (file) {
		var i;
		
		// reset
		Elementer.remove('preview');
		Elementer.remove('histogram');
		Elementer.remove('chaincode');
		Logger.log('Processing...');
		
		var reader = new FileReader();
		reader.onload = function (e) {
			var image = new Image();
			image.onload = function(e) {
				var size = Mather.getResize(image.naturalWidth, image.naturalHeight, 1448); // get resized size
				var input = Imager.fromImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, size.width, size.height); // create context
				
				// make grayscale image
				var inputData = input.getImageData(0, 0, size.width, size.height);
				Imager.toGrayScale(inputData.data);
				var orig = Imager.fromData(inputData, 0, 0, size.width, size.height);
				Inputter.imageData = inputData.data;
				
				// draw preview
				setTimeout(function () {
					var img = Elementer.create('img');
					var preview = Elementer.create('p', 'preview');
					preview.appendChild(img);
					document.body.appendChild(preview);
					
					img.width = 300;
					img.height = Math.round(img.width / size.width * size.height);
					img.src = orig.canvas.toDataURL();
				}, 1);
				
				// draw histogram
				setTimeout(function () {
					var canvas = Elementer.create('canvas');
					var histogram = Elementer.create('p', 'histogram');
					histogram.appendChild(canvas);
					document.body.appendChild(histogram);
					
					var histogramData = Imager.createHistogram(inputData.data);
					Imager.drawHistogram(canvas, histogramData);
				}, 1);
				
				// draw chaincode
				setTimeout(function () {
					var chaincode = Elementer.create('div', 'chaincode');
					document.body.appendChild(chaincode);
					var button = Elementer.create('button');
					button.textContent = 'Get Chain Code';
					button.onclick = function () {
						var log = Elementer.create('p', 'logChaincode');
						log.textContent = 'Processing...';
						chaincode.appendChild(log);
						setTimeout(function () {
							var chainer = new Chainer(Inputter.imageData, size.width, size.height);
							var codes = chainer.getCode();
							Elementer.remove('logChaincode');
							
							for (i = 0; i < codes.length; i++) {
								var code = Elementer.create('p');
								code.textContent = codes[i].code;
								code.style.wordWrap = 'break-word';
								chaincode.appendChild(code);
							}
						}, 1000);
					};
					chaincode.appendChild(button);
				}, 1);
				
				Logger.clear();
			};
			image.src = e.target.result;
		};
		reader.readAsDataURL(file);
	},
};