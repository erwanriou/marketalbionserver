const express = require("express");
const mongoose = require("mongoose");
const Item = require("../../../../models/Item");

const router = express.Router();

// @route  GET api/albion/public/item/list
// @desc   get list of albion items as public
// @access Public
router.get("/api/albion/public/item/list", async (req, res) => {
  // MANAGE QUERY
  const {
    page,
    limit,
    item_id,
    city,
    date,
    buy_price_min,
    buy_price_max,
    sell_price_min,
    sell_price_max,
  } = req.query;

  // ENSURE MIN QUERY ARE DEFINED
  if (!Number.isInteger(parseInt(page)) || !Number.isInteger(parseInt(limit))) {
    throw new Error("Limit or page query cannot be empty");
  }

  // AGREGATION
  const aggregationPipelines = [
    {
      $match: {
        // NAME FILTERING
        item_id: !!item_id
          ? new RegExp(item_id, "i")
          : { $ne: false || "UNDEFINED" },
        // CITY FILTERING
        city: { $nin: ["Brecilien", "Black Market"] },
        city: !!city ? { $in: [city] } : { $ne: false || null },
        // DATE FILTERING
        buy_price_max_date: !!date ? { $in: [date] } : { $ne: false },
        // PRICE FILTERING
        sell_price_min: !!sell_price_min
          ? { $gte: Number(sell_price_min), $ne: 0 }
          : { $ne: 0 || null },
        sell_price_max: !!sell_price_max
          ? { $lte: Number(sell_price_max), $ne: 0 }
          : { $ne: 0 || null },
        buy_price_min: !!buy_price_min
          ? { $gte: Number(buy_price_min), $ne: 0 }
          : { $ne: 0 || null },
        buy_price_max: !!buy_price_max
          ? { $lte: Number(buy_price_max), $ne: 0 }
          : { $ne: 0 || null },
      },
    },
    {
      $project: {
        _id: 0,
        item_id: 1,
        city: 1,
        sell_price_min: 1,
        sell_price_max: 1,
        buy_price_min: 1,
        buy_price_max: 1,
        buy_price_max_date: 1,
        difference_pct: {
          $cond: [
            {
              $and: [
                { $ne: ["$buy_price_max", null] },
                { $gt: [{ $toDouble: "$buy_price_max" }, 0] },
              ],
            },
            {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        { $toDouble: "$sell_price_min" },
                        { $toDouble: "$buy_price_max" },
                      ],
                    },
                    { $toDouble: "$buy_price_max" },
                  ],
                },
                100,
              ],
            },
            null, // or 0 if you prefer
          ],
        },
      },
    },
    {
      $sort: {
        difference_pct: -1,
      },
    },
    {
      $facet: {
        items: [
          { $skip: Number(page) * Number(limit) },
          { $limit: Number(limit) },
        ],
        total: [{ $count: "count" }],
      },
    },
  ];

  try {
    // HANDLE DATABASE FETCH
    const items = await Item.aggregate(aggregationPipelines);

    // RETURN AND FINALIZE ENDPOINT
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    throw new Error("NOPE");
  }
});

module.exports = router;
