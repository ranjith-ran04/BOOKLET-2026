import React, { useEffect, useState } from 'react';
import { Link, useAsyncError, useNavigate } from 'react-router-dom';
import './Styles/BranchDetails.css'
import axios from 'axios';
import { backend_path } from '../Constants/backend';
import Alert from './Alert';
import FreezeAlert from './Freezealert';

function BranchDetails() {
    const [showAlert, setShowAlert] = useState(false)
    const [delId, setDelId] = useState(null)
    const [alertMsg, setAlertMsg] = useState('')
    const [path, setPath] = useState('')
    const [data, setData] = useState([]);
    const [propData, setPropData] = useState([]);
    var siNo = 0;
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            if (sessionStorage.getItem("freeze_sts") == "F") {
                setAlertMsg("You have already freezed")
                setPath("/home")
                setShowAlert(true);
                return;
            }
            const res = await axios.post(`${backend_path}/get_branch_details`)
            if (res.data.error) {
                // alert("You haven't login")
                // navigate("/")
                setAlertMsg("You haven't login")
                setPath("/")
                setShowAlert(true);
            }

            if (res.data.success) {
                setData(res.data.result.brn_det)
                // console.log(res.data.result.brn_det)
                setPropData(res.data.result.prop_det)
            } else {
                // console.log(res.data.message);
            }


        }
        fetchData();


    }, [])

    const editRecord = (id) => {
        sessionStorage.setItem("b_code", id);
        navigate("/branch_details/edit_branch/")
    }

    const deleteRecord = async (id) => {

        if (id.length <= 3) {
            const res = await axios.post(`${backend_path}/delete_branch`, { b_code: id })
        }
        else {
            const res = await axios.post(`${backend_path}/delete_new_branch`, { b_code: id })

        }
        window.location.reload();
    }

    const confirmDelete = (id) => {
        // console.log(data);
        // console.log(propData);

        setDelId(id)
    }

    return (
        showAlert ? <Alert message={alertMsg} path={path} /> : (
            <div className='branch_container'>
                <div className='branch_topButtons'>
                    {/* <Link className='branch_navigateBtns' to="/branch_details/add_branch">Add Branch</Link> */}
                    <Link className='branch_navigateBtns' to="/branch_details/new_proposed_branch">New Proposed Branch</Link>
                    <Link className='branch_navigateBtns' to="/home">Back</Link>
                </div>

                <div>
            <h1 className='title_branch_details'> Existing Branch Details</h1>
                <table className='branch_table_1'>
                    <thead>
                        <tr>
                            <th className='branch_btns'></th>
                            <th>No.</th>
                            <th className='branch_short'>Branch Code</th>
                            <th className='branch_large'>Branch Name</th>
                            <th className='branch_intake'>Approved Intake</th>
                            <th className='branch_intake'>Proposed Intake</th>
          
                            <th className='branch_yos'>Year of Starting Course</th>
                            <th className='branch_nba'>Whether NBA Accredited</th>
                            <th className='branch_validity'>Accredited Valid Upto</th>
                            {/* <th className='remarks'>Remarks</th> */}
                            <th className='branch_btns'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => (
                                <tr style={{ marginBottom: "50px" }}>
                                    {/* <td className='branch_editBtn'><Link className='branch_editLink' to={`/branch_details/edit_branch/${item.coursecode !== "-" ? item.coursecode : item.coursename}`}>Edit</Link></td> */}
                                    <td className='branch_editBtn'><p className='branch_editLink' onClick={() => editRecord(item.coursecode !== "-" ? item.coursecode : item.coursename)}>Edit</p></td>
                                    <td className='branch_si_no'>{index + 1}</td>
                                    <td className='branch_short'>{item.coursecode ? item.coursecode : "-"}</td>
                                    <td className='branch_large'>{item.coursename ? item.coursename : "-"}</td>
                                    <td> {item.intake}</td>
                                    <td> {item.new_intake!=null?item.new_intake:'-'}</td>

                                    <td >{item.startyear ? item.startyear : "-"}</td>
                                    <td >{item.nba ? item.nba : "-"}</td>
                                    <td>{item.validity ? item.validity : "-"}</td>
                                    {/* <td>{item.remarks}</td> */}
                                    <td className='branch_deleteBtn'><p className='branch_deleteLink' onClick={() => confirmDelete(item.coursecode !== "-" ? item.coursecode : item.coursename)} >Delete</p></td>
                                </tr>
                            ))

                        }
                    </tbody>
                </table>
                </div>
