VectorEditor.prototype.deleteSelection = function(){
  while(this.selected.length > 0){
    this.deleteShape(this.selected[0])
  }
}

VectorEditor.prototype.deleteShape = function(shape,nofire){
  if(!nofire){if(this.fire("delete",shape)===false)return;}

  if(shape && shape.node && shape.node.parentNode){
    shape.remove()
  }
  for(var i = 0; i < this.trackers.length; i++){
    if(this.trackers[i].shape == shape){
      this.removeTracker(this.trackers[i]);
    }
  }
  for(var i = 0; i < this.shapes.length; i++){
    if(this.shapes[i] == shape){
      this.shapes.splice(i, 1)
    }
  }
  for(var i = 0; i < this.selected.length; i++){
    if(this.selected[i] == shape){
      this.selected.splice(i, 1)
    }
  }
  //should remove references, but whatever
}

VectorEditor.prototype.deleteAll = function(){
  this.fire("clear2")
  this.draw.clear()
  this.shapes = []
  this.trackers = []
}

VectorEditor.prototype.clearShapes = function(){
  this.fire("clear")
  while(this.shapes.length > 0){
    this.deleteShape(this.shapes[0],true) //nofire
  }
}

VectorEditor.prototype.generateUUID = function(){
  var uuid = "", d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 4/*16*/; i++){
    uuid += d.charAt(Math.floor(Math.random()*(i?d.length:(d.length-10))));
  }
  return uuid;
}

VectorEditor.prototype.getShapeById = function(v){
  for(var i=this.shapes.length;i--&&this.shapes[i].id!=v;);
  return this.shapes[i]
}

VectorEditor.prototype.addShape = function(shape,no_select, no_fire){
  if(!no_fire)this.fire("addshape",shape,no_select);
  shape.node.shape_object = shape
  // mhwj start out with a center in the center
  if(!no_select){
    this.selected = [shape]
  }
  this.shapes.push(shape)
  if(!no_fire)this.fire("addedshape",shape,no_select);
}

VectorEditor.prototype.addSkin = function(shape,no_select, no_fire, skinIndex){
  if(!no_fire)this.fire("addshape",shape,no_select);
  shape.node.shape_object = shape
  if(!no_select){
    this.selected = [shape]
  }
  this.skins[skinIndex]=shape;
  //this.skins.push(shape)
  if(!no_fire)this.fire("addedshape",shape,no_select);
}

VectorEditor.prototype.addSkin2 = function(shape,no_select, no_fire, skinIndex){
  if(!no_fire)this.fire("addshape",shape,no_select);
  shape.node.shape_object = shape
  if(!no_select){
    this.selected = [shape]
  }
  this.skins2[skinIndex]=shape;
  //this.skins.push(shape)
  if(!no_fire)this.fire("addedshape",shape,no_select);
}

VectorEditor.prototype.addSkin3 = function(shape,no_select, no_fire, skinIndex){
  if(!no_fire)this.fire("addshape",shape,no_select);
  shape.node.shape_object = shape
  if(!no_select){
    this.selected = [shape]
  }
  this.skins3[skinIndex]=shape;
  //this.skins.push(shape)
  if(!no_fire)this.fire("addedshape",shape,no_select);
}

VectorEditor.prototype.addSkin4 = function(shape,no_select, no_fire, skinIndex){
  if(!no_fire)this.fire("addshape",shape,no_select);
  shape.node.shape_object = shape
  if(!no_select){
    this.selected = [shape]
  }
  this.skins4[skinIndex]=shape;
  //this.skins.push(shape)
  if(!no_fire)this.fire("addedshape",shape,no_select);
}

VectorEditor.prototype.rectsIntersect = function(r1, r2) {
  return r2.x < (r1.x+r1.width) &&
          (r2.x+r2.width) > r1.x &&
          r2.y < (r1.y+r1.height) &&
          (r2.y+r2.height) > r1.y;
}

VectorEditor.prototype.drawGrid = function(){
  this.draw.drawGrid(0, 0, 480, 272, 10, 10, "blue").toBack()
}

VectorEditor.prototype.move = function(shape, x, y){
  //HACKITY HACK HACK
  //var rot = null;
  //if(shape._ && shape._.rt){
  // rot = shape._.rt.deg
  //}
  
  //<here's the part that isn't a hack>
  shape.translate(x,y)

  //</end non-hack>
  
  //HACKITY HACK HACK
  //if(rot){
  // shape.rotate(rot,true)//absolutelyness
  //}
  //if(shape._ && shape._.rt){
  // shape.rotate(shape._.rt.deg, true)
  //}
}


VectorEditor.prototype.scale = function(shape, corner, x, y){
  var xp = 0, yp = 0
  var box = shape.getBBox()
  switch(corner){
    case "tr":
      xp = box.x
      yp = box.y + box.height
      break;
    case "bl":
      xp = box.x + box.width
      yp = box.y
      break;
    case "tl":
      xp = box.x + box.width;
      yp = box.y + box.height;
    break;
    case "br":
      xp = box.x
      yp = box.y
    break;
  }
  shape.scale(x, y, xp, yp)
}

