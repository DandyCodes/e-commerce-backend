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
    const newlyCreatedProductTags = await ProductTag.bulkCreate(
      productTagsData
    );
    res.status(200).json({ newlyCreatedProductTags });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    const relatedProductTags = await ProductTag.findAll({
      where: { tag_id: req.params.id },
    });
    const relatedProductTagProductIds = relatedProductTags.map(
      ({ product_id }) => product_id
    );
    const newProductTags = req.body.productIds
      .filter(product_id => !relatedProductTagProductIds.includes(product_id))
      .map(product_id => ({
        product_id,
        tag_id: req.params.id,
      }));
    const productTagIdsToRemove = relatedProductTags
      .filter(({ product_id }) => !req.body.productIds.includes(product_id))
      .map(({ id }) => id);
    const numberOfDestroyedProductTags = await ProductTag.destroy({
      where: { id: productTagIdsToRemove },
    });
    const newlyCreatedProductTags = await ProductTag.bulkCreate(newProductTags);
    res
      .status(200)
      .json({ numberOfDestroyedProductTags, newlyCreatedProductTags });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const numberOfDestroyedTags = await Tag.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ numberOfDestroyedTags });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
