const mysql = require("mysql2/promise");
const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "oracle@hasan30",
  database: "booklet26",

});

// conn.connect((err) => {
//   if (err) {
//     // console.log(err);
//     return;
//   }
//   // console.log("connected");
// });

module.exports = conn;
