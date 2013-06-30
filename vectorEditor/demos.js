function skinsDemo(){

$("#skinstart").slideDown();
$("#skinstart").accordion();
$("#skinstart").css("display", "block");
$( "#skinstart" ).accordion( "option", "active", 1 );

}

function dataDemo(){

$("#datastart").slideDown();
$("#datastart").accordion();
$("#datastart").css("display", "block");
$( "#datastart" ).accordion( "option", "active", 1 );
if(editor.shapes.length > 2){
	$( "#datastart" ).accordion( "option", "active", 2 );
}
}