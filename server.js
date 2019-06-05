// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
// Require axios and cheerio. This makes the scraping possible
// const axios = require("axios");
// const cheerio = require("cheerio");

// const Articles = require("./models/articlesModel.js/index.js");

// Initialize Express
const app = express();

const routes = require("./routes/routes");
app.use(routes);

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hackernews";
mongoose.connect(MONGODB_URI);

// Sets up the Express app to handle data parsing
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// app.get("/scrape", function(req, res) {
//   axios.get("https://thehackernews.com/").then(function(response) {
//   const $ = cheerio.load(response.data);
//   // console.log(response.data);
//   const results = [];
//   $("div.body-post").each(function(i, element) {
//     const title = $(element).children().find(".home-right").find("h2").text();
//     const link = $(element).find("a").attr("href");
//     const desc = $(element).children().find(".home-desc").text();
    
//     results.push({
//       title: title,
//       desc: desc,
//       link: link,
//     });
//     console.log(results);

//   Articles.create(results)
//     .then(function(dbArticles) {
//       // If saved successfully, send the the new User document to the client
//       console.log(dbArticles);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });
// db.Articles.insert({title: results[i].title, desc: results[i].desc, link: results[i].link});
// res.send("Saved to db");
//   });
// });


// Route 1
// =======
// app.get("/", function(req, res) {
//   db.articles.find({}, function(error, found) {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       res.json(found);
//     }
//   });

// });



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
