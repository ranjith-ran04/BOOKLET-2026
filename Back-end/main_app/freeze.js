const conn = require("./db.js");

const freeze = async (req, res) => {
  const {c_code}=req.body

  const {freeze}=req.body
  console.log(req.body.freeze)
  const fquery= 'UPDATE login SET freeze=? where c_code= ?'
  
  conn.query(fquery, [freeze,c_code] ,(error,result) => {
    if (error) throw error;
    res.sendStatus(200); // Send success response
  });
  

}

const unfreeze = async (req,res)=>{
  const {c_code}=req.body
  console.log("hiii");

  console.log("College code in unfreeze :",req.body);
  
  try {
    
    const [db_upd_uf]= await conn.query(`
      update login set freeze='UF'
      where c_code = ?`,
      [c_code]  
    )
    res.status(200).json({status:'success',msg:"unfreeze"})
  } catch (error) {
console.log("College code error in unfreeze :",error);
    res.status(500).json({status:"Server error",msg:"unfreeze"})
  }
}


module.exports = {
    freeze,
    unfreeze
  };