$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  const newsContainer = $(".news-container");
  $(document).on("click", ".save", saveArticle);
  $(document).on("click", ".scrape-news", scrapeArticle);
  $(".clear").on("click", clearArticle);

  function initPage() {
    // Run an AJAX request for any unsaved headlines
    $.get("/api/articles?isSaved=false").then(function(data) {
      newsContainer.empty();
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
        console.log("rending articles...");
      } else {
        // Otherwise render a message explaining we have no articles
        noArticles();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    const articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    newsContainer.append(articleCards);
  }

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    const card = $("<div class='card'>");
    const cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.link)
          .text(article.title),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );

    const cardBody = $("<div class='card-body'>").text(article.desc);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  function noArticles() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    const emptyAlert = $("<div class='alert alert-warning text-center'>",
        "<h4>There are no more new articles to scrape.</h4>",
        "</div>");
    // Appending this data to the page
    newsContainer.append(emptyAlert);
  }

  function saveArticle() {
    console.log("saving article begging of function...");
    // This function is triggered when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    const articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.isSaved = true;
    console.log(articleToSave._id);
    console.log(articleToSave);
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/articles/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      console.log(data);
      // If the data was saved successfully
      if (data.saved) {
        console.log("data saved...true");
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
  }

  function scrapeArticle() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/api/scrape").then(function(data) {
      // If we are able to successfully scrape the NYTIMES and compare the articles to those
      // already in our collection, re render the articles on the page
      // and let the user know how many unique articles we were able to save
      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  function clearArticle() {
    $.get("api/clear").then(function() {
      newsContainer.empty();
      initPage();
    });
  }
});


// $(function() {
//   $(".saveBtn").on("click", function(event) {
//     event.preventDefault();

//     let artId = $(this).data("id");
//     console.log(artId);

//     $.ajax("/save/article/" + artId, {
//       type: "PUT"
//     }).then(function() {
//       alert("Article is saved!");
//     });
//   });

// $(".deleteBtn").on("click", function(event) {
//   event.preventDefault();
//   let artId = $(this).data("id");

//   $.ajax("/delete/articles/" + artId, {
//     type: "PUT"
//   }).then(function() {
//     alert("Article was deleted!");
//   });
// });

// });



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


