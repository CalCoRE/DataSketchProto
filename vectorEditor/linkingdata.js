//called by button
function import_data(){
    try{
		csvToJson();
      $("#dialog2").slideUp();
    }catch(err){
      alert(err.message)
    }
    $( "#datastart" ).accordion( "option", "active", 4 );

}

function opendialog2(){
    $("#data2").val("")
    $("#dialog2").slideDown()
    $( "#datastart" ).accordion( "option", "active", 3 );
  }



function playData(){
	timerCount = 1;
	var sp2 = document.getElementById("childElement");
	for (var i = 0; i < things.length; i++){
		var testing = document.createElement("input");
		testing.type = "range";
		testing.id = "test"+i;
		testing.min = 1;
		testing.max = 10;
		testing.step = 1;
		testing.value = 1;
		document.getElementById("datain").insertBefore(testing, sp2);
	}
	dataTimer = setInterval(function(){displayData()},1000);

}

function displayData(){

  	for (var j = 0; j < things.length; j++){
  		document.getElementById("test"+j).value = objArr[j][labels[timerCount]];
  	if (attrSelect[j] != undefined){
  		if (attrSelect[j] == "opacity"){
  			drop[j].attr({opacity:objArr[j][labels[timerCount]]});
  		}
  		else if (attrSelect[j] == "scale"){
  			var box = drop[j].getBBox();
			var x = box.width;
			var y = box.height;
			var xp = box.x +x/2;
    		var yp = box.y +y/2;
    		var sc = "S" + objArr[j][labels[timerCount]], x, xp, yp;
			drop[j].transform(sc);
			editor.newTracker(drop[j]);
  		}
  		else if (attrSelect[j] == "rotation"){
		var box = drop[j].getBBox();
		var x = box.width;
		var y = box.height;
		var xp = box.x +x/2;
    	var yp = box.y +y/2;
    	var rt = "R"+objArr[j][labels[timerCount]], xp, yp;
		drop[j].transform(rt);
		editor.newTracker(drop[j]);
  		}
  		else if (attrSelect[j] == "x"){
		drop[j].transform("T"+objArr[j][labels[timerCount]]+",0");
		editor.newTracker(drop[j]);
  		}
  		else if (attrSelect[j] == "y"){
		drop[j].transform("T0," + -objArr[j][labels[timerCount]]);;
		editor.newTracker(drop[j]);
  		}
  	}
  	}
  	
  	if (timerCount < labels.length-1){
  		timerCount++;
  	}
  	else{
  		clearInterval(dataTimer);
  	}
 } 
 


function errorMessage (message) {
    document.getElementById("datain").innerHTML += '<p>' + message + '</p>';
}

function parseCSVLine (line)
{
    line = line.split(',');

    // check for splits performed inside quoted strings and correct if needed
    for (var i = 0; i < line.length; i++) {
        var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
        var quote = "";
        if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
        if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";

        if (quote != "") {
            var j = i + 1;

            if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");

            while (j < line.length && chunk.charAt(chunk.length - 1) != quote) {
                line[i] += ',' + line[j];
                line.splice(j, 1);
                chunk = line[j].replace(/[\s]*$/g, "");
            }

            if (j < line.length) {
                line[i] += ',' + line[j];
                line.splice(j, 1);
            }
        }
    }

    for (var i = 0; i < line.length; i++) {
        // remove leading/trailing whitespace
        line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
        
        // remove leading/trailing quotes
        if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
        else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
    }

    return line;
}

