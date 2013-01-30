window.onload = function(){

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

makeScrollbars(scrollstage);
drawPaths(stage);



};
