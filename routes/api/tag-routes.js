const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({ include: Product });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, { include: Product });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tag = await Tag.create(req.body);
    if (!req.body.productIds.length) {
      return res.status(200).json(tag);
    }
    const productTagsData = req.body.productIds.map(product_id => ({
      product_id,
      tag_id: tag.id,
    }));
    const productTags = await ProductTag.bulkCreate(productTagsData);
    res.status(200).json(productTags);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
