var fs = require('fs'),
	path = require('path');

var edgeFile,
	edgeFileLocation,
	edgeImageDirectory,
	images;

module.exports = function(uri, options) {

	console.info("Starting compression");

	edgeFileLocation = uri;

	edgeImageDirectory = path.dirname(uri) + "/images/";

	fs.readFile(uri, 'UTF-8', function(err, data) {

		//save in memory
		edgeFile = data;

		//replace the file directory 
		edgeFile = edgeFile.replace(/var im='(.*?)'/, 'var im=\'data:image/svg+xml;base64,\'');

		//get the SVG files
		images = edgeFile.match(/([a-z\-_0-9\/\:\.]*\.(svg))/ig);

		if(images) {
			processImages();
		}
		else {
			complete();
		}

	});	

};

function processImages() {

	if(images.length > 0) {
		
		processImage(images[0]);
		
	} else {

		complete();

	}

}

function processImage(image) {
	
	images.shift();
	
	fs.readFile(edgeImageDirectory + image, 'UTF-8', function(err, data) {

		var base64data = new Buffer(data).toString('base64');
		
		edgeFile = edgeFile.replace(image, base64data);
		
		processImages();

	});

}


function complete() {

	fs.writeFile(edgeFileLocation, edgeFile, function (err) {
		
		if (err) throw err;
		console.log("Compression completed");

	});

	
}