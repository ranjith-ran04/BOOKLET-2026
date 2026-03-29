import React from 'react';
import '../Assets/tnlogo.png';
import axios from 'axios';
import './Styles/Bank_details.css'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { backend_path } from '../Constants/backend';
import Back from '../Widgets/Back';

import Submit from '../Widgets/Back';
import Alert from './Alert';
function Bank_details() {
  const navigate = useNavigate()
  const [inputs, setinput] = useState({
    Account_no: "",
    College_distance: "",
    junction_distance: "",
    Bank_name: "",
    near_junction: "",
    autonomous: "",
    minority: ""
  })
  const [error, seterror] = useState({});
  const [submit, setsubmit] = useState(false);
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [path, setPath] = useState('')
  //  const[response,setresponse]=useState({});
  const account_noregex = /^[0-9]{9,18}$/;
  const nameregex =/^[A-Za-z ]+$/;
  const getdata = async () => {

    if(sessionStorage.getItem("freeze_sts")=="F"){
      setAlertMsg("You have already freezed")
      setPath("/home")
      setShowAlert(true);
      return;
    }

    try {


      const res = await axios.post(`${backend_path}/getbankdetails`);
    
      
      if (res.data.error) {
        // alert("You haven't login")
        // navigate("/")
        setAlertMsg("You haven't login")
        setPath("/")
        setShowAlert(true);
        return;
      }
      // console.log(res.data.result[0]);
      
      

      setinput({
        ...inputs,
        Account_no: res.data.result[0].accno || '',
        College_distance: res.data.result[0].distance || '',
        junction_distance: res.data.result[0].rlydistance || '',
        autonomous: res.data.result[0].autonomo || '',
        Bank_name: res.data.result[0].bankname || '',
        near_junction: res.data.result[0].rly || '',
        minority: res.data.result[0].minority || '',

      });

      // alert(res.data.result[0].rly)


    }
    catch (err) {
      // console.log(error)
    }

  }
  useEffect(() => {

    getdata()
  }, [])

  const validate = (e) => {
    const error = {};
    if (!e.Account_no) {
      error.Account_no = "⚠ Account no is required"
    }
    else if (!account_noregex.test(e.Account_no)) {

      error.Account_no = "⚠ Invalid account number "
    }
    if (!e.College_distance) {
      error.College_distance = "⚠ Distance is required";
    }

    else if (isNaN(e.College_distance) || e.College_distance > 99) {
      error.College_distance = "⚠ Invalid Distance";

    }
    if (!e.junction_distance) {
      error.junction_distance = "⚠ Distance is required"
    }
    else if (isNaN(e.junction_distance) || e.junction_distance > 99) {
      error.junction_distance = "⚠ Invalid Distance";

    }


    if (e.autonomous === "") {
      error.autonomous = "⚠ Automonous details is required"
    }
    if (e.minority === "") {
      error.minority = "⚠ Minority details is required"
    }
    if (!e.Bank_name) {
      error.Bank_name = "⚠ Bank name is required"
    }
    else if (!nameregex.test(e.Bank_name)) {
      error.Bank_name = "⚠ Invalid name"
    }
    if (!e.near_junction) {
      error.near_junction = "⚠ Junction name is required"
    }
    else if (!nameregex.test(e.near_junction)) {
      error.near_junction = "⚠ Invalid junction name"

    }
    return error;
  }
  const fetchdata = async () => {
    const res = await axios.post(`${backend_path}/bank_update`, { inputs })
    if (res.data.success == true) {
      setAlertMsg(res.data.message);
      setPath("/home")
      setShowAlert(true)
    }
  }

  const submitchange = (e) => {
    e.preventDefault();
    setsubmit(true);
    const errors = validate(inputs);
    // // console.log(errors)
    seterror(errors);
    // // console.log(errors)
    if (Object.keys(errors).length == 0) {
      fetchdata()

    }



  }
  const handle = (e) => {

    setinput({ ...inputs, [e.target.name]: e.target.value })
    // // console.log(inputs)
    const errors = validate(inputs);
    seterror(errors);
    // // console.log(errors)
  }

  useEffect(() => {
    const submiterror = validate(inputs);
    seterror(submiterror)
  }, [inputs])


  return (
   
      <div>
        <div>

        </div>
        <form onSubmit={submitchange}>
          <div className="college_details">
            <div className="bank_details-border">

              <div className="bank_details-container">
                <div className="bank-details-part1">
                  <div>

                    <label>Bank A/c NO.</label> {submit && error.Account_no && <span className='bank-details-error'>{error.Account_no}</span>}
                    <br></br>
                    <input name="Account_no" value={inputs.Account_no} className='bankdetails-input' onChange={handle}></input>
                   
                  </div>
                  <div>
                    <label>Distance from Dist.HQ(in kms)</label>{submit && error.College_distance && <span className='bank-details-error'>{error.College_distance}</span>}
                    <br></br>
                    <input name="College_distance" value={inputs.College_distance} className='bankdetails-input' onChange={handle}></input>



                  </div>
                  <div>
                    <label>Distance from Nearest Railway Station(in kms)</label> {submit && error.junction_distance && <span className='bank-details-error'>{error.junction_distance}</span>} <br></br>
                    <input name="junction_distance" value={inputs.junction_distance} className='bankdetails-input' onChange={handle}></input>
                  </div>
                  <div>
                    <label>Autonomous Status</label>{submit && error.autonomous && <span className='bank-details-error'>{error.autonomous}</span>}<br></br>
                    <label>Yes</label>
                    <input
                      type="radio"
                      className='bank-details-radio'
                      value="Yes"
                      name="autonomous"
                      checked={inputs.autonomous === "Yes"}
                      onChange={handle}
                    />
                    <label>No</label>
                  
                    <input
                      type="radio"
                      className='bank-details-radio'
                      value="No"
                      name="autonomous"
                      checked={inputs.autonomous === "No"}
                      onChange={handle}
                    />

                  </div>


                </div>
                <div className="bank-details-part2">
                  <div>
                    <label>Bank Name</label>{submit && error.Bank_name && <span className='bank-details-error'>{error.Bank_name}</span>}
                    <br></br>
                    <input name="Bank_name" value={inputs.Bank_name} className='bankdetails-input' onChange={handle}  ></input>
                  </div>


                  <div >
                    <label>Nearest Railway Station</label> {submit && error.near_junction && <span className='bank-details-error'>{error.near_junction}</span>}

                    <br></br>
                    <input name="near_junction" value={inputs.near_junction} className='bankdetails-input' onChange={handle}></input>


                  </div>
                  <div>
                    <label>Minority Status</label>
                    {submit && error.minority && <span className='bank-details-error'>{error.minority}</span>}<br></br>
                    <label>Yes</label>
                    <input className='bank-details-radio' type="radio" value="Yes" checked={inputs.minority === "Yes"} name="minority" onChange={handle}></input>
                    <label>No</label>
                    <input type="radio" className='bank-details-radio' value="No" name="minority" checked={inputs.minority === "No"} onChange={handle}></input>
                   

                  </div>

                </div>
              </div>







            </div>
            <div>
<button className="bank-details-save" type="submit">Save & continue</button>
          <button id="back" onClick={() => { navigate('/Home') }}>Back</button>
          </div>
          
      </div>
      { showAlert ? 
          
          (<Alert message={alertMsg} path={path}/>):null
             }
        </form >

      </div >

    
  )
}
export default Bank_details;
