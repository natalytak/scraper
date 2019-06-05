$(function() {
  $(".saveBtn").on("click", function(event) {
    event.preventDefault();

    let artId = $(this).data("id");
    console.log(artId);

    $.ajax("/save/article/" + artId, {
      type: "PUT"
    }).then(function() {
      alert("Article is saved!");
    });
  });

$(".deleteBtn").on("click", function(event) {

  let artId = $(this).data("id");

  $.ajax("/delete/articles/" + artId, {
    type: "PUT"
  }).then(function() {
    alert("Article was deleted!");
  });
});

});



// function displayResults(articles) {
//   console.log(articles);
//     // First, empty the table
//     $("tbody").empty();
  
//     // Then, for each entry of that json...
//     articles.forEach(function(article) {
//       // Append each of the animal's properties to the table
//       var tr = $("<tr>").append(
//         $("<td>").text(article.title),
//         $("<td>").text(article.desc),
//         $("<td>").text(article.link),
//         $("<td>").append("<button class='btn btn-warning'>Note</button>"),
//         $("<td>").append("<button class='btn btn-success'>Save</button>"),
//         // $("<td>").text(article.day),
//       );
//       $("tbody").append(tr);
//     });
//   }

//   $.getJSON("/all", function(data) {
//     // Call our function to generate a table body
//     displayResults(data);
//   });


