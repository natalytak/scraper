var db = require("../models");
var scrape = require("../scripts/scrape");

module.exports = {
  scrape: function(req, res) {
    return scrape()
      .then(function(articles) {
        // then insert articles into the db
        return db.Articles.create(articles);
      })
      .then(function(dbArticles) {
        if (dbArticles.length === 0) {
          res.json({
            message: "There are no new articles."
          });
        }
        else {
          // Otherwise send back a count of how many new articles we got
          res.json({
            message: "Added some new articles!"
          });
        }
      })
      .catch(function(err) {
        // This query won't insert articles with duplicate headlines, but it will error after inserting the others
        res.json({
          message: "Scrape is done."
        });
      });
  }
};