function csvToJson ()
{

    var message = "";
    var error = false;
    var csvText = document.getElementById("data2").value;
    var jsonText = "";


    if (csvText == "") { 
        error = true; 
        message = "Enter CSV text."; 
        errorMessage(message);
    }

    if (!error)
    {
        csvRows = csvText.split(/[\r\n]/g); // split into rows
    
        // get rid of empty rows
        for (var i = 0; i < csvRows.length; i++) {
            if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "") {
                csvRows.splice(i, 1);
                i--;
            }
        }
    
        if (csvRows.length < 2) { 
            error = true; 
            message = "The CSV text MUST have a header row!"; 
            errorMessage(message);
        } else {
            objArr = [];
        
            for (var i = 0; i < csvRows.length; i++){
                csvRows[i] = parseCSVLine(csvRows[i]);
            }
            
            for (var i = 1; i < csvRows.length; i++){
                things[i-1] = csvRows[i][0];
            }
            
            for (var i = 0; i < csvRows[0].length; i++){
                labels[i] = csvRows[0][i];
            }
            
            
            for (var i = 1; i < csvRows.length; i++) {
                if (csvRows[i].length > 0) objArr.push({});
                for (var j = 0; j < csvRows[i].length; j++) {
                    objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
                }
            }
            
            jsonText = JSON.stringify(objArr, null, "\t");
        
        }
    }

    //visualize data
    //what happens if they go in and change data to import? things get printed multiple times
    for (var i = 0; i<things.length; i++){
        //dynamically make a new div for every "thing"
        var labelling = document.createElement("div");
        labelling.id = "this"+i;
        labelling.min = 1;
        labelling.max = 10;
        labelling.step = 1;
        labelling.value = 1;
        labelling.className = "dynamicDiv";
        p = i*15;
        //labelling.style.padding = p + "px"; 
        document.getElementById("datain").appendChild(labelling); 
        //$("#this"+i).innerHTML += things[i] + "asdofasdf";
        //$("#datain").innerHTML += labelling;
        document.getElementById("this"+i).innerHTML += things[i] + "<br />";
        //$("#datain").getElementById("this"+i).innerHTML += things[i] + "<br />";
        $("#this"+i).draggable();
        $( "#dropshape" ).droppable({
            drop: function( event, ui ) { 
                draggableId = ui.draggable.attr("id");
                draggableId = draggableId.match(/\d+$/); 
                draggableId = parseInt(draggableId, 10);
                drop[draggableId] = editor.selected[0];
                $("#attrSelect").slideDown()
            }
        });
    }

}

//next set of functions are called by dropdown menu attrSelect and calibrate the imported csv data

function attrScale(){
    $( "#datastart" ).accordion( "option", "active", 5 );
	attrSelect[draggableId] = "scale";
	var tempData = [];
	for (var i = 1; i<labels.length; i++){
		tempData[i-1]=objArr[draggableId][labels[i]];
	}
    var max = Math.max.apply(null, tempData);
    for (var i = 1; i<labels.length; i++){
		objArr[draggableId][labels[i]]=(tempData[i-1])/max*3;
	}
	$("#attrSelect").slideUp()
}

function attrRotation(){
    $( "#datastart" ).accordion( "option", "active", 5 );
	attrSelect[draggableId] = "rotation";
	var tempData = [];
	for (var i = 1; i<labels.length; i++){
		tempData[i-1]=objArr[draggableId][labels[i]];
	}
    var max = Math.max.apply(null, tempData);
    for (var i = 1; i<labels.length; i++){
		objArr[draggableId][labels[i]]=(tempData[i-1])/max*360;
	}
	$("#attrSelect").slideUp()
}

function attrOpacity(){
    $( "#datastart" ).accordion( "option", "active", 5 );
	attrSelect[draggableId] = "opacity";
	var tempData = [];
	for (var i = 1; i<labels.length; i++){
		tempData[i-1]=objArr[draggableId][labels[i]];
	}
    var max = Math.max.apply(null, tempData);
    for (var i = 1; i<labels.length; i++){
		objArr[draggableId][labels[i]]=(tempData[i-1])/max;
	}
	$("#attrSelect").slideUp()
}

function attrY(){
    $( "#datastart" ).accordion( "option", "active", 5 );
	attrSelect[draggableId] = "y";
	var tempData = [];
	for (var i = 1; i<labels.length; i++){
		tempData[i-1]=objArr[draggableId][labels[i]];
	}
    var max = Math.max.apply(null, tempData);
    for (var i = 1; i<labels.length; i++){
		objArr[draggableId][labels[i]]=((tempData[i-1])/max-.5)*600;
	}
	$("#attrSelect").slideUp()
}

function attrX(){
    $( "#datastart" ).accordion( "option", "active", 5 );
	attrSelect[draggableId] = "x";
	var tempData = [];
	for (var i = 1; i<labels.length; i++){
		tempData[i-1]=objArr[draggableId][labels[i]];
	}
    var max = Math.max.apply(null, tempData);
    for (var i = 1; i<labels.length; i++){
		objArr[draggableId][labels[i]]=((tempData[i-1])/max-.5)*1000;;
	}
	$("#attrSelect").slideUp()
}