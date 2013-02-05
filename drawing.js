function drawPaths(stage){

var draggedObject; // flag for dragging stuff around
//var selectedObject; // flag for whatever we're manipulating
var pointsRecorded;
var currentObject;


var objLayer = new Kinetic.Layer();

var activePath = new Kinetic.Path({
    x: 0,
    y: 0,
    data: undefined,
    stroke: penColor,
    scale: 1,
    strokeWidth: penThickness
});

//alert(activePath.rawX); //this is promising maybe
var objectCollection = [];
var rawX = [];
var rawY = [];
var pathXmin;
var pathXmax;
var pathYmin;
var pathYmax;

var drawnObjects = []; // array of drawn object coordinates to create paths

  
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
	    } 
	    else { // otherwise don't need it
	    	drawnObjects[currentObject].push( mousePos.x + "," + mousePos.y ); // the moveTo points	
	    }
	    rawX[pointsRecorded-1]=mousePos.x;
	    rawY[pointsRecorded-1]=mousePos.y;
	  	activePath.setData( parsePath( drawnObjects[currentObject].toString() ) ); // update the active path
	  	activePath.setStroke(penColor);
	  	activePath.setStrokeWidth(penThickness);  	
	}
  	objLayer.draw();
  	pointsRecorded++; // eventually for smoothing
});
  
stage.getContainer().addEventListener("mouseup", function(touchEvt) {
		if(currentObject !== undefined) {
	  		objectCollection.push(
				new Kinetic.Path({ 
					x: activePath.getX(),
	    		    y: activePath.getY(),
	    			data: activePath.getData(),
	    			offset:[activePath.getWidth()/2, activePath.getHeight()/2],
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
					this.setFill('red');
					pathXmin = Math.min.apply(null, rawX);
					pathXmax = Math.max.apply(null, rawX);
					pathYmin = Math.min.apply(null, rawY);
					pathYmax = Math.max.apply(null, rawY);
 					this.setOffset([(pathXmax-pathXmin)/2, (pathYmax-pathYmin)/2]);
				} 
				else 
				{ 
					this.setFill('');
					selectedObject = undefined;
				};
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
objLayer.add(activePath);
stage.add(objLayer);

};
