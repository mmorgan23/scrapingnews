$.getJSON("/articles", function(data){

	for (var i=0; i < data.length; i++) {

		$("#articles").append("<p data-id='" + data[i]._id + "' >" + data[i].title + "<br />" + data[i].link + "</p>");
	}
});


$(document).on("click", "p", function(){
	$("#notes").empty();
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET"
		url: "/trending/" + thisId
	})

	.done(function(data){
		console.log(data);

	$("#notes").append("<h2>" + data.title + "</h2>");

	$("#notes").append("<input id='titleinput' name='title' >");

	$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

 if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
