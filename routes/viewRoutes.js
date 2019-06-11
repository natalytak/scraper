const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", function(req, res) {
    db.Articles.find({ isSaved: false })
    .then(function(dbArticles) {
      res.render("scraper", { articles: dbArticles });
    });
});


// router.post("/scrape", function(req, res) {
//     axios.get("https://thehackernews.com/").then(function(response) {
//     const $ = cheerio.load(response.data);
//     // console.log(response.data);
//     const results = [];
//     $("div.body-post").each(function(i, element) {
//       const title = $(element).children().find(".home-right").find("h2").text();
//       const link = $(element).find("a").attr("href");
//       const desc = $(element).children().find(".home-desc").text();
      
//       results.push({
//         title: title,
//         desc: desc,
//         link: link,
//       });
//       console.log(results);
 
//     Articles.create(results)
//       .then(function(dbArticles) {
//         // If saved successfully, send the the new User document to the client
//         console.log(dbArticles);
//       })
//       .catch(function(err) {
//         console.log(err);
//       });
//   });
// //   db.Articles.insert({title: results[i].title, desc: results[i].desc, link: results[i].link});
//   res.send("Scraped!");
//     });
//   });

  router.get("/saved", function(req, res) {
    db.Articles.find({ isSaved: true })
      .then(function(dbArticles) {
        res.render("saved", { articles: dbArticles });
      });
  });
  
  
  // router.put("/save/article/:id", function(req, res) {
  //   let artId = req.params.id;
  
  //   Articles.findOneAndUpdate(
  //     { 
  //       _id: artId
  //     },
  //     {
  //       $set: { isSaved: true }
  //     }
  //   ).then(function(results) {
  //     res.json(results);
  //   });
  // });

  // router.put("/delete/articles/:id", function(req, res) {
  //   let artId = req.params.id;
  
  //   Articles.findOneAndUpdate(
  //     { 
  //       _id: artId 
  //     },
  //     {
  //       $set: { isSaved: false }
  //     }
  //   ).then(function(results) {
  //     console.log(results);
  //     res.render("saved", { articles: results });
  //   });
  // });

module.exports = router;