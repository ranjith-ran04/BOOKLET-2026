const express = require("express")
const router = express.Router();

const { main_pdf } = require("../Pdf/booklet_pdf.js")
const { hostel_update, hostel_get } = require("./hostel.js")
const { login, resetpassword, verify_user, login_verify, logout } = require("./auth.js")
const { college_insert, getcollegedetails, clg_data, submitcol } = require('./college.js')
const { bank_update, getbankdetails } = require("./bank.js")
const { store_branch, store_new_branch, get_branch_details, specific_row, update_add_branch, update_new_branch, delete_branch, delete_new_branch, get_branch_code } = require("./branch.js");
const { Home_update } = require("./Home.js");
const { freeze, unfreeze } = require("./freeze.js");
const { main_booklet_pdf } = require("../Pdf/booklet.js")

router.post("/login", login)
router.post("/login_verification", login_verify)
router.post("/resetpassword", resetpassword)
router.post("/logout", verify_user, logout)


router.post("/hostel_get", verify_user, hostel_get)
router.post("/hostel_update", verify_user, hostel_update)


router.post("/store_branch", verify_user, store_branch)
router.post("/store_new_branch", verify_user, store_new_branch)
router.post("/get_branch_details", verify_user, get_branch_details)
router.post("/update_add_branch", verify_user, update_add_branch)
router.post("/update_new_branch", verify_user, update_new_branch)
router.post("/delete_branch", verify_user, delete_branch)
router.post("/delete_new_branch", verify_user, delete_new_branch)
router.post("/get_branch_code", verify_user, get_branch_code)
router.post("/specific_branch", verify_user, specific_row)

router.post("/home", verify_user, Home_update)
router.post("/home/freeze", verify_user, freeze)
router.post("/unfreeze",unfreeze)

router.post("/getcollegedetails", verify_user, getcollegedetails)
router.post("/college_insert", verify_user, college_insert)


router.post("/getbankdetails", verify_user, getbankdetails)
router.post("/bank_update", verify_user, bank_update)

router.post("/generate_pdf", verify_user, main_pdf)
router.post("/admin_generate_pdf",main_pdf)


router.post("/admin_clg_data",verify_user, clg_data);
router.post("/submitcol",submitcol)

router.post("/admin_booklet", main_booklet_pdf)

module.exports = router