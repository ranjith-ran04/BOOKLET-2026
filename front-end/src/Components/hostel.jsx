import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "./Styles/hostel.css";
import { useNavigate } from 'react-router-dom';
import { backend_path } from "../Constants/backend";
import Alert from "./Alert";
import clg_list from "../Constants/college"

function Hostel() {
  const [formData, setformData] = useState({collegecode:sessionStorage.getItem("clg_code")});
  // const [formData, setformData] = useState({});
  const [clgName,setClgName] = useState(clg_list.get(formData.collegecode));
  const [errors, seterrors] = useState({});
  const [submit, setSubmit] = useState({});
  const [response, setresponse] = useState({});
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [path, setPath] = useState('')
  const navigate = useNavigate();
  function validate(values) {
    let error = {};
    if (!values.boyshostel) {
      error.boyshostel = "⚠ Required";
    }
    if (values.boyshostel === "yes" && !values.boysmess) {
      error.boysmess = "⚠ Required";
    }
    if (values.boyshostel === "yes" && !values.boysrent) {
      error.boysrent = "⚠ Required";
    } else if (values.boyshostel === "yes" && isNaN(values.boysrent)) {
      error.boysrent = "⚠ Invalid Amount";
    }
    if (values.boyshostel === "yes" && !values.boysrental) {
      error.boysrental = "⚠ Required";
    }
    if (values.boyshostel === "yes" && !values.boysmessbill) {
      error.boysmessbill = "⚠ Required";
    } else if (values.boyshostel === "yes" && isNaN(values.boysmessbill)) {
      error.boysmessbill = "⚠ Invalid Amount";
    }
    //  else if (values.boyshostel === "yes" && !values.boysmonth) {
    //   error.boysmonth = "⚠ Please select an option";
    // }
    if (values.boyshostel === "yes" && !values.boyseb) {
      error.boyseb = "⚠ Required";
    } else if (values.boyshostel === "yes" && isNaN(values.boyseb)) {
      error.boyseb = "⚠ Invalid Amount";
    }
    if (!values.girlshostel) {
      error.girlshostel = "⚠ Required";
    }
    if (values.girlshostel === "yes" && !values.girlsmess) {
      error.girlsmess = "⚠ Required";
    }
    if (values.girlshostel === "yes" && !values.girlsrent) {
      error.girlsrent = "⚠ Required";
    } else if (values.girlshostel === "yes" && isNaN(values.girlsrent)) {
      error.girlsrent = "⚠ Invalid Amount";
    }
    if (values.girlshostel === "yes" && !values.girlsrental) {
      error.girlsrental = "⚠ Required";
    }
    if (values.girlshostel === "yes" && !values.girlsmessbill) {
      error.girlsmessbill = "⚠ Required";
    } else if (values.girlshostel === "yes" && isNaN(values.girlsmessbill)) {
      error.girlsmessbill = "⚠ Invalid Amount";
    }
    // else if (values.girlshostel === "yes" && !values.girlsmonth) {
    //   error.girlsmonth = "⚠ Please select an option";
    // }
    if (values.girlshostel === "yes" && !values.girlseb) {
      error.girlseb = "⚠ Required";
    } else if (values.girlshostel === "yes" && isNaN(values.boyseb)) {
      error.girlseb = "⚠ Invalid Amount";
    }
    if (!values.deposit) {
      error.deposit = "⚠ Required";
    } else if (isNaN(values.deposit)) {
      error.deposit = "⚠ Invalid Amount";
    }
    if (!values.fees) {
      error.fees = "⚠ Required";
    } else if (isNaN(values.fees)) {
      error.fees = "⚠ Invalid Amount";
    }
    if (values.transport === "yes" && !values.min) {
      error.min = "⚠ Required";
    } else if (values.transport === "yes" && isNaN(values.min)) {
      error.min = "⚠ Invalid Amount";
    }
    // else if(values.transport==="yes" && values.min>values.max){
    //     error.min="⚠ Amount should be less than max"
    // }
    if (!values.charge) {
      error.charge = "⚠ Required";
    } else if (isNaN(values.charge)) {
      error.charge = "⚠ Invalid Amount";
    }
    if (!values.transport) {
      error.transport = "⚠ Required";
    }
    if (values.transport === "yes" && !values.max) {
      error.max = "⚠ Required";
    } else if (values.transport === "yes" && isNaN(values.max)) {
      error.max = "⚠ Invalid Amount";
    }
    else if (values.transport === "yes" && (Number(values.min) > Number(values.max))) {
      error.max = "⚠ Amount should be greater then minimum "

    }
    return error;
  }
  function onchangevalidation(values) {
    let error = {};
    if (values.boyshostel === "yes" && !values.boysrent) {
    } else if (values.boyshostel === "yes" && isNaN(values.boysrent)) {
      error.boysrent = "⚠ Invalid Amount";
    }
    if (values.boyshostel === "yes" && !values.boysmessbill) {
    } else if (values.boyshostel === "yes" && isNaN(values.boysmessbill)) {
      error.boysmessbill = "⚠ Invalid Amount";
    }
    // else if (values.boyshostel === "yes" && !values.boysmonth) {
    //   error.boysmonth = "⚠ Please select an option";
    // }

    if (values.boyshostel === "yes" && !values.boyseb) {
    } else if (values.boyshostel === "yes" && isNaN(values.boyseb)) {
      error.boyseb = "⚠ Invalid Amount";
    }
    if (values.girlshostel === "yes" && !values.girlsrent) {
    } else if (values.girlshostel === "yes" && isNaN(values.girlsrent)) {
      error.girlsrent = "⚠ Invalid Amount";
    }
    if (values.girlshostel === "yes" && !values.girlsmessbill) {
    } else if (values.girlshostel === "yes" && isNaN(values.girlsmessbill)) {
      error.girlsmessbill = "⚠ Invalid Amount";
    }
    // else if (values.girlshostel === "yes" && !values.girlsmonth) {
    //   error.girlsmonth = "⚠ Please select an option";
    // }
    if (values.girlshostel === "yes" && !values.boyseb) {
    } else if (values.girlshostel === "yes" && isNaN(values.girlseb)) {
      error.girlseb = "⚠ Invalid Amount";
    }
    if (!values.deposit) {
    } else if (isNaN(values.deposit)) {
      error.deposit = "⚠ Invalid Amount";
    }
    if (!values.fees) {
    } else if (isNaN(values.fees)) {
      error.fees = "⚠ Invalid Amount";
    }
    if (values.transport === "yes" && !values.min) {
    } else if (values.transport === "yes" && isNaN(values.min)) {
      error.min = "⚠ Invalid Amount";
    }
    if (!values.charge) {
    } else if (isNaN(values.charge)) {
      error.charge = "⚠ Invalid Amount";
    }
    if (values.transport === "yes" && !values.max) {
    } else if (values.transport === "yes" && isNaN(values.max)) {
      error.max = "⚠ Invalid Amount";
    }
    return error;
  }
  const handlechange = (e) => {
    const { name, value } = e.target;
    if (name === "boyshostel") {
      if (value === "no") {
        setformData((prev) => ({
          ...prev, boysmess: null, boysrent: null, boysrental: null, boysmessbill: null, boysmonth: null, boyseb: null
        }));
      }
    }
    if (name === "girlshostel") {
      if (value === "no") {
        setformData((prev) => ({
          ...prev, girlsmess: null, girlsrent: null, girlsrental: null, girlsmessbill: null, girlsmonth: null, girlseb: null
        }));
      }
    }
    if (name === "transport") {
      if (value === "no") {
        setformData((prev) => ({
          ...prev, min: null, max: null
        }));
      }
    }
    setformData((prevoptions) => {
      const update = { ...prevoptions, [name]: value };
      let errors = onchangevalidation(update);
      seterrors(errors);
      return update;
    });
    // alert(formData.boy)
  };

  useEffect(() => {



    const getdata = async () => {

      if (sessionStorage.getItem("freeze_sts") == "F") {
        setAlertMsg("You have already freezed")
        setPath("/home")
        setShowAlert(true);
        return;
      }

      const res = await axios.post(`${backend_path}/hostel_get`, { c_code: 1 })
      // console.log(res.data);
      // return res.data;
      // setdb(res.data)
      if (res.data.error) {
        setAlertMsg("You haven't login")
        setPath("/")
        setShowAlert(true);
        return;

      }
      console.log("clg code:",clgName);
      
      setformData({
        collegecode:formData.collegecode,
        collegename:clgName,
        boyshostel: res.data.result[0].accb!=null ? res.data.result[0].accb.toLowerCase() :"",
        boysmess:    res.data.result[0].messb!=null ?res.data.result[0].messb.toLowerCase() : "",
        boysrental: res.data.result[0].htypeb? res.data.result[0].htypeb.toLowerCase() : "",
        boysrent: res.data.result[0].rentb || "",
        boysmessbill: res.data.result[0].billb || "",
        boyseb: res.data.result[0].elecb || "",
        girlshostel: res.data.result[0].accg?res.data.result[0].accg.toLowerCase() : "",
        girlsmess:res.data.result[0].messg? res.data.result[0].messg.toLowerCase() : "",
        girlsrental:res.data.result[0].htypeg? res.data.result[0].htypeg.toLowerCase() : "",
        girlsrent: res.data.result[0].rentg || "",
        girlsmessbill: res.data.result[0].billg || "",
        girlseb: res.data.result[0].elecg || "",
        deposit: res.data.result[0].caution || "",
        charge: res.data.result[0].estab || "",
        fees: res.data.result[0].adm || "",
        transport:res.data.result[0].trans? res.data.result[0].trans.toLowerCase() : "",
        min: res.data.result[0].mintrans || "",
        max: res.data.result[0].maxtrans || ""
      }

      )


    }
    // const hii=getdata()
    // // console.log(hii);

    getdata()
  }, [])
  const fetchdata = async () => {
    const res = await axios.post(`${backend_path}/hostel_update`, formData);
    // setresponse(res.data)
    // // console.log(res.data)

    if (res.data.success) {
      setAlertMsg(res.data.message)
      setPath("/Home")
      setShowAlert(true);
    }
    else {
      setAlertMsg(res.data.message);
      setPath("/hostel");
      setShowAlert(true);
    }
  }
  function handleSubmit(e) {
    
    e.preventDefault();
    setSubmit(true);
    const error = validate(formData);
    seterrors(error);
    if (Object.keys(error).length === 0) {
      fetchdata()
      // navigate('/Home')
    }
  }
  return (

    <div>
      <h2 className="hostel_h2" style={{margin:"20px 0px"}}>{formData.collegecode}-{formData.collegename}</h2>
      <div className="hostel_totaltables" >
        <form className="hostel_form" onSubmit={handleSubmit}>
          <div className="hostel_table">
            <h3 className="hostel_h3">Hostel Facilities for Boys</h3>
            <div className="hostel_containe">
              <div className="hostel_bod">
                <div className="hostel_content">
                  <label className="hostel_label" >
                    Accommodation Available for UG
                  </label>
                  {errors.boyshostel && (
                    <p className="hostel_error">{errors.boyshostel}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="boyshostel"
                    value="yes"
                    checked={formData.boyshostel === "yes"}
                    onChange={handlechange}
                  // onBlur={changeboys}
                  />
                  <label>Yes</label>
                  <br></br>
                  <input
                    type="radio"
                    name="boyshostel"
                    value="no"
                    checked={formData.boyshostel === "no"}
                    onChange={handlechange}
                  // onBlur={changeboys}  
                  />
                  <label>No</label>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Type of Mess (Veg/NV)</label>
                  {errors.boysmess && (
                    <p className="hostel_error">{errors.boysmess}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="boysmess"
                    value="veg"
                    disabled={formData.boyshostel === "no"}
                    checked={formData.boysmess === "veg"}
                    onChange={handlechange}
                  />
                  <label>Veg</label>
                  <br></br>
                  <input
                    type="radio"
                    name="boysmess"
                    value="nonveg"
                    disabled={formData.boyshostel === "no"}
                    checked={formData.boysmess === "nonveg"}
                    onChange={handlechange}
                  />
                  <label>Non-Veg</label>
                  <br></br>
                  <input
                    type="radio"
                    name="boysmess"
                    value="both"
                    disabled={formData.boyshostel === "no"}
                    checked={formData.boysmess === "both"}
                    onChange={handlechange}
                  />
                  <label>Both</label>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Room Rent (in Rs.)</label>
                  {errors.boysrent && (
                    <p className="hostel_error">{errors.boysrent}</p>
                  )}
                  <br></br>
                  <input
                    className="hostel_inp"
                    name="boysrent"
                    value={(formData.boyshostel == "no") ? " " : formData.boysrent}
                    disabled={formData.boyshostel === "no"}
                    onChange={handlechange}
                     maxLength={5}
                  />
                </div>
              </div>
              <div className="hostel_bod">
                <div className="hostel_content">
                  <label className="hostel_label">Permanent or Rental (Hostel Building)</label>
                  {errors.boysrental && (
                    <p className="hostel_error">{errors.boysrental}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="boysrental"
                    value="permanent"
                    disabled={formData.boyshostel === "no"}
                    checked={formData.boysrental === "permanent"}
                    onChange={handlechange}
                  />
                  <label>Permanent</label>
                  <br></br>
                  <input
                    type="radio"
                    name="boysrental"
                    value="Rental"
                    disabled={formData.boyshostel === "no"}
                    checked={formData.boysrental === "Rental"}
                    onChange={handlechange}
                  />
                  <label>Rental</label>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Mess Bill</label>
                  {errors.boysmessbill && (
                    <p className="hostel_error">{errors.boysmessbill}</p>
                  )}
                  {/* { errors.boysmonth && (
                    <p className="hostel_error">{errors.boysmonth}</p>
                  )} */}
                  <br></br>
                  <input
                    className="hostel_inp1"
                    name="boysmessbill"
                    value={(formData.boyshostel == "no") ? " " : formData.boysmessbill}
                    disabled={formData.boyshostel === "no"}
                    onChange={handlechange}
                  />
                  <select
                    className="hostel_inp2 "
                    style={{ width: "150px" }}
                    name="boysmonth"
                    value={(formData.boyshostel == "no") ? " " : formData.boysmonth}
                    disabled={formData.boyshostel === "no"}
                    onChange={handlechange}
                  >
                    <option value="month">Per Month</option>
                    <option value="annum">Per Annum</option>
                  </select>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Electricity Charges (in Rs.)</label>
                  {errors.boyseb && <p className="hostel_error">{errors.boyseb}</p>}
                  <br></br>
                  <input
                    className="hostel_inp"
                    name="boyseb"
                    value={(formData.boyshostel == "no") ? " " : formData.boyseb}
                    disabled={formData.boyshostel === "no"}
                    onChange={handlechange}
                     maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div className="hostel_table">
            <h3 className="hostel_h3">Hostel Facilities for Girls</h3>
            <div className="hostel_containe">
              <div className="hostel_bod">
                <div className="hostel_content">
                  <label className="hostel_label">
                    Accommodation Available for UG
                  </label>
                  {errors.girlshostel && (
                    <p className="hostel_error">{errors.girlshostel}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="girlshostel"
                    value="yes"
                    checked={formData.girlshostel === "yes"}
                    onChange={handlechange}
                  />
                  <label>Yes</label>
                  <br></br>
                  <input
                    type="radio"
                    name="girlshostel"
                    value="no"
                    checked={formData.girlshostel === "no"}
                    onChange={handlechange}
                  />
                  <label>No</label>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Type of Mess (Veg/NV)</label>
                  {errors.girlsmess && (
                    <p className="hostel_error">{errors.girlsmess}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="girlsmess"
                    value="veg"
                    disabled={formData.girlshostel === "no"}
                    checked={formData.girlsmess === "veg"}
                    onChange={handlechange}
                  />
                  <label>Veg</label>
                  <br></br>
                  <input
                    type="radio"
                    name="girlsmess"
                    value="nonveg"
                    disabled={formData.girlshostel === "no"}
                    checked={formData.girlsmess === "nonveg"}
                    onChange={handlechange}
                  />
                  <label>Non-Veg</label>
                  <br></br>
                  <input
                    type="radio"
                    name="girlsmess"
                    value="Both"
                    disabled={formData.girlshostel === "no"}
                    checked={formData.girlsmess ==="Both"}
                    onChange={handlechange}
                  />
                  <label>Both</label>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Room Rent (in Rs.)</label>
                  {errors.girlsrent && (
                    <p className="hostel_error">{errors.girlsrent}</p>
                  )}
                  <br></br>
                  <input
                    className="hostel_inp"
                    name="girlsrent"
                    value={(formData.girlshostel == "no") ? " " : formData.girlsrent}
                    disabled={formData.girlshostel === "no"}
                    onChange={handlechange}
                     maxLength={5}
                  />
                </div>
              </div>
              <div className="hostel_bod">
                <div className="hostel_content">
                  <label className="hostel_label">Permanent or Rental (Hostel Building)</label>
                  {errors.girlsrental && (
                    <p className="hostel_error">{errors.girlsrental}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="girlsrental"
                    value="permanent"
                    disabled={formData.girlshostel === "no"}
                    checked={formData.girlsrental === "permanent"}
                    onChange={handlechange}
                  />
                  <label>Permanent</label>
                  <br></br>
                  <input
                    type="radio"
                    name="girlsrental"
                    value="Rental"
                    disabled={formData.girlshostel === "no"}
                    checked={formData.girlsrental === "Rental"}
                    onChange={handlechange}
                  />
                  <label>Rental</label>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Mess Bill</label>
                  {errors.girlsmessbill && (
                    <p className="hostel_error">{errors.girlsmessbill}</p>
                  )}
                  {/* {!errors.girlsmessbill && errors.girlsmonth && (
                    <p className="hostel_error">{errors.girlsmonth}</p>
                  )} */}
                  <br></br>
                  <input
                    className="hostel_inp1"
                    name="girlsmessbill"
                    value={(formData.girlshostel == "no") ? " " : formData.girlsmessbill}
                    disabled={formData.girlshostel === "no"}
                    onChange={handlechange}
                    
                  />
                  <select
                    className="hostel_inp2 "
                    style={{ width: "150px" }}
                    name="girlsmonth"
                    value={(formData.girlshostel == "no") ? " " : formData.girlsmonth}
                    disabled={formData.girlshostel === "no"}
                    onChange={handlechange}
                  >
                    <option value="month">Per Month</option>
                    <option value="annum">Per Annum</option>
                  </select>
                </div>
                <div className="hostel_content">
                  <label className="hostel_label">Electricity Charges (in Rs.)</label>
                  {errors.girlseb && <p className="hostel_error">{errors.girlseb}</p>}
                  <br></br>
                  <input
                    className="hostel_inp"
                    name="girlseb"
                    value={(formData.girlshostel == "no") ? " " : formData.girlseb}
                    disabled={formData.girlshostel === "no"}
                    onChange={handlechange}
                     maxLength={6}
                  />
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div className="hostel_table">
            <h3 className="hostel_h3">Other Details</h3>
            <div className="hostel_containe">
              <div className="hostel_bod">
                <div className="hostel_content">
                  <label>Caution Deposit (in Rs.)</label>
                  {errors.deposit && <p className="hostel_error">{errors.deposit}</p>}
                  <br></br>
                  <input
                    className="hostel_inp"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handlechange}
                     maxLength={6}
                  />
                </div>
                <div className="hostel_content">
                  <label>Admission Fees (in Rs.)</label>
                  {errors.fees && <p className="hostel_error">{errors.fees}</p>}
                  <br></br>
                  <input className="hostel_inp" name="fees" value={formData.fees} onChange={handlechange}  maxLength={6}/>
                </div>
                <div className="hostel_content">
                  <label>Min. Transport Charges (in Rs.)</label>
                  {errors.min && <p className="hostel_error">{errors.min}</p>}
                  <br></br>
                  <input
                    className="hostel_inp"
                    type="number"
                    name="min"
                    value={(formData.transport === "no") ? " " : formData.min}
                    onChange={handlechange}
                    disabled={formData.transport === "no"}
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="hostel_bod">
                <div className="hostel_content">
                  <label>Establishment Charge (in Rs.)</label>
                  {errors.charge && <p className="hostel_error">{errors.charge}</p>}
                  <br></br>
                  <input
                    className="hostel_inp"
                    name="charge"
                    value={formData.charge}
                    onChange={handlechange}
                     maxLength={6}
                  />
                </div>
                <div className="hostel_content">
                  <label>Transport Facilities (Y/N)</label>
                  {errors.transport && (
                    <p className="hostel_error">{errors.transport}</p>
                  )}
                  <br></br>
                  <input
                    type="radio"
                    name="transport"
                    value="yes"
                    checked={formData.transport === "yes"}
                    onChange={handlechange}
                  />
                  <label>Yes</label>
                  <br></br>
                  <input
                    type="radio"
                    name="transport"
                    value="no"
                    checked={formData.transport === "no"}
                    onChange={handlechange}
                  />
                  <label>No</label>
                </div>
                <div className="hostel_content">
                  <label>Max. Transport Charges (in Rs.)</label>
                  {errors.max && <p className="hostel_error">{errors.max}</p>}
                  <br></br>
                  <input
                    className="hostel_inp"
                    type="number"
                    name="max"
                    value={(formData.transport == "no") ? " " : formData.max}
                    onChange={handlechange}
                    disabled={formData.transport === "no"}
                     maxLength={6}
                  />
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <div className="hostel_buttons">
            <button id="saveButton" className="hostel_button1">
              Save&Continue
            </button>
            <button id="backButton" className="hostel_button1" onClick={() => { navigate('/home') }}>
              Back
            </button>
          </div>
          {showAlert ?

            (<Alert message={alertMsg} path={path} />) : null
          }
        </form>
      </div>
    </div>

  );
}
export default Hostel;
