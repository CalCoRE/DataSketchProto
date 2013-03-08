function save(){
    $("#data").val(encode(jQuery.map(editor.shapes,dumpshape)))
    $("#dialog").slideDown()

    //for(var i = 0; i < editor.shapes.length; i++){
    // dumpshape(editor.shapes[i])
    //}
}
    
function opendialog(){
    $("#data").val("")
    $("#dialog").slideDown()
}

function import_shapes(){
    try{
      var json = eval("("+$("#data").val()+")");
      jQuery(json).each(function(index, item){
        loadShape(item)
      })
      $("#dialog").slideUp();
    }catch(err){
      alert(err.message)
    }
}

   
var attr = "cx,cy,fill,fill-opacity,font,font-family,font-size,font-weight,gradient,height,opacity,path,r,rotation,rx,ry,src,stroke,stroke-dasharray,stroke-opacity,stroke-width,width,x,y,text".split(",")
  
dumpshape = function(shape){
    //return Ax.canvas.info(shape)
    var info = {
      type: shape.type,
      id: shape.id,
      subtype: shape.subtype
    }
    for(var i = 0; i < attr.length; i++){
      var tmp = shape.attr(attr[i]);
      if(tmp){
        if(attr[i] == "path"){
          tmp = tmp.toString()
        }
        info[attr[i]] = tmp
      }
    }
    return info
}


loadShape = function(shape, noattachlistener){
    var instance = editor//instance?instance:Ax.canvas
    if(!shape || !shape.type || !shape.id)return;
    
	var newshape = null, draw = instance.draw;editor
    if(!(newshape=editor.getShapeById(shape.id))){
	if(shape.type == "rect"){
	newshape = draw.rect(0, 0,0, 0)
	}else if(shape.type == "path"){
	newshape = draw.path("")
	}else if(shape.type == "image"){
        newshape = draw.image(shape.src, 0, 0, 0, 0)
      }else if(shape.type == "ellipse"){
        newshape = draw.ellipse(0, 0, 0, 0)
      }else if(shape.type == "text"){
        newshape = draw.text(0, 0, shape.text)
      }
    }
    newshape.attr(shape)
    newshape.id = shape.id
    newshape.subtype = shape.subtype

    if (!noattachlistener) {
      instance.addShape(newshape,true)
    }
}