VectorEditor.prototype.fixText = function(str){
  return window.Ax?Ax.textfix(str):str;
}

VectorEditor.prototype.resize = function(object, width, height, x, y){
//   if(object.type == "rect" || object.type == "image"){
//     if(width > 0){
//       object.attr("width", width)
//     }else{
//       object.attr("x", (x?x:object.attr("x"))+width)
//       object.attr("width", Math.abs(width))
//     }
//     if(height > 0){
//       object.attr("height", height)
//     }else{
//       object.attr("y", (y?y:object.attr("y"))+height)
//       object.attr("height", Math.abs(height))
//     }
//   }else if(object.type == "ellipse"){
//     if(width > 0){
//       object.attr("rx", width)
//     }else{
//       object.attr("x", (x?x:object.attr("x"))+width)
//       object.attr("rx", Math.abs(width))
//     }
//     if(height > 0){
//       object.attr("ry", height)
//     }else{
//       object.attr("y", (y?y:object.attr("y"))+height)
//       object.attr("ry", Math.abs(height))
//     }
//   }else if(object.type == "text"){
//     object.attr("font-size", Math.abs(width))
//     //object.node.style.fontSize = null;
//   }
}


//combine scale and rotate functions - with transform, is there still a way to separate width and height?
changeShape = function(){
	var width = document.getElementById('width').value/100;
	var height = document.getElementById('height').value/100;
	var rotation = document.getElementById('rotation').value;
	var xchange = document.getElementById('xchange').value;
	var ychange = document.getElementById('ychange').value;
	if(editor.selected[0] != undefined){
	var box = editor.selected[0].getBBox();
	var x = box.width;
	var y = box.height;
	var xp = box.x +x/2;
    var yp = box.y +y/2;
    var sc = "S" + width, height, xp, yp;
    var cs = "S" + height, width, xp, yp;
    var rt = "R"+rotation, xp, yp;
    var xc = "T"+xchange+ ",0";
    var yc = "T0," + -ychange;
	editor.selected[0].transform(sc+rt+cs+xc+yc);
	}
	editor.newTracker(editor.selected[0])
}

changeX = function(value){
	if(editor.selected[0] != undefined){
	var box = editor.selected[0].getBBox();
	var x = box.width;
	var xp = box.x +x/2;
	var xc = -xp;

	editor.selected[0].transform("T"+value+",0");
	}
	editor.updateTracker();
}

changeY = function(value){
	if(editor.selected[0] != undefined){
	var box = editor.selected[0].getBBox();
	var y = box.height;
    var yp = box.y +y/2;
    var yc = 700-value-yp;
	
	editor.selected[0].transform("T0," + -value);
	}
	editor.updateTracker();
}


changeOpacity = function(value){
	if(editor.selected[0] != undefined){
	editor.selected[0].attr({opacity:value/100});
	}
}


changeSkin = function(value){
//should we put in a way to click on 'skin' and change back to shape?
	if(editor.selected[0] != undefined){
	skinIndex=undefined;

	for(var i = 0; i < editor.shapes.length; i++){
      	if(editor.selected[0] == editor.shapes[i]){
      		skinIndex = i;
      	}
      }
    if(skinIndex == undefined){
    	for(var i = 0; i < editor.skins.length; i++){
      		if(editor.selected[0] == editor.skins[i]){
      		skinIndex = i;
      		}	
      	}
    }
    if(skinIndex == undefined){
    	for(var i = 0; i < editor.skins2.length; i++){
      		if(editor.selected[0] == editor.skins2[i]){
      		skinIndex = i;
      		}	
      	}
    }
    if(skinIndex == undefined){
    	for(var i = 0; i < editor.skins3.length; i++){
      		if(editor.selected[0] == editor.skins3[i]){
      		skinIndex = i;
      		}	
      	}
    }

//alert(editor.shapes.length);

// 		editor.selected[0].attr({skin:editor.selected[0].attr("path")})
// 		 	alert(editor.selected[0].attr("skin"));
			// 	editor.selected[0].attr({skin: M13}
		//alert(editor.selected[0].attr("skin"));
		
	//alert(editor.selected[0].attr("path")); //gives svg data
	if(value == 1){
		editor.shapes[skinIndex].show();
		if(editor.skins[skinIndex] != null){
		editor.skins[skinIndex].show();
		}
		if(editor.skins2[skinIndex] != null){
		editor.skins2[skinIndex].show();
		}
		if(editor.skins3[skinIndex] != null){
		editor.skins3[skinIndex].show();
		}
	}
	else if(value <= 100){
		editor.shapes[skinIndex].show();
		if(editor.skins[skinIndex] != null){
		editor.skins[skinIndex].hide();
		}
		if(editor.skins2[skinIndex] != null){
		editor.skins2[skinIndex].hide();
		}
		if(editor.skins3[skinIndex] != null){
		editor.skins3[skinIndex].hide();
		}
	}
	else if(value <= 200){
		editor.shapes[skinIndex].hide();
		if(editor.skins[skinIndex] != null){
		editor.skins[skinIndex].show();
		}
		if(editor.skins2[skinIndex] != null){
		editor.skins2[skinIndex].hide();
		}
		if(editor.skins3[skinIndex] != null){
		editor.skins3[skinIndex].hide();
		}
	}
	else if(value <= 300){
		editor.shapes[skinIndex].hide();
		if(editor.skins[skinIndex] != null){
		editor.skins[skinIndex].hide();
		}
		if(editor.skins2[skinIndex] != null){
		editor.skins2[skinIndex].show();
		}
		if(editor.skins3[skinIndex] != null){
		editor.skins3[skinIndex].hide();
		}
	}
	else{
		editor.shapes[skinIndex].hide();
		if(editor.skins[skinIndex] != null){
		editor.skins[skinIndex].hide();
		}
		if(editor.skins2[skinIndex] != null){
		editor.skins2[skinIndex].hide();
		}
		if(editor.skins3[skinIndex] != null){
		editor.skins3[skinIndex].show();
		}
	}
	}
}

