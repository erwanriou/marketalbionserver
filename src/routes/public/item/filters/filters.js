const express = require("express");
const mongoose = require("mongoose");
const Item = require("../../../../models/Item");

const router = express.Router();

// @route  GET api/albion/public/item/filters
// @desc   get item of albion items as public
// @access Public
router.get("/api/albion/public/item/filters", async (req, res) => {
  // MANAGE QUERY
  const { item_id, city } = req.query;

  // AGREGATION
  const aggregationPipelines = [
    {
      $match: {
        item_id: !!item_id ? { $in: [item_id] } : { $ne: false },
        city: !!city ? { $in: [city] } : { $ne: false },
        city: { $nin: ["Brecilien", "Black Market"] },
      },
    },
    { $unwind: { path: "$item_id", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$city", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        items: { $addToSet: "$item_id" },
        cities: { $addToSet: "$city" },
      },
    },
  ];

  try {
    // HANDLE DATABASE FETCH
    const filters = await Item.aggregate(aggregationPipelines);

    // RETURN AND FINALIZE ENDPOINT
    res.status(200).json(filters);
  } catch (e) {
    console.error(e);
    throw new Error("NOPE");
  }
});

module.exports = router;
