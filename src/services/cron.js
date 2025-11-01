const Cron = require("@pulsecron/pulse").default;

const cron = new Cron({
  processEvery: "1 minute",
  db: {
    address:
      "mongodb+srv://albion:albion@albioncluster.xuqmfn7.mongodb.net/?appName=albioncluster",
    collection: "jobs",
  },
}).setMaxListeners(300);

cron.on("fail", (error, job) => {
  console.error(`JOB ${job?.attrs?.name}, failed`, error);
});

module.exports = cron;
