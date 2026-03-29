
const conn = require('./db.js')

// const validate = (data) => {
//   const errors = {};
//   if (typeof data.approvedIntake === "undefined") { }
//   else if (isNaN(data.approvedIntake)) {
//     errors.approvedIntake = "Intake should be a number"
//   }
//   if (typeof data.proposedIntake === "undefined") { }
//   else if (isNaN(data.proposedIntake)) {
//     errors.proposedIntake = "Intake should be a number"
//   }
//   if (typeof data.yearOfStart === "undefined" || data.yearOfStart === "") { }
//   else if (isNaN(data.yearOfStart)) {
//     errors.yearOfStart = "Start year should be a number"
//   }
//   else if (data.yearOfStart.length != 4) {
//     errors.yearOfStart = "Invalid data"
//   }
//   else if (data.yearOfStart > 2024) {
//     errors.yearOfStart = "Start year should be lessthan 2024"
//   }
//   if (typeof data.accreditedUpto === "undefined" || data.accreditedUpto === "-") { }
//   else if (isNaN(data.accreditedUpto) || data.accreditedUpto.length != 4 || ((data.accreditedUpto - data.yearOfStart) < 5)) {
//     errors.accreditedUpto = "Invalid data"
//   }
//   return errors;
// }


const store_branch = async (req, res) => {
  const { branchName, branchCode, approvedIntake, yearOfStart, NBA, accreditedUpto, c_code, clg_name } = req.body;
  // const error = validate(req.body)
  // console.log(req.body);
  try {
    // if (Object.keys(error).length === 0) {
    const [db_brn_ins] = await conn.query("INSERT INTO coursesall(collegecode,collegename,coursecode,coursename,intake,startyear,nba,validity) VALUES (?,?,?,?,?,?,?,?)",
      [c_code, clg_name, branchCode, branchName, approvedIntake, yearOfStart, NBA, accreditedUpto],
    )

    if (db_brn_ins.affectedRows > 0) {
      res.status(200).json({ success: true, message: "data inserted successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
    // res.status(201).send({ message: "branch stored scccesfully" })

  }

  catch (err) {
    res.status(500).json({ success: false, message: "Failed to insert" });
  }


}

const store_new_branch = async (req, res) => {
  const { formData, c_code, clg_name } = req.body;
  const { branchName, approvedIntake, remarks } = formData;

  // const error = validate(req.body)
  try {
    // if (Object.keys(error).length === 0) {

    const lowerBranchName = branchName.toLowerCase().replace(/\s+/g, "")

    const [db_check_brn] = await conn.query("Select coursename from proposed_branch where LOWER(REPLACE(coursename,' ','')) = ? and collegecode = ?", [lowerBranchName, c_code])
    if (db_check_brn.length > 0) {
      return res.json({ success: false, message: "branch already exists" })
    }
    const [db_new_brn_ins] = await conn.query("INSERT INTO proposed_branch(collegecode,collegename,coursename, intake, remarks) VALUES(?,?,?,?,?)",
      [c_code, clg_name, branchName, approvedIntake, remarks],
    )



    if (db_new_brn_ins) {
      res.status(200).json({ success: true, message: "data inserted successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }

  }

  catch (err) {
    res.status(500).json({ success: false, message: "Failed to insert" });
  }

};


const get_branch_details = async (req, res) => {

  const { c_code, clg_name } = req.body;


  try {
    const [db_get_brn] = await conn.query(`
      SELECT collegecode,collegename,coursecode,coursename,intake,new_intake,startyear,nba,validity,remarks FROM coursesall
      where collegecode = ? `,
      [c_code])

    const [db_get_prop] = await conn.query(`
      SELECT collegecode,collegename,coursecode,coursename,intake,remarks FROM proposed_branch
      where collegecode = ?`,
      [c_code]
    )
    console.log(db_get_prop);

    if (db_get_brn && db_get_prop) {
      res.status(200).json({ success: true, message: "data received successfully", result: { brn_det: db_get_brn, prop_det: db_get_prop } });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }

  }

  catch (err) {
    res.status(500).json({ success: false, message: "Failed to receive" });
  }

}

const specific_row = async (req, res) => {
  const { id, c_code, clg_name } = req.body;
  console.log(req.body);

  try {
    const [db_get_spc] = await conn.query(`
      SELECT collegecode,collegename,coursecode,coursename,intake,new_intake,startyear,nba,validity,remarks FROM coursesall 
      where coursecode=? and collegecode = ?
      UNION ALL 
      SELECT collegecode,collegename,coursecode,coursename,intake,NULL,startyear,nba,validity,remarks FROM proposed_branch 
      where coursename= ? and collegecode = ?`,
      [id, c_code, id, c_code]
    )
     if(db_get_spc.length === 0){
      res.status(200).json({ success: false, message: "data Not received", result: db_get_spc });
    }
    else if (db_get_spc) {
      res.status(200).json({ success: true, message: "data received successfully", result: db_get_spc });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });

    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to receive" });
  }

}

const update_add_branch = async (req, res) => {
  console.log(req.body.proposedIntake)
  console.log(req.body);
  const { data, c_code, clg_name } = req.body;
  const cc = data.branchCode;


  // const error = validate(data)
  try {
    // if (Object.keys(error).length === 0) {

    const [db_upd_brn] = await conn.query(`
      UPDATE coursesall SET new_intake=?,startyear=?,nba=?,validity=?,remarks=? 
      where coursecode=? and collegecode = ?`,
      [data.proposedIntake, data.yearOfStart, data.NBA, data.accreditedUpto, data.remarks, cc, c_code]

    )
    if (db_upd_brn) {
      res.status(200).json({ success: true, message: "data updated successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }


  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }

  // }
  // else{
  //   query=`UPDATE coursesall SET startyear=?,nba=?,validity=? where coursecode="${cc}"`
  //   conn.query(query,[data.yearOfStart,data.NBA,data.accreditedUpto],(err)=>{
  //     if(err) throw err;
  //   })
  // }
}
const update_new_branch = async (req, res) => {
  const { data, c_code, clg_name } = req.body;
  const cn = data.oldBranchName;
  // const error = validate(data)
  // console.log(data);
  // console.log(error);
  try {
    // if (Object.keys(error).length === 0) {
    const [db_upd_new_brn] = await conn.query(`
      UPDATE proposed_branch SET coursename=?,intake=?,remarks=?
      where coursename=? and collegecode = ?`,
      [data.branchName, data.approvedIntake, data.remarks, cn, c_code],

    )


    if (db_upd_new_brn) {
      res.status(200).json({ success: true, message: "data updated successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });

    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }

}

const delete_branch = async (req, res) => {
  const { b_code, c_code, clg_name } = req.body

  try {
    const [db_del_brn] = await conn.query(`
      DELETE FROM coursesall 
      WHERE coursecode =? and collegecode = ?`,
      [b_code, c_code]
    )
    if (db_del_brn) {
      res.status(200).json({ success: true, message: "data deleted successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
}
const delete_new_branch = async (req, res) => {
  const { b_code, c_code, clg_name } = req.body
  try {
    const [db_del_new_brn] = await conn.query(`
      DELETE FROM proposed_branch
      WHERE coursename =? and collegecode = ?`,
      [b_code, c_code]

    )
    if (db_del_new_brn) {
      res.status(200).json({ success: true, message: "data deleted successfully" });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }

}

const get_branch_code = async (req, res) => {

  const { c_code, clg_name } = req.body


  try {
    const [db_get_brn_code] = await conn.query(`
      SELECT coursecode FROM coursesall
      where collegecode = ?`,
      [c_code]
    )
    if (db_get_brn_code) {
      res.status(200).json({ success: true, message: "data received successfully", result: db_get_brn_code });
    }
    else {
      res.status(200).json({ success: false, message: "query exeution error" });
    }
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Failed to receive" });
  }
}


module.exports = {
  store_branch,
  store_new_branch,
  get_branch_details,
  specific_row,
  update_add_branch,
  update_new_branch,
  delete_branch,
  delete_new_branch,
  get_branch_code
}