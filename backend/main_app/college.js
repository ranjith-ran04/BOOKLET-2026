const conn = require("./db.js")

const college_insert = async (req, res) => {

  
  const {c_code}=req.body

// console.log(c_code)
  const values =  [req.body.inputs.principal_name, req.body.inputs.email, req.body.inputs.phone_number, req.body.inputs.Address, req.body.inputs.district, req.body.inputs.Taluk_name, req.body.inputs.pincode, req.body.inputs.ragging_phone_number, req.body.inputs.website,req.body.inputs.placement_count,c_code]
  // console.log("request comes")
  try {

    const [db_col_ins] = await conn.query("UPDATE summaries SET name=?,email=?,phone=?,address=?,district=?,taluk=?,pincode=?,antiphone=?,website=? ,placement=? where collegecode=?" ,values
  
    )
    // console.log(db_col_ins)
    if (db_col_ins) {
      res.status(200).json({ success: true, message: "College Details updated successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
}
const getcollegedetails=async(req,res)=>{


  const {c_code}=req.body
  // console.log(c_code);
  
  try {
   
    const[db_get_col]=await conn.query("SELECT name,email,phone,address,district,taluk,pincode,antiphone,website,placement from summaries WHERE collegecode=?",[c_code])
    // console.log(db_get_col);
  
  
    if (db_get_col) {
      
      res.status(200).json({ success: true, message: "data select successfully",result:db_get_col });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
      }
      catch (err) {
        res.status(500).json({ success: false, message: "Failed to update" });
      }
    }


    const clg_data = async ( req,res )=>{
      const {c_code,clg_name}=req.body;
      
      try{

        if(c_code!="Boss" && clg_name!="Boss@123"){
          return res.status(200).json({status:"Fail",message:"You don't have access to admin"})
        }

          const [db_clg_data] = await conn.query(`
              select collegecode,collegename from summaries`           
          )

          res.status(200).json({status:"Success",clg_data:db_clg_data,msg:"clg_data"})
      }catch(err){
          res.status(500).json({status:"falied",msg:"clg_data"})
          
      }
  }
  const submitcol=async(req,res)=>{
    const{c_code}=req.body
    // console.log(c_code)
    try{
      const[submitc]=await conn.query(` select collegecode,collegename from summaries where collegecode=?`,[c_code])
      res.status(200).json({status:"Success",clg_data:submitc,msg:"clg_data"})
    }
    catch(err){
      res.status(500).json({status:"falied",msg:"clg_data"})
  }
}

  



module.exports = {
  college_insert,
  getcollegedetails,
  clg_data,
  submitcol
}

