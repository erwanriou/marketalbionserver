const db = require("mongoose");
const fs = require("fs");
const path = require("path");
const cron = require("../../../services/cron");
const Papa = require("papaparse");

const Item = require("../../../models/Item");

const csvPath = path.resolve(
  __dirname,
  "../../../data/updateMarketAdvanced.csv",
);

cron.define(
  "queryItemsData",
  async (job, done) => {
    console.log(`CRON ALBION SERVER RUNNING`);

    // API DATA
    const handleQuery = async ({ id }) => {
      const url = `https://europe.albion-online-data.com/api/v2/stats/prices/${id}`;
      const response = await fetch(url);
      return await response.json();
    };

    // RANDOMLY PICK MAX 180 ITEMS
    const items = await Item.aggregate([{ $sample: { size: 180 } }]);

    for (const item of items) {
      const marketData = await handleQuery({ id: item?.item_id });

      for (const marketItem of marketData) {
        const itemElement = await Item.findOne({
          item_id: item.item_id,
          city: marketItem.city,
        });

        if (!itemElement) {
          await new Item(marketItem).save();
          continue;
        }

        await itemElement.set(marketData).save();
      }
    }

    return done();
  },
  { priority: "normal", concurrency: 1 },
);

cron.on("ready", async () => {
  await cron.processEvery(2000);
  await cron.every("*/5 * * * *", "queryItemsData");
  await cron.start();
});

module.exports = cron;
