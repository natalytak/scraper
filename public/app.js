function displayResults(articles) {
    // First, empty the table
    $("tbody").empty();
  
    // Then, for each entry of that json...
    articles.forEach(function(article) {
      // Append each of the animal's properties to the table
      var tr = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link),
        $("<td>").text(article.desc),
        $("<button>").attr("#edit"),
        $("<button>").attr("#save"),
        // $("<td>").text(article.day),
      );
      $("tbody").append(tr);
    });
  }

  $.getJSON("/all", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });