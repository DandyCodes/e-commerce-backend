const express = require("express");
const routes = require("./routes");
const sequelize = require("./config/connection");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

async function main() {
  await sequelize.sync({ force: false });
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
}

main();