hideThings = function(){
	if(editor.skins3[skinIndex] != null){
		editor.skins2[skinIndex].hide();
		editor.skins[skinIndex].hide();
		editor.shapes[skinIndex].hide();
	}
	else if(editor.skins2[skinIndex] != null){
		editor.skins[skinIndex].hide();
		editor.shapes[skinIndex].hide();
	}
	else if(editor.skins[skinIndex] != null){
		editor.shapes[skinIndex].hide();
	}
}


centerSkin = function(){
	if(editor.skins.length > 0){
	var cx = centerBox.width;
	var cy = centerBox.height;
	var cxp = centerBox.x +cx/2;
    var cyp = centerBox.y +cy/2;
	
	var box = editor.shapes[skinIndex].getBBox();
	var x = box.width;
	var y = box.height;
	var xp = box.x +x/2;
    var yp = box.y +y/2;
    
    editor.shapes[skinIndex].translate(cxp-xp,cyp-yp)

	if(editor.skins3[skinIndex] != null){

    var box3 = editor.skins3[skinIndex].getBBox();
    var x3 = box3.width;
	var y3 = box3.height;
	var xp3 = box3.x +x/2;
    var yp3 = box3.y +y/2;
   
   	editor.skins3[skinIndex].translate(cxp-xp3,cyp-yp3);
    }
   	if(editor.skins2[skinIndex] != null){
    var box2 = editor.skins2[skinIndex].getBBox();
    var x2 = box2.width;
	var y2 = box2.height;
	var xp2 = box2.x +x/2;
    var yp2 = box2.y +y/2;
   
   	editor.skins2[skinIndex].translate(cxp-xp2,cyp-yp2);
    }
    
 	if(editor.skins[skinIndex] != null){
    
    var box1 = editor.skins[skinIndex].getBBox();
    var x1 = box1.width;
	var y1 = box1.height;
	var xp1 = box1.x +x/2;
    var yp1 = box1.y +y/2;
   
   	editor.skins[skinIndex].translate(cxp-xp1,cyp-yp1);
    }
    }
	editor.updateTracker()
}

centerSkinMove = function(){
	if(editor.skins.length > 0){
	var cx = centerBox.width;
	var cy = centerBox.height;
	var cxp = centerBox.x +cx/2;
    var cyp = centerBox.y +cy/2;
	
	var box = editor.shapes[skinIndexMove].getBBox();
	var x = box.width;
	var y = box.height;
	var xp = box.x +x/2;
    var yp = box.y +y/2;
    
    editor.shapes[skinIndexMove].translate(cxp-xp,cyp-yp)

	if(editor.skins3[skinIndexMove] != null){

    var box3 = editor.skins3[skinIndexMove].getBBox();
    var x3 = box3.width;
	var y3 = box3.height;
	var xp3 = box3.x +x/2;
    var yp3 = box3.y +y/2;
   
   	editor.skins3[skinIndexMove].translate(cxp-xp3,cyp-yp3);
    }
   	if(editor.skins2[skinIndexMove] != null){
    var box2 = editor.skins2[skinIndexMove].getBBox();
    var x2 = box2.width;
	var y2 = box2.height;
	var xp2 = box2.x +x/2;
    var yp2 = box2.y +y/2;
   
   	editor.skins2[skinIndexMove].translate(cxp-xp2,cyp-yp2);
    }
    
 	if(editor.skins[skinIndexMove] != null){
    
    var box1 = editor.skins[skinIndexMove].getBBox();
    var x1 = box1.width;
	var y1 = box1.height;
	var xp1 = box1.x +x/2;
    var yp1 = box1.y +y/2;
   
   	editor.skins[skinIndexMove].translate(cxp-xp1,cyp-yp1);
    }
    }
    editor.updateTracker()
}
