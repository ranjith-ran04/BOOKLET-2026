
const conn = require("./db.js");

const freeze = async (req, res) => {
  const { c_code } = req.body

  const { freeze } = req.body
  // console.log(req.body.freeze)
  const fquery = 'UPDATE login SET freeze=? where c_code= ?'

  conn.query(fquery, [freeze, c_code], (error, result) => {
    if (error) throw error;
    res.sendStatus(200); // Send success response
  });


}

const unfreeze = async (req, res) => {
  const { c_code } = req.body
  // console.log("hiii");

  // console.log("College code in unfreeze :",req.body);

  try {

    const [db_upd_uf] = await conn.query(`
      update login set freeze='UF'
      where c_code = ?`,
      [c_code]
    )
    res.status(200).json({ status: 'success', msg: "unfreeze" })
  } catch (error) {
    // console.log("College code error in unfreeze :",error);
    res.status(500).json({ status: "Server error", msg: "unfreeze" })
  }
}

const unsetPassword = async (req, res) => {
  try {
    const { c_code } = req.body;

    if (!c_code) {
      return res.json({
        status: "fail",
        message: "College code required",
      });
    }

    await conn.query(
      "UPDATE login SET changed = 0, password = ? WHERE c_code = ?",
      ["Tnea@2026", c_code]
    );

    return res.json({
      status: "success",
      message: `Password reset to default for ${c_code}`,
    });

  } catch (err) {
    console.error(err);
    return res.json({
      status: "fail",
      message: "Server error",
    });
  }
};


module.exports = {
  freeze,
  unfreeze,
  unsetPassword
};