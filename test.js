function buildPath( pointsArray ) {
	var path = "";
	for( i = 0 ; i < pointsArray.length; i++) {
		points = pointsArray[i]
		if( i == 0 ) {
			path += "M" + points[0] + "," + points[1];
		} else {
			path += "R" + points[0] + "," + points[1];
		}
	}
}

function parsePath( data ) {
  var pathArray = [];
  var lastX = "";
  var lastY = "";

  var d = data;
  if ( -1 != data.search(/[rR]/) ) {
    // no need to redraw the path if no Catmull-Rom segments are found
    
    // split path into constituent segments
    var pathSplit = d.split(/([A-Za-z])/);
    for (var i = 0, iLen = pathSplit.length; iLen > i; i++) {
      var segment = pathSplit[i];
    
      // make command code lower case, for easier matching
      // NOTE: this code assumes absolution coordinates, and doesn't account for relative command coordinates
      var command = segment.toLowerCase()
      if ( -1 != segment.search(/[A-Za-z]/) ) {
        var val = "";
        if ( "z" != command ) {
          i++;
          val = pathSplit[ i ].replace(/\s+$/, '');
        }

        if ( "r" == command ) {
          // "R" and "r" are the a Catmull-Rom spline segment

          var points = lastX + "," + lastY + " " + val;

          // convert Catmull-Rom spline to Bézier curves
          var beziers = catmullRom2bezier( points );
          //insert replacement curves back into array of path segments
          pathArray.push( beziers );
        } else {
          // rejoin the command code and the numerical values, place in array of path segments
          pathArray.push( segment + val );

          // find last x,y points, for feeding into Catmull-Rom conversion algorithm
          if ( "h" == command ) {
            lastX = val;
          } else if ( "v" == command ) {
            lastY = val;
          } else if ( "z" != command ) {
            var c = val.split(/[,\s]/);
            lastY = c.pop();
            lastX = c.pop();
          }
        }
      }
    }
    // recombine path segments and set new path description in DOM
    return pathArray.join(" ");
  }
}



function catmullRom2bezier( points ) {
  // alert(points)
  var crp = points.split(/[,\s]/);
  
  var d = "";
  for (var i = 0, iLen = crp.length; iLen - 2 > i; i+=2) {
    var p = [];
    if ( 0 == i ) {
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
      p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
    } else if ( iLen - 4 == i ) {
      p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
    } else {
      p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
      p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
      p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
      p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
    }
    
    // Catmull-Rom to Cubic Bezier conversion matrix 
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    var bp = [];
    bp.push( { x: p[1].x,  y: p[1].y } );
    bp.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
    bp.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
    bp.push( { x: p[2].x,  y: p[2].y } );

    d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";
  }
  
  return d;
}

var objectCollection = [];

var drawnObjects = []; // array of drawn object coordinates to create paths
	
window.onload = function(){
	var draggedObject; // flag for dragging stuff around
	var selectedObject; // flag for whatever we're manipulating
	var pointsRecorded;
	var currentObject;
  
  var stage = new Kinetic.Stage({
    container: "container",
    width: 500,
    height: 500,
    listening: true
	});

  var objLayer = new Kinetic.Layer();


  var activePath = new Kinetic.Path({
    x: 0,
    y: 0,
    data: undefined,
    stroke: 'green',
    scale: 1,
    strokeWidth: 10,
  });
  
  stage.getContainer().addEventListener("dblclick dbltap", function(){
				if(selectedObject !== undefined) {
					selectedObject.setStroke('grey');
					selectedObject = undefined;
				};
				output.innerHTML = "you dblclicked outside";
			});

  
  /// START DEFINING THE PATH USING MOUSE EVENTS
  // if a touchdown happens on an *object*, store it as target and ignore the rest
  stage.getContainer().addEventListener("mousedown", function() {
	  if( draggedObject === undefined ) {
	  
			//activePath.setData('');
	    var mousePos = stage.getMousePosition();
	  	currentObject = drawnObjects.length; // next object index
	    drawnObjects[currentObject] = []; // new data array for path
	  	drawnObjects[currentObject].push("M"+ mousePos.x + "," + mousePos.y ); // the moveTo points
  		pointsRecorded = 1; // eventually use this to smooth
  	}
  	objLayer.draw();
  });
  
  // WHILE I'M STILL DRAGGING...
  // if there's not a target then do this.
  stage.getContainer().addEventListener("mousemove", function(touchEvt) {
		if( currentObject !== undefined ) {
	    var mousePos = stage.getMousePosition();
	    if( pointsRecorded == 1 ) { // if it's the first point put the R
	    	drawnObjects[currentObject].push("R"+ mousePos.x + "," + mousePos.y ); // the moveTo points	
	    } else { // otherwise don't need it
	    	drawnObjects[currentObject].push( mousePos.x + "," + mousePos.y ); // the moveTo points	
	    }
	  	activePath.setData( parsePath( drawnObjects[currentObject].toString() ) ); // update the active path
	  	activePath.setStroke('green');  	
	  }
  	objLayer.draw();
  	pointsRecorded++; // eventually for smoothing
  });
  
  stage.getContainer().addEventListener("mouseup", function(touchEvt) {
		if( currentObject !== undefined ) {
	  	output.innerHTML = drawnObjects[currentObject].toString(); // debug
	  	output.innerHTML = drawnObjects[currentObject].toString(); // debug
	  	
	  	//this is pushing to an array… you just need the new kinetic.path stuff inside
	  	objectCollection.push(
				new Kinetic.Path({ x: activePath.getX(),
	    		                 y: activePath.getY(),
	    										 data: activePath.getData(),
	    										 stroke: 'grey',
	    										 strokeWidth: 10,
	    										 draggable: true
	  		})
			);
			
			// END OF RELEVANT STUFF
			
			// NONE OF THIS IS IMPORTANT FOR DEFINING THE SHAPE
			// when an object is double clicked, call it 'selected' and make it listen to sliders however
			objectCollection[objectCollection.length - 1].on("dblclick dbltap", function(){
				if(selectedObject === undefined) {
					selectedObject = this;
					this.setStroke('red');
					this.setRotationDeg(30);
					this.setScale(2,1);
				} else { 
					selectedObject = undefined;
					this.setStroke('grey');
				};
				output.innerHTML = "you dblclicked";
			});
			
			objectCollection[objectCollection.length - 1].on("mouseover", function(){
				draggedObject = this;
			});
			
			// TODO - this needs more nuance, not just on mouseout but some kind of release.
			objectCollection[objectCollection.length - 1].on("mouseout", function(){
				draggedObject = undefined;
			});
			
			objLayer.add(objectCollection[objectCollection.length - 1]);
			currentObject = undefined;
			activePath.setData('');
			objLayer.draw();
		}
  });
  
  
  
  /*stage.on("click", function(touchEvt) {
  	path.draw();
  });*/
  
  
  //path.data = parsePath(data);

  // add the shape to the layer
  objLayer.add(activePath);

  // add the layer to the stage
  stage.add(objLayer);
}

