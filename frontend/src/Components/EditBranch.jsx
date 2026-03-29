import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Styles/AddBranch.css'
import axios from 'axios';
import { backend_path } from '../Constants/backend';
import Alert from './Alert';

function EditBranch() {

    const [branchName, setBranchName] = useState('')
    const [formData, setFormData] = useState({});
    const [fetchedData, setFetchedData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [path, setPath] = useState('')

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
            errors.approvedIntake = "Intake should be a number"
        }
        if (typeof data.proposedIntake === "undefined") { }
        else if (isNaN(data.proposedIntake)) {
            errors.proposedIntake = "Intake should be a number"
        }
        // if (typeof data.yearOfStart === "undefined") { }
        // else if (isNaN(data.yearOfStart)) {
        //     errors.yearOfStart = "Start year should be a number"
        // }
        // else if (data.yearOfStart.length < 4) {
        //     errors.yearOfStart = "Invalid data"
        // }
        // else if (data.yearOfStart > 2025) {
        //     errors.yearOfStart = "Start year should be lessthan 2024"
        // }
        if (typeof data.accreditedUpto == "undefined" || data.accreditedUpto == "") { }
        else if (isNaN(data.accreditedUpto) || data.accreditedUpto.length !== 4) {
            errors.accreditedUpto = "Invalid data"
        }
        else if ((data.accreditedUpto - data.yearOfStart) < 5) {
            errors.accreditedUpto = "Invalid data"
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
       

        if (Object.keys(errors).length <= 1 && e.target.name === "editAddBranch") {
            const res = await axios.post(`${backend_path}/update_add_branch`, { data: formData })
            // .then(res => { // console.log(res) })
            // .catch(err => // console.log(err))
            // console.log("data")
            if (res.data.success) {
                // console.log(res.data)
                setAlertMsg("Branch details updated successfully..!")
                setPath("../")
                setShowAlert(true);
            } else {
                // console.log(res.data.message);
            }
        }
        if (Object.keys(errors).length <= 2 && e.target.name === "editNewBranch") {
            // console.log(branchName);
            const res = await axios.post(`${backend_path}/update_new_branch`, { data: formData })
            // .then(res => {
            //     // console.log(res)
            // })
            // .catch(err => // console.log(err))
            if (res.data.success) {
              
                setAlertMsg("Branch details updated successfully..!")
                setPath("../")
                setShowAlert(true);
            } else {
                // console.log(res.data.message);

            }
        }

    };

    useEffect(() => {

        if (sessionStorage.getItem("freeze_sts") == "F") {
            setAlertMsg("You have already freezed")
            setPath("/home")
            setShowAlert(true);
            return;
        }

        async function fetchData() {
            const res = await axios.post(`${backend_path}/specific_branch`, { id: sessionStorage.getItem("b_code") })
            if (res.data.error) {
                // alert("You haven't login")
                // navigate("/")
                setAlertMsg("You haven't login")
                setPath("/")
                setShowAlert(true);

            }
            if (res.data.success) {
                console.log("edit fetch data",sessionStorage.getItem("b_code") );
                setFetchedData(res.data.result[0])

                setFormData({
                    oldBranchName: res.data.result[0].coursename || '',
                    branchName: res.data.result[0].coursename || '',
                    branchCode: res.data.result[0].coursecode || '',
                    approvedIntake: res.data.result[0].intake || '',
                    remarks: res.data.result[0].remarks || '',
                    yearOfStart: res.data.result[0].startyear || '',
                    accreditedUpto: res.data.result[0].validity || '',
                    NBA: res.data.result[0].nba || ''
                });
                // window.location.reload();
                setBranchName(res.data.result[0].coursename);
            }
            else {
                navigate("/branch_details");

            }
        }
        fetchData();

    }, [])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            let newFormData = { ...prevFormData, [name]: value };

            if (name === "branchName" && fetchedData.coursecode === "-") {
                let array = value.split("|");
                newFormData = {
                    ...newFormData,
                    branchName: array[0] || '',
                    branchCode: array[1] || ''
                };
            }
            if (name == "NBA" && value == "No") {
                newFormData = {
                    ...newFormData,
                    accreditedUpto: ''
                };
            }
            return newFormData;
        });
    };


    useEffect(() => {
        const curErrors = validate(formData);
        setErrors(curErrors);

    }, [formData]);

    return (
    
            <div className='edit_branch_container'>
                <h4 style={{ textAlign: "center", position: "absolute" }}>{fetchedData.collegecode}-{fetchedData.collegename}</h4>
                {fetchedData.coursecode !== "-" ? (
                    <>
                        <h3 style={{ textAlign: "center", position: "absolute", marginTop: "40px", fontWeight: "400" }}>{fetchedData.coursecode}-{fetchedData.coursename}</h3>
                        <form onSubmit={handleSubmit} style={{ marginTop: "100px" }} name='editAddBranch' className='editAddBranch'>
                            <div>
                                <label className='edit_branch_labels' htmlFor="">Branch Name :</label><br />
                                <input name="branchName" value={formData.branchName && formData.branchName} className='edit_branch_courseName edit_branch_inputs' disabled />
                            </div>
                            <div>
                                <label className='edit_branch_labels'>Branch Code :</label><br />
                                <input type='text' name='branchCode' className='edit_branch_inputs' value={formData.branchCode ? formData.branchCode : "-"} disabled />
                            </div>

                            <div>
                                <label className='edit_branch_labels'>if any change in intake :</label><br />
                                <div>
                                    <input style={{ width: "15px", marginRight: "20px" }} type='radio' name='hasChanged' className='edit_branch_inputs' value="Yes" onChange={handleChange} required />
                                    <label style={{ position: "relative", bottom: "10px" }} htmlFor="">Yes</label>
                                    <input style={{ width: "15px", margin: " 0 20px" }} type='radio' name='hasChanged' className='edit_branch_inputs' value="No" onChange={handleChange} />
                                    <label style={{ position: "relative", bottom: "10px" }} htmlFor="">No</label>
                                </div>
                            </div>


                            <div>
                                <label className='edit_branch_labels'>Existing Intake :</label><br />
                                <input type='text' name='approvedIntake' className='edit_branch_inputs' value={formData.approvedIntake && formData.approvedIntake} disabled />
                                {errors.approvedIntake && <p className='edit_branch_error'>{errors.approvedIntake}</p>}
                            </div>

                            {formData.hasChanged === "Yes" && (
                                <>
                                    <div>
                                        <label className='edit_branch_labels'>Proposed Intake :</label><br />
                                        <input type='text' name='proposedIntake' className='edit_branch_inputs' onChange={handleChange} required />
                                        {errors.proposedIntake && <p className='edit_branch_error'>{errors.proposedIntake}</p>}
                                    </div>
                                    <div>
                                        <label className='edit_branch_labels'>Remarks :</label><br />
                                        <select name='remarks' className='edit_branch_inputs' style={{width:"420px"}} onChange={handleChange} required>
                                            <option value="">Select an option</option>
                                            <option value="AICTE">To be approved by AICTE</option>
                                            <option value="AU">To be approved by Anna University</option>
                                        </select>
                                        {errors.remarks && <p className='edit_branch_error'>{errors.remarks}</p>}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className='edit_branch_labels'>Year of starting course :</label><br />
                                <input type='number' name='yearOfStart' className='edit_branch_inputs' value={formData.yearOfStart && formData.yearOfStart} onChange={handleChange} disabled />
                                <p style={{ color: "gray", position: "relative", bottom: "20px", fontSize: "13px" }}>(Year upto 2025 e.g, 2024 )</p>
                                {errors.yearOfStart && <p className='edit_branch_error'>{errors.yearOfStart}</p>}
                            </div>
                            <div>
                                <label className='edit_branch_labels'>Whether NBA Accredited :</label><br />
                                <div>
                                    <input style={{ width: "15px", marginRight: "20px" }} type='radio' name='NBA' checked={formData.NBA && formData.NBA === "Yes"} className='edit_branch_inputs' value="Yes" onChange={handleChange} required />
                                    <label style={{ position: "relative", bottom: "10px" }} htmlFor="">Yes</label>
                                    <input style={{ width: "15px", margin: " 0 20px" }} type='radio' name='NBA' className='edit_branch_inputs' checked={formData.NBA && formData.NBA === "No"} value="No" onChange={handleChange} />
                                    <label style={{ position: "relative", bottom: "10px" }} htmlFor="">No</label>
                                </div>
                            </div>
                            {formData.NBA === "Yes" && (
                                <div>
                                    <label className='edit_branch_labels'>Accredited Upto :</label><br />
                                    <input type='text' style={{ marginBottom: 0 }} name='accreditedUpto' value={formData.accreditedUpto && formData.accreditedUpto} className='edit_branch_inputs' onChange={handleChange} required />
                                    <p style={{ color: "gray", fontSize: "13px" }}>(Should greater than the start year )</p>
                                    {errors.accreditedUpto && <p className='edit_branch_error' style={{ marginTop: "20px" }}>{errors.accreditedUpto}</p>}
                                </div>
                            )}
                            <div style={{ marginBottom: "20px" }}>
                                <button className='edit_branch_submitBtn' type='submit'>Save</button>
                                <Link to="/branch_details" className='edit_branch_backBtn'>Back</Link>
                            </div>
                        </form>
                        {showAlert ? (<Alert message={alertMsg} path={path} />):(null)}
                    </>
                ) : (
                    <form onSubmit={handleSubmit} style={{ marginTop: "40px" }} name='editNewBranch' className='editNewBranch'>
                        <div>
                            <label className='edit_branch_labels' htmlFor="">Branch Name :</label><br />
                            <input type='text' name='branchName' className='edit_branch_inputs' value={formData.branchName} onChange={handleChange} required />
                            {errors.branchName && <p className='edit_branch_error'>{errors.branchName}</p>}
                        </div>
                        <div>
                            <label className='edit_branch_labels'>Approved Intake :</label><br />
                            <input type='text' name='approvedIntake' className='edit_branch_inputs' value={formData.approvedIntake} onChange={handleChange} required />
                            {errors.approvedIntake && <p className='edit_branch_error'>{errors.approvedIntake}</p>}
                        </div>
                        <div>
                            <label className='edit_branch_labels'>Remarks :</label><br />
                            <select name='remarks' className='edit_branch_inputs' value={formData.remarks} style={{width:"420px"}} onChange={handleChange} required>
                                <option value="">Select an option</option>
                                <option value="AICTE">To be approved by AICTE</option>
                                <option value="AU">To be approved by Anna University</option>
                            </select>
                            {errors.remarks && <p className='edit_branch_error'>{errors.remarks}</p>}
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <button className='edit_branch_submitBtn' type='submit'>Save</button>
                            <Link to="/branch_details" className='edit_branch_backBtn'>Back</Link>
                        </div>
                        
                        {showAlert ? (<Alert message={alertMsg} path={path} />):(null)}
                         
                        
                    </form>
                )}

            </div>
        )

}


export default EditBranch;