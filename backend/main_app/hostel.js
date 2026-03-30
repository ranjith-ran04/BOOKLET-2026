const conn = require("./db")

const hostel_get = async (req, res) => {
  const { c_code } = req.body;
  try {

    const [db_hos_get] = await conn.query(` select accb,accg,htypeb,htypeg,messb,messg,billb,billg,rentb,rentg,elecb,elecg,caution,estab,adm,trans,mintrans,maxtrans from summaries where collegecode=?`,
      [c_code]

    )
    if (db_hos_get) {

      res.status(200).json({ success: true, message: "data retrived successfully", result: db_hos_get });
    }
    else {


      res.status(200).json({ success: false, message: "query exeution error" });
    }

  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrive" });
  }

}




const hostel_update = async (req, res) => {


  const {
    c_code,
    clg_name,
    boyshostel,
    boysmess,
    boysrent,
    boysrental,
    boysmessbill,
    boysmonth,
    boyseb,
    girlshostel,
    girlsmess,
    girlsrent,
    girlsrental,
    girlsmessbill,
    girlsmonth,
    girlseb,
    deposit,
    fees,
    min,
    charge,
    transport,
    max,
  } = req.body;

  // console.log(req.body);

  try {
    const [db_hos_upd] = await conn.query(
      // "INSERT INTO summaries (accb,accg,htypeb,htypeg,messb,messg,billb,billg,rentb,rentg,elecb,elecg,caution,estab,adm,trans,mintrans,maxtrans) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      "update summaries set accb=?,accg=?,htypeb=?,htypeg=?,messb=?,messg=?,billb=?,billg=?,rentb=?,rentg=?,elecb=?,elecg=?,caution=?,estab=?,adm=?,trans=?,mintrans=?,maxtrans=? where collegecode=?",
      [
        boyshostel,
        girlshostel,
        boysrental,
        girlsrental,
        boysmess,
        girlsmess,
        boysmessbill,
        girlsmessbill,
        boysrent,
        girlsrent,
        boyseb,
        girlseb,
        deposit,
        charge,
        fees,
        transport,
        min,
        max,
        c_code,
      ],
    );
    if (db_hos_upd) {
      res.status(200).json({ success: true, message: "Hostel Details Updated Successfully" });
    } else {
      res.status(200).json({ success: false, message: "query exeution error" });

    }
  }
  catch (err) {
// console.log(req.body);
    res.status(500).json({ success: false, message: "Failed to update" });
  }




};

module.exports = {
  hostel_get,
  hostel_update
}
