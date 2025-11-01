const mongoDbConnect = require("./mongoDb");

module.exports = async (client) => {
  try {
    await mongoDbConnect(client);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
