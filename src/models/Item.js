const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const ItemSchema = new Schema({
  item_id: {
    type: String,
    required: true,
    index: true,
  },
  city: {
    type: String,
    index: true,
  },
  quality: {
    type: Number,
  },
  sell_price_min: {
    type: Number,
  },
  sell_price_min_date: {
    type: Date,
  },
  sell_price_max: {
    type: Number,
  },
  sell_price_max_date: {
    type: Date,
  },
  buy_price_min: {
    type: Number,
  },
  buy_price_min_date: {
    type: Date,
  },
  buy_price_max: {
    type: Number,
  },
  buy_price_max_date: {
    type: Date,
  },
});

// MANAGE MONGOOSE PLUGINS

module.exports = Item = mongoose.model("items", ItemSchema);
