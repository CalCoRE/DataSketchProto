//color picker
var penColor="grey";

function colorRed()
{
	penColor = "red";
};

function colorBlue()
{
	penColor = "blue";
};

function colorGreen()
{
	penColor = "green";
};

function colorYellow()
{
	penColor = "yellow";
};

function colorBlack()
{
	penColor = "black";
};

//pen thickness
var penThickness= 10;

function penThin()
{
	penThickness = 5;
};

function penRegular()
{
	penThickness = 10;
};

function penThick()
{
	penThickness = 20;
};


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
	//var mouseOnSelectedObject = true;
  
  var stage = new Kinetic.Stage({
    container: "container",
    width: 500,
    height: 500,
    listening: true
	});

var scrollstage = new Kinetic.Stage({
	container: "container",
	width: 500,
	height: 500
	});

	var layer = new Kinetic.Layer();
  	var objLayer = new Kinetic.Layer();
  	
  	var areas = new Kinetic.Group();
    var scrollbars = new Kinetic.Group();
  
        var hscrollArea = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 30,
        width: stage.getWidth() - 40,
        height: 20,
        fill: 'black',
        opacity: 0.3
      });

      var hscroll = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 30,
        width: 130,
        height: 20,
        fill: '#9f005b',
        draggable: true,
        dragBoundFunc: function(pos) {
          var newX = pos.x;
          if(newX < 10) {
            newX = 10;
          }
          else if(newX > stage.getWidth() - 160) {
            newX = stage.getWidth() - 160;
          }
          return {
            x: newX,
            y: this.getAbsolutePosition().y
          }
        },
        opacity: 0.9,
        stroke: 'black',
        strokeWidth: 1
      });
      
    var hText = new Kinetic.Text({
    	x: 375,
   	 	y: stage.getHeight() - 30,
    	text: 'Width',
    	fontSize: 20,
    	fontFamily: 'Calibri',
    	textFill: 'black'
	});
      
      
      
      
        var hscrollArea2 = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 60,
        width: stage.getWidth() - 40,
        height: 20,
        fill: 'black',
        opacity: 0.3
      });

      var hscroll2 = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 60,
        width: 130,
        height: 20,
        fill: '#9f005b',
        draggable: true,
        dragBoundFunc: function(pos) {
          var newX = pos.x;
          if(newX < 10) {
            newX = 10;
          }
          else if(newX > stage.getWidth() - 160) {
            newX = stage.getWidth() - 160;
          }
          return {
            x: newX,
            y: this.getAbsolutePosition().y
          }
        },
        opacity: 0.9,
        stroke: 'black',
        strokeWidth: 1
      });
      
    var hText2 = new Kinetic.Text({
    	x: 375,
   	 	y: stage.getHeight() - 60,
    	text: 'Height',
    	fontSize: 20,
    	fontFamily: 'Calibri',
    	textFill: 'black'
	});
	
	
	    var hscrollArea3 = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 90,
        width: stage.getWidth() - 40,
        height: 20,
        fill: 'black',
        opacity: 0.3
      });

      var hscroll3 = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 90,
        width: 130,
        height: 20,
        fill: '#9f005b',
        draggable: true,
        dragBoundFunc: function(pos) {
          var newX = pos.x;
          if(newX < 10) {
            newX = 10;
          }
          else if(newX > stage.getWidth() - 160) {
            newX = stage.getWidth() - 160;
          }
          return {
            x: newX,
            y: this.getAbsolutePosition().y
          }
        },
        opacity: 0.9,
        stroke: 'black',
        strokeWidth: 1
      });
      
    var hText3 = new Kinetic.Text({
    	x: 375,
   	 	y: stage.getHeight() - 90,
    	text: 'Opacity',
    	fontSize: 20,
    	fontFamily: 'Calibri',
    	textFill: 'black'
	});
	
	
	var hscrollArea4 = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 120,
        width: stage.getWidth() - 40,
        height: 20,
        fill: 'black',
        opacity: 0.3
      });

      var hscroll4 = new Kinetic.Rect({
        x: 10,
        y: stage.getHeight() - 120,
        width: 130,
        height: 20,
        fill: '#9f005b',
        draggable: true,
        dragBoundFunc: function(pos) {
          var newX = pos.x;
          if(newX < 10) {
            newX = 10;
          }
          else if(newX > stage.getWidth() - 160) {
            newX = stage.getWidth() - 160;
          }
          return {
            x: newX,
            y: this.getAbsolutePosition().y
          }
        },
        opacity: 0.9,
        stroke: 'black',
        strokeWidth: 1
      });
      
    var hText4 = new Kinetic.Text({
    	x: 375,
   	 	y: stage.getHeight() - 120,
    	text: 'Rotation',
    	fontSize: 20,
    	fontFamily: 'Calibri',
    	textFill: 'black'
	});
       
      
        var updateObjWidth = function() {
        	var x = (hscroll.getPosition().x-10);
        	//selectedObject.translate(stage.getWidth()/2, stage.getHeight()/2);
			if (x < 20)
        	{
        	}
        	else if (x < stage.getWidth() - 200)
        	{
        		selectedObject.setScale(x/100,1);
        	}
        	else
        	{
        		selectedObject.setScale(stage.getWidth() - 200,1);

        	}
      	};

        var updateObjHeight = function() {
        	var x = (hscroll2.getPosition().x-10);
        	//selectedObject.translate(stage.getWidth()/2, stage.getHeight()/2);
			if (x < 20)
        	{
        	}
        	else if (x < stage.getWidth() - 200)
        	{
        		selectedObject.setScale(1,x/100);
        	}
        	else
        	{
        		selectedObject.setScale(1,stage.getWidth() - 200);

	        }
      	};
      	
      	 var updateObjOpacity = function() {
        	var x = (hscroll3.getPosition().x-10);
			if (x < 20)
        	{
        	}
        	else if (x < stage.getWidth() - 200)
        	{
        		selectedObject.setOpacity(x/1000);
        	}
        	else
        	{
        		selectedObject.setOpacity((stage.getWidth() - 200)/10);

	        }
      	};
      	
      	 var updateObjRotation = function() {
        	var x = (hscroll4.getPosition().x-10);
			if (x < 20)
        	{
        	}
        	else if (x < stage.getWidth() - 200)
        	{
        		selectedObject.rotate(x/1000);
        	}
        	else
        	{
        		selectedObject.setOpacity((stage.getWidth() - 200)/10);

	        }
      	};

	
	scrollbars.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
      });
      scrollbars.on('mouseout', function() {
        document.body.style.cursor = 'default';
      });

      hscroll.on('dragmove', updateObjWidth);
      hscroll2.on('dragmove', updateObjHeight);
      hscroll3.on('dragmove', updateObjOpacity);
      hscroll4.on('dragmove', updateObjRotation);

  var activePath = new Kinetic.Path({
    x: 0,
    y: 0,
    data: undefined,
    stroke: penColor,
    scale: 1,
    strokeWidth: penThickness,
  });
  



  
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
	  	activePath.setStroke(penColor);
	  	activePath.setStrokeWidth(penThickness);  	
	  }
  	objLayer.draw();
  	pointsRecorded++; // eventually for smoothing
  });
  
  stage.getContainer().addEventListener("mouseup", function(touchEvt) {
  
  
		if( currentObject !== undefined ) {
	  	//output.innerHTML = drawnObjects[currentObject].toString(); // debug
	  	//output.innerHTML = drawnObjects[currentObject].toString(); // debug
	  	
	  	objectCollection.push(
				new Kinetic.Path({ x: activePath.getX(),
	    		                 y: activePath.getY(),
	    										 data: activePath.getData(),
	    										 stroke: penColor,
	    										 strokeWidth: penThickness,
	    										 draggable: true
	  		})
			);
			
			// when an object is double clicked, call it 'selected' and make it listen to sliders however
			// double click on the object to deselect 
			objectCollection[objectCollection.length - 1].on("dblclick dbltap", function(){
				if(selectedObject === undefined) {
					selectedObject = this;
					this.setOpacity(0.5);
					//this.setScale(2,1);
				} else { 
					this.setOpacity(1);
					selectedObject = undefined;
				};
			});
			
// all of this code was an attempt to deselect object when doubleclick anywhere on stage
 
// 	if(selectedObject !== undefined)
// 	{
//       selectedObject.on("mouseover", function() {
//         mouseOnSelectedObject = true;
//         output.innerHTML = "on object";
//       });
//       selectedObject.on("mouseout", function() {
//         mouseOnSelectedObject = false;
//      	output.innerHTML = "not on object";
//       });
// 	}
// 		
//   // "dblclick dbltap" not working and not sure why...
//   // need to find a way to recognize a doubleclick on stage or object but not on selected object
//   stage.getContainer().addEventListener("dblclick", function(){
//   		//alert(selectedObject);
// 				if(selectedObject !== undefined) {
// 					if(!mouseOnSelectedObject){
// 					alert("you turned off");
// 					selectedObject.setStroke('grey');
// 					selectedObject = undefined;
// 					output.innerHTML = "you dblclicked outside";
// 					}
// 				}
// 				
// 
// 				//alert(2);
// 			});


	
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


      areas.add(hscrollArea);
      scrollbars.add(hscroll);
      scrollbars.add(hText);
      
      areas.add(hscrollArea2);
      scrollbars.add(hscroll2);
      scrollbars.add(hText2);
      
      areas.add(hscrollArea3);
      scrollbars.add(hscroll3);
      scrollbars.add(hText3);
      
      areas.add(hscrollArea4);
      scrollbars.add(hscroll4);
      scrollbars.add(hText4);      
      
      layer.add(areas);
      layer.add(scrollbars);
  // add the shape to the layer
  objLayer.add(activePath);
  layer.add(hscrollArea);
  layer.add(hscroll);

  // add the layer to the stage
  scrollstage.add(layer);
  stage.add(objLayer);
}

