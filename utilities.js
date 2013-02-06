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

function buildPathFromRaw( xArray , yArray ) {
	var path = "";
	for( i = 0 ; i < xArray.length; i++) {
		xPoint = xArray[i];
		yPoint = yArray[i];
		if( i == 0 ) {
			path += "M" + xPoint + "," + yPoint;
		} else if( i == 1 ) {
			path += "R" + xPoint + "," + yPoint;
		} else {
			path += xPoint + "," + yPoint;
		}
	}
	return path;
}

function getNormalized( xArray , yArray ) {
	
	xmin = Math.min.apply(null, xArray);
	xmax = Math.max.apply(null, xArray);
	ymin = Math.min.apply(null, yArray);
	ymax = Math.max.apply(null, yArray);
	
	distX = ( xmax - xmin );
	distY = ( ymax - ymin );

	offsetX = distX / 2 + xmin;
	offsetY = distY / 2 + ymin;
	
	// move to center
	
	
	// shrink to unit 1
	
	
	//return normalized points, distances, and offsets
	returnData = [ xArray.map(function(x) {return x - offsetX}) , yArray.map(function(y) {return y - offsetY}) , offsetX , offsetY ];
	
	return returnData;
}

function changeWidth( xArray, yArray ) {
	
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
