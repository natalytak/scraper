const express = require("express");
const router = express.Router();
const Articles = require("../models/Articles");
const Note = require("../models/Note");
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", function(req, res) {
    Articles.find({isSaved: false}, function(error, found) {
      if (error) {
        console.log(error);
      }
      else {
        // res.json(found);
        res.render("scraper", { articles: found });
      }
    });
  
  });


router.post("/scrape", function(req, res) {
    axios.get("https://thehackernews.com/").then(function(response) {
    const $ = cheerio.load(response.data);
    // console.log(response.data);
    const results = [];
    $("div.body-post").each(function(i, element) {
      const title = $(element).children().find(".home-right").find("h2").text();
      const link = $(element).find("a").attr("href");
      const desc = $(element).children().find(".home-desc").text();
      
      results.push({
        title: title,
        desc: desc,
        link: link,
      });
      console.log(results);
 
    Articles.create(results)
      .then(function(dbArticles) {
        // If saved successfully, send the the new User document to the client
        console.log(dbArticles);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
//   db.Articles.insert({title: results[i].title, desc: results[i].desc, link: results[i].link});
  res.send("Scraped!");
    });
  });

  router.get("/saved", function(req, res) {
    Articles.find({ isSaved: true })
      .sort({ date: -1 })
      .then(function(found) {
        res.render("saved", { articles: found });
      });
  });
  
  
  router.put("/save/article/:id", function(req, res) {
    let artId = req.params.id;
  
    Articles.findOneAndUpdate(
      { 
        _id: artId
      },
      {
        $set: { isSaved: true }
      }
    ).then(function(results) {
      res.json(results);
    });
  });

  router.put("/delete/articles/:id", function(req, res) {
    let artId = req.params.id;
  
    Articles.findOneAndUpdate(
      { 
        _id: artId 
      },
      {
        $set: { isSaved: false }
      }
    ).then(function(results) {
      console.log(results);
      res.render("saved", { articles: results });
    });
  });

module.exports = router;