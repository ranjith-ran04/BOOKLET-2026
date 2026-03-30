import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Styles/AddBranch.css';
import axios from 'axios';
import options from '../Constants/branches';
import { backend_path } from '../Constants/backend';
import Alert from './Alert';

function AddBranch() {
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [path, setPath] = useState('')
  const [formData, setFormData] = useState({
    approvedIntake: "",
    yearOfStart: "",
    accreditedUpto: "",
    NBA: ""
  });
  const [branchCodes, setBranchCodes] = useState([]);
  const [errors, setErrors] = useState({});
  const date = new Date();
  const navigate = useNavigate();

  const validate = (data) => {
    const errors = {};
    if (data.approvedIntake === "") { }
    else if (isNaN(data.approvedIntake)) {
      errors.approvedIntake = "Approved Intake should be a number";
    }
    if (data.yearOfStart === "") { }
    else if (isNaN(data.yearOfStart)) {
      errors.yearOfStart = "Start year should be a number";
    }
    else if (data.yearOfStart.length !== 4) {
      errors.yearOfStart = "Invalid data";
    }
    else if (data.yearOfStart > date.getFullYear()) {
      errors.yearOfStart = `Start year should be less than ${date.getFullYear()}`;
    }
    if (data.accreditedUpto === '') { }
    else if (isNaN(data.accreditedUpto) || data.accreditedUpto.length !== 4) {
      errors.accreditedUpto = "Invalid data";
    }
    else if ((data.accreditedUpto - data.yearOfStart) < 5) {
      errors.accreditedUpto = "Invalid data";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const curErrors = validate(formData);
    setErrors(curErrors);
    if (Object.keys(curErrors).length === 0) {
      const res = await axios.post(`${backend_path}/store_branch`, formData)
      // .then(res => // // console.log(res.data))
      // .catch(err => // // console.log(err));
      if (res.data.error) {
        // alert("You haven't login")
        // navigate("/")
        setAlertMsg("You haven't login")
        setPath("/")
        setShowAlert(true);
        return;
      }
      
      if (res.data.success) {
        // alert("Branch Added Successfully");
        // navigate('../branch_details');
        setAlertMsg("Branch Added Successfully")
        setPath("../branch_details")
        setShowAlert(true);
      } else {
        // // console.log(res.data.msg);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));

    let array = value.split("|");
    if(name==="NBA" && value==="No"){
        setFormData(prev => ({ ...prev, accreditedUpto:""}));
    }
    if (name === "branchName") {
      setFormData(prev => ({ ...prev, "branchCode": array[1], "branchName": array[0] }));
    }
    const curErrors = validate({ ...formData, [name]: value });
    setErrors(curErrors);
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.post(`${backend_path}/get_branch_code`)
      // // console.log(res.data.result);

      if (res.data.error) {
        // alert("You haven't login")
        // navigate("/")
        setAlertMsg("You haven't login")
        setPath("/")
        setShowAlert(true);
        return;
      }
      if(sessionStorage.getItem("freeze_sts")=="F"){
        setAlertMsg("You have already freezed")
        setPath("/home")
        setShowAlert(true);
        return;
      }

      if (res.data.success) {
        setBranchCodes(res.data.result)
      }
      // // console.log(branchCodes);

    }
    fetchData();
    // .then(res => setBranchCodes(res.data))
    // .catch(err => // // console.log(err));
  }, []);

  const courseCodesSet = new Set(branchCodes.map(item => item.coursecode));
  const filteredOptions = options.filter(option => {
    const courseCode = option.value.split('|')[1];
    return !courseCodesSet.has(courseCode);
  });

  return (
    
      <div className='add_branch_container'>
        <form onSubmit={handleSubmit} className='addBranch'>
          <div>
            <label className='add_branch_labels'>Branch Name :</label><br />
            <select name="branchName" className='add_branch_courseName add_branch_inputs' style={{width:"420px"}} onChange={handleChange} required>
              <option disabled="" value=""></option>
              {filteredOptions.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='add_branch_labels'>Branch Code :</label><br />
            <input type='text' name='branchCode' className='add_branch_inputs' value={formData.branchCode} disabled />
          </div>
          <div>
            <label className='add_branch_labels'>Approved Intake :</label><br />
            <input type='text' name='approvedIntake' className='add_branch_inputs' value={formData.approvedIntake} onChange={handleChange} required />
            {errors.approvedIntake && <p className='add_branch_error'>{errors.approvedIntake}</p>}
          </div>
          <div>
            <label className='add_branch_labels'>Year of starting course :</label><br />
            <input type='text' name='yearOfStart' className='add_branch_inputs' value={formData.yearOfStart} onChange={handleChange} required />
            <p style={{ color: "gray", position: "relative", bottom: "20px", fontSize: "13px" }}>(Year upto {date.getFullYear()} e.g, 2023 )</p>
            {errors.yearOfStart && <p className='add_branch_error'>{errors.yearOfStart}</p>}
          </div>
          <div>
            <label className='add_branch_labels'>Whether NBA Accredited :</label><br />
            <div>
              <input style={{ width: "15px", marginRight: "20px" }} type='radio' name='NBA' className='add_branch_inputs' value="Yes" onChange={handleChange} required />
              <label style={{ position: "relative", bottom: "10px" }}>Yes</label>
              <input style={{ width: "15px", margin: " 0 20px" }} type='radio' name='NBA' className='add_branch_inputs' value="No" onChange={handleChange} />
              <label style={{ position: "relative", bottom: "10px" }}>No</label>
            </div>
          </div>
          <div>
            <label className='add_branch_labels'>Accredited Valid Upto</label><br />
            <input style={{ marginBottom: 0 }} type='text' name='accreditedUpto' className='add_branch_inputs' value={formData.NBA === "Yes" ? formData.accreditedUpto : ''} onChange={handleChange} required={formData.NBA === "Yes"} disabled={formData.NBA !== "Yes"} />
            <p style={{ color: "gray", fontSize: "13px" }}>(Should be greater than the start year)</p>
            {errors.accreditedUpto && <p style={{ fontSize: "medium", color: "red" }}>{errors.accreditedUpto}</p>}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <button className='add_branch_submitBtn' type='submit'>Save</button>
            <Link to="/branch_details" className='add_branch_backBtn'>Back</Link>
          </div>
        </form>
        {showAlert ? (<Alert message={alertMsg} path={path} />):(null)}
      </div>)
  
}

export default AddBranch;
