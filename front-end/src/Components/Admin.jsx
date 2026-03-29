import axios from "axios";
import React, { useEffect, useState } from "react";
import { backend_path } from "../Constants/backend";
import Alert from "./Alert";


const Admin = () => {

  const [ccode, setCcode] = useState('')
  const [clgData,setClgData] = useState([])
  const [isLoading,setIsLoading]=useState(false)
  const [isBookletLoading,setIsBookletLoading]=useState(false)
  const [pdfUrl,setPdfUrl]=useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')
  const [path, setPath] = useState('')


  useEffect(()=>{
     async function fetchData() {
        const res=await axios.post(`${backend_path}/admin_clg_data`,{})
        if(res.data.status=="Fail"){
          setAlertMsg(res.data.message)
          setPath("/")
          setShowAlert(true);
        }
        setClgData(res.data.clg_data)
      }
      fetchData();
    }
  ,[])

  const handleDownloadPdf = async (cc) => {
    // console.log(clgData);
    setIsLoading(true)
    alert("in handle download pdf")
    await axios.post(`${backend_path}/admin_generate_pdf`,{c_code:cc}, { responseType: 'blob' })
    .then((res) => {
        // const pdfBlob = ,{type:"application/pdf"})
        const pdfurl = window.URL.createObjectURL(new Blob([res.data]))
        const link=document.createElement('a')
        link.href=pdfurl;
        // link.setAttribute('download','booklet.pdf')
        link.download="booklet.pdf"
        document.body.appendChild(link)
        link.click();
        window.URL.revokeObjectURL(pdfUrl)
        setPdfUrl(pdfUrl)
      })
      .catch((err)=>{
        console.error("error fetching pdf",err);
        
      })
    setIsLoading(false)

  }

  const handleDownloadBooklet = async (cc) => {
    setIsBookletLoading(true)
    alert("in handle download pdf")
    await axios.post(`${backend_path}/admin_booklet`,{}, { responseType: 'blob' })
    .then((res) => {
        // const pdfBlob = ,{type:"application/pdf"})
        const pdfurl = window.URL.createObjectURL(new Blob([res.data]))
        const link=document.createElement('a')
        link.href=pdfurl;
        // link.setAttribute('download','booklet.pdf')
        link.download="booklet.pdf"
        document.body.appendChild(link)
        link.click();
        window.URL.revokeObjectURL(pdfUrl)
        setPdfUrl(pdfUrl)
      })
      .catch((err)=>{
        console.error("error fetching pdf",err);
        
      })
      setIsBookletLoading(false)

  }

  const handleunfreeze = async () => {
    try {
      const res = await axios.post(`${backend_path}/unfreeze`, { c_code: ccode })

      if (res.data.status == "success") {
        alert(`${ccode} was set to unfreezed state`)
      } else {
        alert("not ok")
      }
    } catch (err) {
      console.error(err);
    }
  }
 const handlesubmit= async (e)=>{
  e.preventDefault();

  // console.log("hjh");
  try {
    const res = await axios.post(`${backend_path}/submitcol`, { c_code: ccode })
    // console.log(res.data.clg_data)
    setClgData(res.data.clg_data)


  } catch (err) {
    console.error(err);
  }
 }

  return (
    <div className="admin_container">
      <div className="admin_form_container">
        <form onSubmit={handlesubmit}>
          <label htmlFor="college code">College code</label>
          <input type="text" name="c_code" onChange={(e) => { setCcode(e.target.value) }} />
          <button type="submit">Submit</button>
          <button onClick={handleunfreeze }>Unfreeze</button>
        </form>
      </div>
      <div className='Home-Branchdetails'>
        {/* <div className='home-branch-details-tittle'>
              <h1 >Branch Details</h1>
              {isfrozen == 0 ? (
                <button onClick={edit_branch}>Edit</button>) : null
              }
            </div> */}

        <table>
          <thead>
            <tr>
              <th>College Code</th>
              <th>collegename</th>
              <th>Booklet PDF</th>
            </tr>
          </thead>
          <tbody>
            {
              clgData.map((item,index)=>{
                return(
                  <tr  key={index}>
                    <td>{item.collegecode}</td>
                    <td className='branch-name-align admin_clg_name'>{item.collegename}</td>
                    {
                      !isLoading ?(
                        <button className="admin_download_pdf" onClick={()=>{handleDownloadPdf(item.collegecode)}}>Download PDF</button>
                      ):(
                        <p>Loading</p>
                      )
                    }
                  </tr>
                )
              })
            }
          </tbody>

        </table>

            {
              !isBookletLoading ?(
                <button onClick={handleDownloadBooklet}>Download Booklet</button>
              ):(
                <p>Loading</p>
              )
            }
        { showAlert ?
          (<Alert message={alertMsg} path={path} />) : null
        }

      </div>
    </div>


  )
}

export default Admin;