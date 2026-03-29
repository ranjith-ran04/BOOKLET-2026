const conn = require("./db.js");
const jwt = require("jsonwebtoken")
const { hashing, checkpass } = require('./hash.js')



const login = async (req, res) => {

    const { username, password } = req.body;
    const adminPass = "Booklet@Admin";
    let token;
    if (username == "Boss" && password == "Boss@123") {
        token = jwt.sign({ c_code: username, clg_name: password }, "booklet", {})
        return res.status(200).cookie("auth_token", token, { httpOnly: true }).json({ success: true, message: "admin_login" });
    }



    try {
        console.log("inside login", adminPass, " | ", password);

        const [db_ins_res] = await conn.query(
            `select c_code,changed,password,freeze from login
      where c_code=?`,
            [username]
        );
        // console.log(password)

        if (db_ins_res.length == 0) {
            return res.status(200).json({ success: false, message: "Invalid username" });
        }

        if (password != adminPass) {

            console.log("Not a admin pass");


            if (db_ins_res[0].password != "Tnea@2025") {
                console.log(db_ins_res[0].password)

                const checkpassword = await checkpass(password, db_ins_res[0].password);
                console.log(checkpassword);

                const response = db_ins_res[0];

                if (!checkpassword) {
                    console.log("Invalid pass");

                    res.status(200).json({ success: false, message: "Password Mismatch" });
                }

                else {

                    if (db_ins_res[0].changed == 1) {
                        const [db_get_cName] = await conn.query(
                            "select collegename from summaries where collegecode = ?", [username]
                        )
                        const clg_name = db_get_cName[0].collegename


                        token = jwt.sign({ c_code: username, clg_name: clg_name }, "booklet", {})

                        console.log("token :" + token);

                        return res
                            .status(200)
                            .cookie("auth_token", token, { httpOnly: true })
                            .json({ success: true, message: "data received successfully", result: db_ins_res });
                    }
                }
            }

            else if (db_ins_res[0].password == "Tnea@2025" && password == "Tnea@2025") {
                res.json({ success: true, message: "data received successfully", result: db_ins_res });
            }
            else {
                res.status(200).json({ success: false, message: "Invalid credentials" });
            }
        } else if (password == adminPass) {
            console.log("It's a admin pass");

            const [db_get_cName] = await conn.query(
                "select collegename from summaries where collegecode = ?", [username]
            )
            const clg_name = db_get_cName[0].collegename


            token = jwt.sign({ c_code: username, clg_name: clg_name }, "booklet", {})

            console.log("token :" + token);

            return res
                .status(200)
                .cookie("auth_token", token, { httpOnly: true })
                .json({ success: true, message: "data received successfully", result: db_ins_res });


        }

    }
    catch (err) {
        res.status(200).json({ success: false, message: "Failed to receive" });
    }
}



const login_verify = (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(200).json({ token_sts: "token not found", msg: "loginVerify" })
    } else {
        jwt.verify(token, "booklet", (err, decoded) => {
            if (err) {
                return res.json({ token_sts: "incorrect token", msg: "loginVerify" })
            } else {
                return res.status(200).json({ token_sts: "ok", msg: "loginVerify" })
            }
        })
    }
}





const verify_user = (req, res, next) => {
    try {

        const token = req.cookies.auth_token

        console.log("token :" + !token);


        if (!token) {
            return res.json({ error: "Not Authenticated" })
        } else {
            jwt.verify(token, "booklet", (err, decoded) => {
                if (err) {
                    return res.json({ error: "incorrect token" })
                } else {

                    req.body.c_code = decoded.c_code
                    req.body.clg_name = decoded.clg_name


                    next();
                }
            })
        }
    } catch (err) {
        res.status(500).json({ status: "Server Error", msg: "verifyUser" })
    }

}


const resetpassword = async (req, res) => {
    const { password, clg_code } = req.body;
    console.log(password);
    const hashpass = await hashing(password)

    try {
        const [db_upd_login] = await conn.query(`update login set password=?,changed=?
      where c_code=?  `,
            [hashpass, 1, clg_code]
        )
        console.log(hashpass)
        if (db_upd_login) {
            res.status(200).json({ success: true, message: "Password changed successfully" });
        }
        else {
            res.status(200).json({ success: false, message: "query exeution error" });
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to update" });
    }

}




const logout = (req, res) => {
    try {
        res.clearCookie("auth_token")
        res.json({ success: true, msg: "logout" })
    } catch (error) {
        return res.json({ success: false, status: "server error", msg: "logout" })
    }
}



module.exports = {
    login,
    resetpassword,
    verify_user,
    login_verify,
    logout
}