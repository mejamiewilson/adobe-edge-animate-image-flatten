var fs = require('fs'),
	path = require('path'),
	through = require('through2'),
	q = require('q');

var edgeImageDirectory,
	edgeFile,
	imageDictionary = {};

function adobeEdgeAnimateSVGFlatten(opts) {

	edgeImageDirectory = opts.imageDirectory + "/";

    var stream = through.obj(function (file, enc, callbackStream) {

    	var s = this;

    	/* Read out the file */
    	edgeFile = file.toString( "utf8" );

    	/* Replace the image directory with the data url string for base64 xml */
    	edgeFile = edgeFile.replace(/var im='(.*?)'/, 'var im=\'data:image/svg+xml;base64,\'');

    	/* Get all SVG image names */
    	var images = edgeFile.match(/([a-z\-_0-9\/\:\.]*\.(svg))/ig);

    	/* Create a get job for each SVG file */
    	var imageJobs = [];

    	for(var i = 0; i < images.length; i++) {

    		imageJobs.push(processImageJob(images[i]));

    	}

    	/* Execute image jobs */
    	q.all(imageJobs).then(function() {

    		/* Replace images in the file with their base64 equivalent */
    		for(var x in imageDictionary) {

    			if(x.indexOf(".svg") !== -1) {

    				edgeFile = edgeFile.replace(x, imageDictionary[x]);

    			}

    		}

    		s.push(edgeFile);

    		callbackStream();

    	});

    });

    // returning the file stream
    return stream;
};

function processImageJob (image) {

	var deferred = q.defer();

	fs.readFile(edgeImageDirectory + image, 'UTF-8', function(err, data) {

	    if (err) {

	        deferred.reject(new Error(err));

	    } else {

	    	var base64data = new Buffer(data).toString('base64');

	    	imageDictionary[image] = base64data;

	        deferred.resolve(base64data);

	    }
		
	});

	return deferred.promise;

};

module.exports = adobeEdgeAnimateSVGFlatten;