<div>

                {propData.length !=0 || data.length !=0  ? (
                    <>
                      
                       <div className='branch_table proposed_table'>  
                        <h1 style={{fontSize:"25px",marginBottom:"20px"}}>Proposed Branch</h1> 
                        { <table>
                       
                            <thead>
                                <tr className='proposed_table_head'>
                                    <th className='branch_btns'></th>
                                    <th className='proposed_branch_si_no'>No.</th>
                                    <th className='proposed_branch_short'>Branch Code</th>
                                    <th className='proposed_branch_large'>Branch Name</th>
                                    <th className='proposed_branch_intake'> Proposed Intake </th>
                                    <th className='remarks'>Remarks</th>
                                    <th className='branch_btns'></th>
                                </tr>
                            </thead>




                            <tbody>
                                {
                                    propData.map((item) => (
                                        <tr className='proposed_table_row'>
                                            <td className='proposed_branch_editBtn'>
                                                <p className='proposed_branch_editLink' onClick={() => editRecord(item.coursecode !== "-" ? item.coursecode : item.coursename)}>Edit</p>
                                            </td>
                                            <td className='proposed_branch_si_no_val'>{++siNo}</td>
                                            <td className='proposed_branch_short_val'>{item.coursecode ? item.coursecode : "-"}</td>
                                            <td className='proposed_branch_large_val'>{item.coursename ? item.coursename : "-"}</td>
                                            <td className='proposed_intake_val'>{item.new_intake ? item.new_intake : item.intake}</td>
                                            <td>{item.remarks}</td>
                                            <td className='proposed_branch_deleteBtn'>
                                                <p className='proposed_branch_deleteLink' onClick={() => confirmDelete(item.coursecode !== "-" ? item.coursecode : item.coursename)}>Delete</p>
                                            </td>
                                        </tr>
                                    ))
                                }

                                {
                                    // data.map((branch) =>
                                        // branch.new_intake !== 0 && branch.new_intake !== null ? (
                                        //     <tr key={branch.coursecode}>
                                        //         <td className='proposed_branch_editBtn'>
                                        //             <p className='proposed_branch_editLink' onClick={() => editRecord(branch.coursecode !== "-" ? branch.coursecode : branch.coursename)}>Edit</p>
                                        //         </td>
                                        //         <td className='proposed_branch_si_no_val'>{++siNo}</td>
                                        //         <td>{branch.coursecode}</td>
                                        //         <td className="branch-name-align">{branch.coursename}</td>
                                        //         <td className='proposed_intake_val'>
                                        //          {branch.new_intake} 
                                        //         </td>
                                        //         <td>{branch.remarks}</td>
                                        //         <td>{branch.remarks}</td>
                                        //         <td className='branch_deleteBtn'><p className='branch_deleteLink' onClick={() => confirmDelete(branch.coursecode !== "-" ? branch.coursecode : branch.coursename)} >Delete</p></td>
                                        //     </tr>
                                        // ) : null
                                    // )
                                }
                            </tbody>
                        </table>}
                        </div> 
                    </>

                ):null

                }

</div>


                {delId && (
                    <FreezeAlert message={"Are you want to delete this branch"} onConfirm={() => { deleteRecord(delId) }} onCancel={() => { setDelId(null) }} />
                )
                }
            </div>


        )

    );
}

export default BranchDetails;