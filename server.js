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

const port = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hackernews";
mongoose.connect(MONGODB_URI);

// Sets up the Express app to handle data parsing
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Listen on port 3000
app.listen(port, function() {
  console.log(`App running on port ${port}!`);
});
