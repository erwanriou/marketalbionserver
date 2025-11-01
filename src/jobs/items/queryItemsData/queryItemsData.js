const db = require("mongoose");
const fs = require("fs");
const path = require("path");
const cron = require("../../../services/cron");

const csvPath = path.resolve(
  __dirname,
  "../../../data/updateMarketAdvanced.csv",
);

cron.define(
  "queryItemsData",
  async (job, done) => {
    console.log(`CRON IS NOT FUN`);
    console.log(csvPath);

    return done();
  },
  { priority: "normal", concurrency: 1 },
);

cron.on("ready", async () => {
  await cron.processEvery(2000);
  await cron.every("* * * * *", "queryItemsData");
  await cron.start();
});

module.exports = cron;
