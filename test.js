var flatten 	= require('./index'),
	path 		= require('path'),
	fs 			= require('fs');

//read file
fs.createReadStream(path.resolve(__dirname, 'sample/publish/web/sample-project-file_edge.js'))
  
//flatten task
.pipe(flatten({imageDirectory: path.resolve(__dirname, 'sample/images')}))

.on('data', function (data) {

	console.log("Tests:");

	console.log('Image directory should be the base64 image string: ' + (data.indexOf("var im='data:image/svg+xml;base64,';") !== -1 ? "pass" : "fail"));

	console.log('There should be no .svg strings: ' + (data.indexOf(".svg") === -1 ? "pass" : "fail"));

})

.on('end', function () {

	console.log("Done");

});
