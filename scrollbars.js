var hscroll;
var hscroll2;
var hscroll3;
var hscroll4;
var hscroll5;

function makeScrollbars(scrollstage){

var layer = new Kinetic.Layer();

var areas = new Kinetic.Group();
var scrollbars = new Kinetic.Group();
  
var hscrollArea = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 30,
    width: scrollstage.getWidth() - 40,
    height: 20,
    fill: 'black',
    opacity: 0.3
});

 hscroll = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 30,
    width: 130,
    height: 20,
    fill: '#9f005b',
    draggable: true,
    dragBoundFunc: function(pos) {
    	var newX = pos.x;
        if(newX < 10) {
            newX = 10;
        }
        else if(newX > scrollstage.getWidth() - 160) {
            newX = scrollstage.getWidth() - 160;
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
   	y: scrollstage.getHeight() - 30,
    text: 'Width',
    fontSize: 20,
    fontFamily: 'Calibri',
    textFill: 'black'
});
      
      
var hscrollArea2 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 60,
    width: scrollstage.getWidth() - 40,
    height: 20,
    fill: 'black',
    opacity: 0.3
});

 hscroll2 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 60,
    width: 130,
    height: 20,
    fill: '#9f005b',
    draggable: true,
    dragBoundFunc: function(pos) {
        var newX = pos.x;
        if(newX < 10) {
        	newX = 10;
        }
        else if(newX > scrollstage.getWidth() - 160) {
            newX = scrollstage.getWidth() - 160;
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
   	y: scrollstage.getHeight() - 60,
    text: 'Height',
    fontSize: 20,
    fontFamily: 'Calibri',
    textFill: 'black'
});
	
	
var hscrollArea3 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 90,
    width: scrollstage.getWidth() - 40,
    height: 20,
    fill: 'black',
    opacity: 0.3
});

 hscroll3 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 90,
    width: 130,
    height: 20,
    fill: '#9f005b',
    draggable: true,
    dragBoundFunc: function(pos) {
        var newX = pos.x;
        if(newX < 10) {
            newX = 10;
        }
        else if(newX > scrollstage.getWidth() - 160) {
            newX = scrollstage.getWidth() - 160;
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
   	y: scrollstage.getHeight() - 90,
    text: 'Opacity',
    fontSize: 20,
    fontFamily: 'Calibri',
    textFill: 'black'
});
	
	
var hscrollArea4 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 120,
    width: scrollstage.getWidth() - 40,
    height: 20,
    fill: 'black',
    opacity: 0.3
});

 hscroll4 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 120,
    width: 130,
    height: 20,
    fill: '#9f005b',
    draggable: true,
    dragBoundFunc: function(pos) {
        var newX = pos.x;
        if(newX < 10) {
            newX = 10;
        }
        else if(newX > scrollstage.getWidth() - 160) {
            newX = scrollstage.getWidth() - 160;
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
   	y: scrollstage.getHeight() - 120,
    text: 'Rotation',
    fontSize: 20,
    fontFamily: 'Calibri',
    textFill: 'black'
});

var hscrollArea5 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 150,
    width: scrollstage.getWidth() - 40,
    height: 20,
    fill: 'black',
    opacity: 0.3
});

 hscroll5 = new Kinetic.Rect({
    x: 10,
    y: scrollstage.getHeight() - 150,
    width: 130,
    height: 20,
    fill: '#9f005b',
    draggable: true,
    dragBoundFunc: function(pos) {
        var newX = pos.x;
        if(newX < 10) {
            newX = 10;
        }
        else if(newX > scrollstage.getWidth() - 160) {
            newX = scrollstage.getWidth() - 160;
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
      
var hText5 = new Kinetic.Text({
    x: 375,
   	y: scrollstage.getHeight() - 150,
    text: 'Skins',
    fontSize: 20,
    fontFamily: 'Calibri',
    textFill: 'black'
});

scrollbars.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
});
scrollbars.on('mouseout', function() {
    document.body.style.cursor = 'default';
});



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

areas.add(hscrollArea5);
scrollbars.add(hscroll5);
scrollbars.add(hText5);       
      
layer.add(areas);
layer.add(scrollbars);
scrollstage.add(layer);

hscroll.on('dragmove', updateObjWidth);
hscroll2.on('dragmove', updateObjHeight);
hscroll3.on('dragmove', updateObjOpacity);
hscroll4.on('dragmove', updateObjRotation);
hscroll5.on('dragmove', updateObjSkin);

};

changeWidth = function(obj, widthScale) {
					//alert("raw data orig " + obj.rawData);
					//alert("raw data x " + obj.rawX);
					//alert("prased data orig " + obj.getData());
					normed = getNormalized( obj.rawX , obj.rawY );
					//alert("nromed x " + normed[0]);
				  Xpoints = normed[0].map(function(x) {return x * widthScale}); // scale appropriately
					obj.rawX = Xpoints.map(function(x) {return x + normed[2]}); // move back to original center
					
					//alert("first getdata " + obj.getData());
					pathFromRaw = buildPathFromRaw( obj.rawX, obj.rawY );
					//alert("path from raw " + pathFromRaw.toString());
					
					parsedPath = parsePath( pathFromRaw );
					//alert("from object " + obj.getData());
					//alert("from parsedPath " + parsedPath);
					//alert()
					obj.setData( parsedPath );
					//alert(obj.getData().toString());
					//obj.draw();
						
}
       
var updateObjWidth = function() {

    var x = (hscroll.getPosition().x-10);
	if (x < 20)
    {
    }
    else if (x < 300)
    {
        //selectedObject.setScale(x/100,1);
        changeWidth(selectedObject, x/100);
    }
    else
    {
    	selectedObject.setScale(300,1);
    }
};

var updateObjHeight = function() {
	var x = (hscroll2.getPosition().x-10);
	if (x < 20)
    {
    }
    else if (x < 300)
    {
    	selectedObject.setScale(1,x/100);
    }
    else
    {
        selectedObject.setScale(1,300);
	}
};
      	
var updateObjOpacity = function() {
    var x = (hscroll3.getPosition().x-10);
	if (x < 20)
    {
        	selectedObject.setOpacity(0.5);
    }
    else if (x < 300)
    {
    	selectedObject.setOpacity(x/1000);
    }
    else
    {
        selectedObject.setOpacity(3);
	}
};
      	
var updateObjRotation = function() {
    var x = (hscroll4.getPosition().x-10);
	if (x < 20)
    {
    }
	else if (x < 300)
    {
        selectedObject.rotate(x/1000);
    }
    else
    {
        selectedObject.rotate(30);
    }
};

var updateObjSkin = function() {
    var x = (hscroll5.getPosition().x-10);
	if (x < 20)
    {
    }
	else if (x < 300)
    {
    	if(selectedObject.skin !== undefined){
        	selectedObject.setData() = selectedObject.skin;
        }
    }
    else
    {
		if(selectedObject.skin2 !== undefined){
        	selectedObject.data = selectedObject.skin2;
        }
    }
};

