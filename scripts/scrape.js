const axios = require("axios");
const cheerio = require("cheerio");

const scrape = function() {

    axios.get("https://thehackernews.com/").then(function(response) {
    const $ = cheerio.load(response.data);
    // console.log(response.data);
    const results = [];
    $("div.body-post").each(function(i, element) {
      const title = $(element)
        .children()
        .find(".home-right")
        .find("h2")
        .text();

      const link = $(element)
        .find("a")
        .attr("href");

      const desc = $(element)
        .children()
        .find(".home-desc")
        .text();
      
      results.push({
        title: title,
        desc: desc,
        link: link,
      });
    });
    return results;
  });
}

module.exports = scrape;
