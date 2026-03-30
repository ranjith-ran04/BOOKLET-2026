import React from 'react'
import './Styles/Home.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backend_path } from '../Constants/backend';
import Alert from './Alert';
import FreezeAlert from './Freezealert';





const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [data, setdata] = useState([])
  const [pdfUrl, setPdfUrl] = useState(null)

  const [isfrozen, setfreeze] = useState(false)

  const [alertMsg, setAlertMsg] = useState('')
  const [path, setPath] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [branchdata, setbranchdata] = useState([])
  const [propbranchdata, setpropbranchdata] = useState([])
  const [showfAlert, setShowfAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [warningCount, setWarningCount] = useState(0);




  useEffect(() => {

    const fetchdata = async () => {
      const result = await axios.post(`${backend_path}/home`)
      if (result.data.error) {
        // alert("You haven't logged in")
        // navigate("/")
        setAlertMsg("You haven't login")
        setPath("/")
        setShowAlert(true);
        return;
      }

      const c_info = result.data.cinfo
      const branch_info = result.data.branchinfo
      const freezestate = result.data.freeze

      const prop_branch = result.data.proposed_branch
      // // console.log(branch_info.new_intake)
      // // console.log(branch_info.intake)
      // // console.log(branch_info.new_intake)
      // console.log(c_info)
      setdata(c_info)
      setbranchdata(branch_info)
      setfreeze(freezestate == "F")
      setpropbranchdata(prop_branch)




      sessionStorage.setItem("freeze_sts", freezestate)
    };
    fetchdata();
  }, [])

  const handleDownloadPdf = async () => {
    setIsLoading(true)
    await axios.post(`${backend_path}/generate_pdf`, {}, { responseType: 'blob' })
      .then((res) => {
        // const pdfBlob = ,{type:"application/pdf"})
        const pdfurl = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = pdfurl;
        // link.setAttribute('download','booklet.pdf')
        link.download = "booklet.pdf"
        document.body.appendChild(link)
        link.click();
        window.URL.revokeObjectURL(pdfUrl)
        setPdfUrl(pdfUrl)
      })
      .catch((err) => {
        console.error("error fetching pdf", err);

      })
    setIsLoading(false)

  }
  const handleViewPdf = async () => {
    setIsLoading(true)
    await axios.post(`${backend_path}/generate_pdf`, {}, { responseType: 'blob' })
      .then((res) => {
        // const pdfBlob = ,{type:"application/pdf"})
        const pdfurl = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
        window.open(pdfurl, "_blank");
      })
      .catch((err) => {
        console.error("error fetching pdf", err);

      })
    setIsLoading(false)

  }


  const freeze = async () => {


    const newfreezestate = !isfrozen;
    setfreeze(newfreezestate)
    const flag = newfreezestate ? "F" : "UF"

    try {

      await axios.post(`${backend_path}/home/freeze`, { freeze: flag })
        .then(setShowfAlert(false))

    }
    catch (error) {
      // // console.log("updating freeze flag error")

    }



  }
  const handleFreeze = async () => {
    if (warningCount < 2) {
      if (warningCount == 0) {
        setAlertMessage("Click Two Times To Freeze");
      }
      setWarningCount(warningCount + 1);
      if (warningCount == 1) {
        setAlertMessage("Click One Time To Freeze");
      }



    } else {
      await freeze();
    }
  };
  function editcollege_details() {
    navigate('/College_details')

  }
  function edit_bank_details() {
    navigate('/bank_details')

  }
  function edit_hostel() {
    navigate('/hostel')

  }
  function edit_branch() {
    navigate('/branch_details')

  }
  if (showAlert) {
    return <Alert message={alertMsg} path={path} />
  }
  function Cancel() {

    setShowfAlert(false);
    setWarningCount(0)

  }
  function freezein() {
    setShowfAlert(true)
    setAlertMessage("Are You Want Freeze The College?")
  }
  // // console.log("ijhsuiysuyu")
  // // console.log(branchdata.new_intake)
  return (

    <>
      {data.map((item, index) => (
        <div className='Home-page' key={index}>


          <div className='Home-college-info-header'>
            <h1>{item.collegecode}-{item.collegename}</h1>
          </div>


          <div className='Home-page-collegedetails' >


            <div className='home-button-tittle'>
              <h1 >College Details</h1>
              {isfrozen == 0 ? (
                <button onClick={editcollege_details}>Edit</button>) : null
              }



            </div>

            <div className='grid-container-college'>
              <div className='home-part1-collegedetails'>
                <p><strong>Name of the principal/Dean</strong><span>:{item.name}</span></p>
                <p><strong>Taluk</strong><span>:{item.taluk}</span></p>
                <p><strong>Pincode</strong><span>:{item.pincode}</span></p>

              </div >
              <div className='home-part2-collegedetails'>
                <p><strong>DISTRICT</strong><span>:{item.district}</span></p>
                <p><strong>Phone/Fax</strong><span>:{item.phone}</span></p>
                <p><strong>Address</strong><span>:{item.address}</span></p>




              </div >
              <div className='home-part3-collegedetails'>
                <p><strong>Website</strong><span>:{item.website}</span></p>
                <p><strong>Email-ID</strong> <span>:{item.email}</span></p>
                <p><strong>Anti-Ragging Phonenumber</strong> <span>:{item.antiphone}</span></p>


              </div>
              <div className='home-part3-collegedetails'>
                <p><strong>Placement Percentage</strong><span>:{item.placement}%</span></p>

              </div>


              {/* </div> */}
            </div >
          </div>

          <div className='Home-page-Bankdetails'>


            <div className='home-bankdetails-tittle'>
              <h1 >Bank Details</h1>
              {isfrozen == 0 ? (
                <button onClick={edit_bank_details}>Edit</button>) : null
              }
            </div>

            <div className='grid-container-bank'>

              <div className='home-part1-bankdetails'>
                <p><strong>Bank A/c No.</strong> <span>:{item.accno} </span></p>
                <p><strong>Distance from Dist.HQ(in kms)</strong> <span>:{item.distance}</span></p>
                <p><strong>Autonomous status</strong> <span>:{item.autonomo}</span></p>



              </div>
              <div className='home-part2-bankdetails'>
                <p><strong>Distance from Nearest Railway Station(in kms)</strong><span>:{item.rlydistance}</span></p>
                <p><strong>Bank Name</strong><span>:{item.bankname}</span></p>



              </div>
              <div className='home-part3-bankdetails'>

                <p><strong>Minority Status</strong><span>:{item.minority}</span></p>
                <p><strong>Nearest Railway Station</strong><span>:{item.rly}</span></p>

              </div>

            </div>


          </div>
          <div className='Home-page-Bankdetails'>


            <div className='home-bankdetails-tittle'>
              <h1 >Hostel Details</h1>
              {isfrozen == 0 ? (
                <button onClick={edit_hostel}>Edit</button>) : null
              }
            </div>

            <h3 id='hostel-boys'>Hostel Facilities for Boys</h3>
            <div className='grid-container-hostel-boys'>
              <div className='home-part1-bankdetails'>
                <p><strong>Accommodation Available for UG</strong> <span>:{item.accb} </span></p>
                <p><strong>Type of Mess (Veg/NV)</strong><span>:{item.messb}</span></p>



              </div>
              <div className='home-part2-bankdetails'>
                <p><strong>Room Rent (in Rs.)</strong><span>:{item.rentb}</span></p>

                <p><strong>Permanent or Rental (P/R)</strong>
                  <span>:{item.htypeb
                  }</span></p>

              </div>
              <div className="home-part3-bankdetails">
                <p><strong>Mess Bill</strong>
                  <span>:{item.billb}</span></p>
                <p><strong>Electricity Charges (in Rs.)</strong>
                  <span>:{item.elecb}</span></p>


              </div>
            </div>
            <h3><strong>Hostel Facilities for Girls</strong></h3>
            <div className='grid-container-hostel-boys'>
              <div className='home-part1-bankdetails'>
                <p><strong>Accommodation Available for UG</strong> <span>:{item.accg} </span></p>
                <p><strong>Type of Mess (Veg/NV)</strong><span>:{item.messg}</span></p>
              </div>
              <div className="home-part2-bankdetails">
                <p><strong>Room Rent (in Rs.)</strong><span>:{item.rentg}</span></p>
                <p><strong>Permanent or Rental (P/R)</strong>
                  <span>:{item.htypeg
                  }</span></p>
              </div>
              <div className='home-part3-bankdetails'>
                <p><strong>Mess Bill</strong>
                  <span>:{item.billg}</span></p>
                <p><strong>Electricity Charges (in Rs.)</strong>
                  <span>:{item.elecg}</span></p>


              </div>
            </div>
            <h3>Other Details</h3>
            <div className='grid-container-hostel-boys'>
              <div className='home-part1-bankdetails'>
                <p><strong>Caution Deposit (in Rs.)</strong> <span>:{item.caution} </span></p>
                <p><strong>Admission Fees (in Rs.)</strong>
                  <span>:{item.adm}</span></p>


              </div>



              <div className='home-part2-bankdetails'>
                <p><strong>Min. Transport Charges (in Rs.)</strong>
                  <span>:{item.mintrans}</span></p>
                <p><strong>Establishment Charge (in Rs.)</strong>
                  <span>:{item.estab}</span></p>




              </div>
              <div className='home-part3-bankdetails'>
                <p><strong>Max. Transport Charges (in Rs.)</strong>
                  <span>:{item.maxtrans}</span></p>


              </div>

            </div>




          </div>

          <div className='Home-Branchdetails'>
            <div className='home-branch-details-tittle'>
              <h1 >Branch Details</h1>
              {isfrozen == 0 ? (
                <button onClick={edit_branch}>Edit</button>) : null
              }
            </div>

            <table>
              <thead >
                <tr>
                  <th>Course Code</th>
                  <th>Coursename</th>
                  <th>Intake</th>
                  <th>New Intake</th>
                  <th>Start year</th>
                  <th>NBA</th>
                  <th>Validity</th>
                </tr>
              </thead>

              <tbody>
                {branchdata.map((branch) => (
                  <tr key={branch.coursecode}>
                    <td>{branch.coursecode}</td>
                    <td className="branch-name-align">{branch.coursename}</td>

                    <td>{branch.intake}</td>
                    <td>{branch.new_intake ? (branch.new_intake) : (<p>-</p>)}</td>
                    <td>{branch.startyear}</td>
                    <td>{branch.nba}</td>
                    <td>{branch.validity ? (branch.validity) : (<p>-</p>)}</td>
                  </tr>
                ))}
              </tbody>

              {/* Title Row */}



            </table>
            <h3 style={{ margin: "38px 0px 25px 0px" }}>Proposed Branch</h3>
            <table style={{ width: "800px" }}>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Coursename</th>
                  <th colSpan={2}>Intake</th>
                  <th>Remarks</th>

                </tr>
              </thead>

              <tbody>
                {propbranchdata.map((branch) => (
                  <tr key={branch.coursecode}>
                    <td>{branch.coursecode}</td>
                    <td className="branch-name-align">{branch.coursename}</td>
                    <td colSpan={2}>{branch.intake}</td>
                    <td>{branch.remarks}</td>
                  </tr>
                ))}

                {/* {branchdata.map((branch) => (
    branch.new_intake!=null? (
      <tr key={branch.coursecode}>
        <td>{branch.coursecode}</td>
        <td className="branch-name-align">{branch.coursename}</td>
        <td>{branch.intake}</td>
        <td>{branch.new_intake}</td>
        <td>{branch.remarks}</td>
      </tr>
    ) : null
  ))} */}



              </tbody>
            </table>




          </div>



          <div className='button-section'>
            {isfrozen == 0 ? (
              <button className='freeze-button' onClick={freezein}>Freeze</button>) : (<button onClick={handleDownloadPdf} className='download-pdf-button'>Download PDF</button>)
            }
            <button onClick={handleViewPdf} className='view-pdf-button'>View PDF</button>
            {showfAlert && (
              <FreezeAlert
                message={alertMessage}
                onConfirm={handleFreeze}
                onCancel={Cancel}
              />
            )}
          </div>



        </div>


      ))}

    </>
  )
}


export default Home;
