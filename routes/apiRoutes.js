const router = require("express").Router();
const articlesController = require("../controllers/Articles");
const noteController = require("../controllers/note");
const scrapeController = require("../controllers/scrape");
const clearController = require("../controllers/clear");

router.get("/", articlesController.findAll);
router.delete("/:id", articlesController.delete);
router.put("/:id", articlesController.update);
router.get("/:id", noteController.find);
router.post("/", noteController.create);
router.delete("/:id", noteController.delete);
router.get("/", scrapeController.scrape);

router.get("/", clearController.clearDB);


module.exports = router;
