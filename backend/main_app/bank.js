const conn = require("./db.js")

const bank_update = async (req, res) => {
 ////   // console.log(req.body.inputs)
    const {c_code}=req.body

    const values_1 = [req.body.inputs.Bank_name, req.body.inputs.Account_no, req.body.inputs.autonomous, req.body.inputs.minority, req.body.inputs.College_distance, req.body.inputs.near_junction, req.body.inputs.junction_distance,c_code]
 //   // console.log(values_1)
    try {
        const [db_bank_upd] = await conn.query(`UPDATE summaries SET bankname=?,accno=?,autonomo=?,minority=?,distance=?,rly=?,rlydistance=? 
        where collegecode=?`, values_1
        )
        if (db_bank_upd) {
            res.status(200).json({ success: true, message: "Bank Details updated successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "query exeution error" });

        }
    }

    catch (err) {
        res.status(500).json({ success: false, message: "Failed to update" });
    }

}
const getbankdetails=async (req,res)=>{
    const{c_code}=req.body




try {
    const [db_get_bank]=await conn.query("SELECT bankname,accno,autonomo,minority,distance,rly,rlydistance from summaries Where collegecode=?",[c_code])
 //   // console.log("request comes")
   
 //   // console.log(db_get_bank)
    if (db_get_bank) {
      
      res.status(200).json({ success: true, message: "data select successfully",result:db_get_bank });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
      }
      catch (err) {
        res.status(500).json({ success: false, message: "Failed to update" });
      }
    
}
        

module.exports = {
    bank_update,
    getbankdetails
}