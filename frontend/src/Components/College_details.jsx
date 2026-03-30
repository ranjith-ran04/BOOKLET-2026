import React from 'react';
import './Styles/Collegedetails.css';
import { useState,useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { backend_path } from '../Constants/backend';
import district from '../Constants/districts.json'
import colname from '../Constants/college'
import Alert from './Alert';

function College_details() {
  const  c_code=sessionStorage.getItem("clg_code")
  const [showAlert, setShowAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [path, setPath] = useState('')
  const [inputs, setinput] = useState({
   
    college_code:c_code,
    college_name:colname.get(c_code)
    
    

  })

 
  const navigate=useNavigate();

  const [errors, seterror] = useState({});
  const [submit, setsubmit] = useState(false);
  function validate(e) {
    let errors = {}
    if (!e.principal_name) {
      errors.principal_name = "⚠ Name is required";
    }
    else if (!nameregex.test(e.principal_name)) {
      errors.principal_name = "⚠ Invalid Name"
    }
    if (!e.phone_number) {
      errors.phone_number = "⚠ Phone or fax number required"
    }
    else if (!phoneregex.test(e.phone_number)) {
      errors.phone_number = "⚠ Incorrect mobile number"
    }
    if (!e.pincode) {
      errors.pincode = "⚠ Please enter the pincode"
    }
    else if (!pinregex.test(e.pincode)) {
      errors.pincode = "⚠ Invalid Pincode "
    }
    if (!e.ragging_phone_number) {
      errors.ragging_phone_number = "⚠ Number is required"
    }

    else if (!antiragging_number_regex.test(e.ragging_phone_number)) {
      errors.ragging_phone_number = "⚠ Invalid number"
    }
    if (!e.Taluk_name) {
      errors.Taluk_name = "⚠ Taluk name is required"
    }
    else if (!nameregex.test(e.Taluk_name)) {
      errors.Taluk_name = "⚠ Invalid taluk name"
    }
    if (!e.Address) {
      errors.Address = "⚠ College Address is required"
    }
    else if (!addressregex.test(e.Address)) {
      errors.Address = "⚠ Invalid Address";
    }
    if (e.district === " ") {
      errors.district = "⚠ Select college district name"
    }

    if (!e.email) {
      errors.email = "⚠ Email is required"
    }
    else if (!emailregex.test(e.email)) {
      errors.email = "⚠ Invalid email"
    }
    if (!e.website) {
      errors.website = "⚠ Website is required"
    }
    // else if(!websiteregex.test(e.website)){
   
        // errors.website="⚠website is invalid"
    // }
    return errors
  }
  const handle = (e) => {
    const error = validate(inputs)
    // alert(inputs.college_code);
    setinput((prev)=>{
       const newValue={...prev,[e.target.name]:e.target.value}
       seterror(error);
       return newValue;
    })
  }

  const getdata = async () => {

    if(sessionStorage.getItem("freeze_sts")=="F"){
      setAlertMsg("You have already freezed")
      setPath("/home")
      setShowAlert(true);
      return;
    }

    try {
      const res = await axios.post(`${backend_path}/getcollegedetails`);

      if (res.data.error) {
        // alert("You haven't login")
        // navigate("/")
        setAlertMsg("You haven't login")
        setPath("/")
        setShowAlert(true);
        return;
      }
     
      setinput({
        ...inputs,
        principal_name: res.data.result[0].name || '', 
        college_code: res.data.result[0].college_code || c_code, 
        Taluk_name: res.data.result[0].taluk|| '',
        pincode: res.data.result[0].pincode || '',
        ragging_phone_number: res.data.result[0].antiphone || '',
        Address: res.data.result[0].address || '',
        district: res.data.result[0].district || '',
        email: res.data.result[0].email || '',
        website: res.data.result[0].website || '',
        phone_number: res.data.result[0].phone || '',
        placement_count:res.data.result[0].placement||0
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(()=>{
  
    getdata()

  }, [])

  const fetchdata = async () => {
    // // console.log("fetchruns");
    const res=await axios.post(`${backend_path}/college_insert`, {inputs});
    if(res.data.success==true){
      setAlertMsg(res.data.message)
      setShowAlert(true)
      setPath("/home")
    }
  }
  
  const submission = (e) => {
    e.preventDefault();
    setsubmit(true);
    const error = validate(inputs)
    seterror(error);
    if(Object.keys(error).length == 0) {
 
      fetchdata();
        
    } 
  }
  const phoneregex = /^[1,2,3,4,5,67,8,6,9]\d{9}$/;
  const fphoneregex = /^d{10}$/;
  const pinregex = /^[6]\d{5}$/;
  const antiragging_number_regex = /^[7,8,6,9,4,5,6]\d{9}$/;
  const nameregex = /^[A-Za-z ]+$/;
  const addressregex =/^[A-Za-z0-9\.\"\-\s\,]/
  // const emailregex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+@[a-z]+\.[a-z0-9]+$/
  const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const websiteregex = /^[a-zA-Z]$/;

useEffect(()=>{
  const submiterror=validate(inputs);
  seterror(submiterror)
},[inputs])


  return (

   
      <form id="college_details-form" onSubmit={submission}>
        <div className="college_details">
          <div className="college_details-border">
            <div className="college_details-container">
              <div className="college_details-part1">
                <div>
                  <label>College Code</label>
                  <br></br>
                  <input name="college_code" className='college_details-input' onChange={handle} value={inputs.college_code} disabled></input>
                </div>
                <div>
                  <label>Name of the principal/Dean</label>{submit && errors.principal_name && <span className='college_details-error'>{errors.principal_name}</span>}<br></br>
                  <input name="principal_name"  className='college_details-input' onChange={handle} value={inputs.principal_name} max="5"></input>
                  <p>(e.g.DR S XXXXXX)</p>
                </div>
                <div>
                  <label>Taluk</label>{submit && errors.Taluk_name && <span className='college_details-error'>{errors.Taluk_name}</span>}
                  <br></br>
                  <input name="Taluk_name"  className='college_details-input' onChange={handle} value={inputs.Taluk_name} ></input>
                </div>
                <div>
                  <label>Pincode</label>{submit && errors.pincode && <span className='college_details-error'>{errors.pincode}</span>}
                  <br></br>
                  <input name="pincode"  className='college_details-input' value={inputs.pincode} onChange={handle} maxLength="6" ></input>
                  <p>(e.g,6xxxx)</p>
                </div>
                <div>
                  <label>Email-ID</label>{submit && errors.email && <span className='college_details-error'>{errors.email}</span>}
                  <br></br>
                  <input name="email"  className='college_details-input' value={inputs.email} onChange={handle} ></input>
                  <p>(e.g example@domain.com-includes '@'&'.')</p>
                </div>
                <div>
                  <label>Anti-Ragging phone no:</label>{submit && errors.ragging_phone_number && <span className='college_details-error'>{errors.ragging_phone_number}</span>}
                  <br></br>
                  <input name="ragging_phone_number"  className='college_details-input'  value={inputs.ragging_phone_number} onChange={handle} maxLength="10"></input>
                  <p>Minimum 10 Digit starts with 6 to 9</p>
                </div>
              </div>
              <div className="college_details-part2">
                <div>
                  <label>College Name</label>
                  <br></br>
                  <input name="college_name" className='college_details-input' onChange={handle} value={inputs.college_name} disabled ></input>
                </div>
                <div >
                  <label>Address</label>
                  {submit && errors.Address && <span className='college_details-error'>{errors.Address}</span>}
                  <br></br>
                  <input name="Address"  className='college_details-input' onChange={handle} value={inputs.Address} ></input>
                  <p>Only Address(e.g,22/5,xxxxx,xxxxx) Don't include college name</p>
                </div>
                <div>
                  <label>DISTRICT</label>{submit && errors.district && <span className='college_details-error'>{errors.district}</span>}
                  <br></br>
                  <select name="district" className='college_details-district' onChange={handle}>
                    <option value="">{inputs.district}</option>
                    { district.map((data)=>(
                      <option>
                        {data} 
                      </option>
                    ))
                    }
                    
                  </select>
                </div>
                <div>
                  <label>Phone/Fax</label>{submit && errors.phone_number && <span className='college_details-error'>{errors.phone_number}</span>}
                  <br></br>
                  <input name="phone_number" className='college_details-input' value={inputs.phone_number} maxLength={10} onChange={handle} ></input>
                  <p>(e.g,4xxxxxxxxx,8xxxxxxxxx)</p>
                </div>
                <div>
                  <label>Website</label>{submit && errors.website && <span className='college_details-error'>{errors.website}</span>}
                  <br></br>
                  <input name="website"  className='college_details-input'  value={inputs.website} onChange={handle} ></input>
                    <p>(e.g accet.ac.in)</p>
                </div>
                 <div>
                  <label>Placement Percentage</label>
                  <input name="placement_count"  className='college_details-input' onChange={handle} value={inputs.placement_count} ></input>
                  <p>(Exclude Percentage Character)</p>
                </div>
              </div>
            </div>



          </div>
          <div className='bu'>
          <button id="save" type="submit">Save & continue</button>
          <button id="back" onClick={()=>{navigate('/Home')}}>Back</button>
          </div>
        </div>
       { showAlert ? 
          
    (<Alert message={alertMsg} path={path}/>):null
       }
      </form>

  );
}

export default College_details;
  