const conn = require("./db.js");

const Home_update = async (req, res) => {
  const { c_code } = req.body

  try {



    const [result1, result2, result3, result4] = await Promise.all([
      conn.query('SELECT * FROM summaries WHERE collegecode=?', [c_code]),
      conn.query('SELECT * FROM coursesall WHERE collegecode=?', [c_code]),
      conn.query('SELECT freeze  from login WHERE c_code=?', [c_code]),
      conn.query('SELECT * FROM proposed_branch where collegecode=?', [c_code])
    ]);

    // console.log(result4[0])
    res.json({
      cinfo: result1[0],
      branchinfo: result2[0],
      freeze: result3[0][0].freeze,
      proposed_branch: result4[0]

    });


  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
}


module.exports = {
  Home_update,
};


