#Adobe Edge Animate - Image Flatten

Adobe Edge Animate published animations store the images in a directory alongside the main files. For small animations this means many round trips to the server just to load the assets. 

    npm install adobe-edge-animate-image-flatten --save-dev
	
From test.js:

    var flatten = require('adobe-edge-animate-image-flatten');

    //read file
    fs.createReadStream(path.resolve(__dirname, 'sample/publish/web/sample-project-file_edge.js'))

    //flatten task
    .pipe(flatten({imageDirectory: path.resolve(__dirname, 'sample/publish/web/images')}))

To do: 

- Create gulp task
- Create proper test
- Support image formats other than SVG