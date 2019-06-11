// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const exphbs = require("express-handlebars");

const port = process.env.PORT || 3000;

// const Articles = require("./models/articlesModel.js/index.js");

// Initialize Express
const app = express();

const routes = require("./routes");
app.use(routes);

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hackernews";
mongoose.connect(MONGODB_URI);

// Sets up the Express app to handle data parsing
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Listen on port 3000
app.listen(port, function() {
  console.log(`App running on port ${port}!`);
});
