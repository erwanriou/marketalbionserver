const app = require("./app");
const transaction = require("./services/transactions");

// CONNECT DATABASE
transaction("Market Albion Server");

// LISTEN APP
app.listen(5000, () =>
  console.log("Market Albion Server listening on port 5000!"),
);
