// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "hackernews";
var collections = ["articles"];

app.use(express.static("public"));

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// TODO: make two more routes

// Route 1
// =======
app.get("/all", function(req, res) {
  db.articles.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });

});
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2

axios.get("https://thehackernews.com/").then(function(response) {
  console.log("connected...");
  var $ = cheerio.load(response.data);
  var results = [];
  $("div.body-post").each(function(i, element) {
    // var title = $(element).children().text();
    var link = $(element).find("a").attr("href");
    var title = $(element).children().children().find("div").attr("h2.home-title");
    var desc = $(element).children().text();
    console.log(title);
    
    results.push({
      title: title,
      link: link,
      desc: desc
    });
    db.articles.insert({title: results[i].title, link: results[i].link, desc: results[i].desc});
  });
  console.log(results);
});

// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
