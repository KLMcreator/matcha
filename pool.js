const Pool = require("pg").Pool;

module.exports = {
  pool: new Pool({
    user: "me",
    host: "localhost",
    database: "matcha",
    password: "root",
    port: 5432,
  }),
};
