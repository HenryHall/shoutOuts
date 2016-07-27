var classJson;
var classIndex = 0;
var slideShowTimer = 10000; //How often the new classmate will appear automatically
var timer;
var slideShowDirection = "next";


$(document).ready(function() {

     $.ajax({
       url: 'https://raw.githubusercontent.com/HenryHall/Weekend-Project-2/master/students.json',
       dataType: 'json',
       success: function( data ){
          console.log( 'in ajax success' );
          console.log( data );
          classJson = data;
          docReady();
         }, // end success
       statusCode: {
          404: function(){
             alert( 'error connecting to server' );
          } // end 404
         } // end statusCode
       }); // end ajax  object

});



function docReady() {

  createClassmate();

}

function createClassmate() {
  console.log("Classmate Created!");

  $('#profile').append("<div id='newDiv'><img id='imgClassmate' class='img-responsive'><p id='infoClassmate'></p><p id='currentClassmate'></p><button id='previousClassmate'>Previous Classmate</button><button id='nextClassmate'>Next Classmate</button></div>");
  $('#imgClassmate').ready().css("background-image", "url(Nu/" + classJson.students[classIndex].first_name + classJson.students[classIndex].last_name + ".jpg)");
  $('#infoClassmate').text(classJson.students[classIndex].first_name + " " + classJson.students[classIndex].last_name);
  $('#currentClassmate').text("(" + Number(classIndex + 1) + "/20)");

  //Makes ugly info
  // $('#newDiv').append("<p id='city'></p><p id='shoutout'></p>")
  // $('#city').text(classJson.students[classIndex].city);
  // $('#shoutout').text(classJson.students[classIndex].shoutout);

  //Makes ugly buttons
  // for (var i = 0; i < classJson.students.length; i++) {
  //   $('#newDiv').append("<button id='buttonClassmate" + i + "'>" + classJson.students[i].first_name + " " + classJson.students[i].last_name + "</button>");
  //   createButton(i);
  // }

  timer = setTimeout(function() {
    console.log("Timer End");
    $('#newDiv').remove();
    if (slideShowDirection == "next") {
      if (classIndex == classJson.students.length-1) {classIndex = -1;}
      classIndex++;
    } else if (slideShowDirection == "prev") {
      if (classIndex == 0) {classIndex = classJson.students.length;}
      classIndex--;
    }
    createClassmate();
  }, slideShowTimer);

  $('#previousClassmate').click(function() {

    $('#imgClassmate').fadeOut(1000, function() {
      if (classIndex == 0) {classIndex = classJson.students.length;}
      $('#newDiv').remove();
      slideShowDirection = "prev";
      classIndex--;
      clearTimeout(timer);
      createClassmate();
    });

  });

  $('#nextClassmate').click(function() {

    $('#imgClassmate').fadeOut(1000, function() {
      if (classIndex == classJson.students.length-1) {classIndex = -1;}
      $('#newDiv').remove();
      slideShowDirection = "next";
      classIndex++;
      clearTimeout(timer);
      createClassmate();

    });

  });
}

function createButton(iterator) {
  $('#buttonClassmate' + iterator).click(function() {
    $('#newDiv').remove();
    slideShowDirection = "next";
    console.log(classIndex + " " + iterator + " clicked");
    classIndex = iterator;
    console.log(classIndex + " " + iterator + " clicked2");
    clearTimeout(timer);
    createClassmate();
  });
}
