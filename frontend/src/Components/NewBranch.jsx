import React, { useState, useEffect } from 'react';
import './Styles/AddBranch.css'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { backend_path } from '../Constants/backend';
import Alert from './Alert';

function NewBranch() {

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [path, setPath] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        async function loginVerify() {

            if(sessionStorage.getItem("freeze_sts")=="F"){
                setAlertMsg("You have already freezed")
                setPath("/home")
                setShowAlert(true);
                return;
              }

            const res = await axios.post(`${backend_path}/login_verification`)
            if (res.data.token_sts != "ok") {
                navigate("/ ")
            }
        }
        loginVerify();
    }, [])

    const validate = (data) => {
        const errors = {};
        if (typeof data.branchName === "undefined") { }
        else if(data.branchName.length<4){
          errors.branchName = "branch name contains above 3 character"
        }
        else if (!/^[a-zA-Z ()]+$/.test(data.branchName)) {
            errors.branchName = "Invalid branch name"
        }
        if (typeof data.approvedIntake === "undefined") { }
        else if (isNaN(data.approvedIntake)) {
            errors.approvedIntake = "Approved Intake should be a number"
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {

            const res = await axios.post(`${backend_path}/store_new_branch`, { formData:formData })
            // // console.log(res.data)
            if (res.data.success) {
                // window.location.href='/branch_details'
                setAlertMsg("New branch added successfully!")
                setPath("../branch_details")
                setShowAlert(true);
            }else{
                setAlertMsg("Branch Already Exists!")
                setPath("../branch_details")
                setShowAlert(true);
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            const newFormData = { ...prevFormData, [name]: value }
            return newFormData;
        });

    };

    useEffect(() => {
        const curErrors = validate(formData);
        setErrors(curErrors);
    }, [formData]);

    return (
        <div className='new_branch_container'>
            <form onSubmit={handleSubmit} className='newBranch'>
                <div>
                    <label className='new_branch_labels' htmlFor="">Branch Name :</label><br />
                    <input type='text' name='branchName' className='new_branch_inputs' value={formData.branchName} onChange={handleChange} required />
                    {errors.branchName && <p className='new_branch_error'>{errors.branchName}</p>}
                </div>
                <div>
                    <label className='new_branch_labels'>Approved Intake :</label><br />
                    <input type='text' name='approvedIntake' className='new_branch_inputs' value={formData.approvedIntake} onChange={handleChange} required />
                    {errors.approvedIntake && <p className='new_branch_error'>{errors.approvedIntake}</p>}
                </div>
                <div>
                    <label className='new_branch_labels'>Remarks :</label><br />
                    <select name='remarks' className='new_branch_inputs' value={formData.remarks} style={{width:"380px"}} onChange={handleChange} required>
                        <option value="">Select an option</option>
                        <option value="AICTE">To be approved by AICTE</option>
                        <option value="AU">To be approved by Anna University</option>
                    </select>
                    {errors.remarks && <p className='new_branch_error'>{errors.remarks}</p>}
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <button className='new_branch_submitBtn' type='submit'>Save</button>
                    <Link to="/branch_details" className='new_branch_backBtn'>Back</Link>
                </div>
            </form>
            {showAlert ? (<Alert message={alertMsg} path={path} />):(null)}
        </div>
    );
}


export default NewBranch;