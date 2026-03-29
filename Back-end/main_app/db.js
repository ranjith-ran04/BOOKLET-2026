const mysql = require("mysql2/promise");
const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Ranjith@123",
  database: "booklet25",

});

// conn.connect((err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("connected");
// });

module.exports = conn;
