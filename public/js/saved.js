$(document).ready(function() {
    // Getting a reference to the article container div we will be rendering all articles inside of
    var newsContainer = $(".news-container");
    // Adding event listeners for dynamically generated buttons for deleting articles,
    // pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", deleteArticle);
    $(document).on("click", ".btn.notes", notesArticle);
    $(document).on("click", ".save", saveNote);
    $(document).on("click", ".note-delete", deleteNote);
    $(".clear").on("click", clearArticle);
  
    function initPage() {
      // Empty the article container, run an AJAX request for any saved headlines
      $.get("/articles?isSaved=true").then(function(data) {
        newsContainer.empty();
        // If we have headlines, render them to the page
        if (data && data.length) {
          renderArticles(data);
        } else {
          // Otherwise render a message explaining we have no articles
          noArticles();
        }
      });
    }
  
    function renderArticles(articles) {
      // This function handles appending HTML containing our article data to the page
      // We are passed an array of JSON containing all available articles in our database
      var articleCards = [];
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
          $("<a class='btn btn-danger delete'>Delete From Saved</a>"),
          $("<a class='btn btn-info notes'>Article Notes</a>")
        )
      );
  
      const cardBody = $("<div class='card-body'>").text(article.desc);
  
      card.append(cardHeader, cardBody);
  
      // We attach the article's id to the jQuery element
      // We will use this when trying to figure out which article the user wants to remove or open notes for
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
  
    function renderNotesList(data) {
      // This function handles rendering note list items to our notes modal
      // Setting up an array of notes to render after finished
      // Also setting up a currentNote variable to temporarily store each note
      const notesToRender = [];
      var currentNote;
      if (!data.notes.length) {
        // If we have no notes, just display a message explaining this
        currentNote = $("<li class='list-group-item'>No notes yet.</li>");
        notesToRender.push(currentNote);
      } else {
        // If we do have notes, go through each one
        for (var i = 0; i < data.notes.length; i++) {
          // Constructs an li element to contain our noteText and a delete button
          currentNote = $("<li class='list-group-item note'>")
            .text(data.notes[i].noteText)
            .append($("<button class='btn btn-danger note-delete'>x</button>"));
          // Store the note id on the delete button for easy access when trying to delete
          currentNote.children("button").data("_id", data.notes[i]._id);
          // Adding our currentNote to the notesToRender array
          notesToRender.push(currentNote);
        }
      }
      // Now append the notesToRender to the note-container inside the note modal
      $(".note-container").append(notesToRender);
    }
  
    function deleteArticle() {
      // This function handles deleting articles/headlines
      // We grab the id of the article to delete from the card element the delete button sits inside
      var articleToDelete = $(this)
        .parents(".card")
        .data();
  
      // Remove card from page
      $(this)
        .parents(".card")
        .remove();
      // Using a delete method here just to be semantic since we are deleting an article/headline
      $.ajax({
        method: "DELETE",
        url: "/articles/" + articleToDelete._id
      }).then(function(data) {
        // If this works out, run initPage again which will re-render our list of saved articles
        if (data.ok) {
          initPage();
        }
      });
    }
    function notesArticle(e) {
      // This function handles opening the notes modal and displaying our notes
      // We grab the id of the article to get notes for from the card element the delete button sits inside
      var currentArticle = $(this)
        .parents(".card")
        .data();
      // Grab any notes with this headline/article id
      $.get("/notes/" + currentArticle._id).then(function(data) {
        // Constructing our initial HTML to add to the notes modal
        var modalText = $("<div class='container-fluid text-center'>").append(
          $("<h4>").text("Notes:" + currentArticle._id),
          $("<hr>"),
          $("<ul class='list-group note-container'>"),
          $("<textarea placeholder='New Note' rows='4' cols='60'>"),
          $("<button class='btn btn-success save'>Save Note</button>")
        );
        // Adding the formatted HTML to the note modal
        bootbox.dialog({
          message: modalText,
          closeButton: true
        });
        var noteData = {
          _id: currentArticle._id,
          notes: data || []
        };
        // Adding some information about the article and article notes to the save button for easy access
        // When trying to add a new note
        $(".save").data("article", noteData);
        // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
        renderNotesList(noteData);
      });
    }
  
    function saveNote() {
      // This function handles what happens when a user tries to save a new note for an article
      // Setting a variable to hold some formatted data about our note,
      // grabbing the note typed into the input box
      var noteData;
      var newNote = $(".bootbox-body textarea")
        .val()
        .trim();
      // If we actually have data typed into the note input field, format it
      // and post it to the "/api/notes" route and send the formatted noteData as well
      if (newNote) {
        noteData = { _articleId: $(this).data("article")._id, noteText: newNote };
        $.post("/notes", noteData).then(function() {
          // When complete, close the modal
          bootbox.hideAll();
        });
      }
    }
  
    function deleteNote() {
      // This function handles the deletion of notes
      // First we grab the id of the note we want to delete
      // We stored this data on the delete button when we created it
      var noteToDelete = $(this).data("_id");
      // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
      $.ajax({
        url: "/notes/" + noteToDelete,
        method: "DELETE"
      }).then(function() {
        // When done, hide the modal
        bootbox.hideAll();
      });
    }
  
    function clearArticle() {
      $.get("/clear")
        .then(function() {
          newsContainer.empty();
          initPage();
        });
    }
  });
  