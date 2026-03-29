import React from 'react';
import { BrowserRouter, Route, Routes, Switch } from 'react-router-dom'
import Login from './Components/login';
import Reset from './Components/reset';
import Bank from './Components/Bank_details';
import College from './Components/College_details';
import Hostel from './Components/hostel';
import Home from './Components/Home';
import BranchDetails from './Components/BranchDetails'
import AddBranch from './Components/AddBranch'
import NewBranch from './Components/NewBranch'
import EditBranch from './Components/EditBranch'
import Alert from './Components/Alert';
import LogoutAlert from './Components/LogoutAlert';
import SessionTimer from './Components/SessionTimer';
import Header from './Components/Header';
import Admin from './Components/Admin';


function Router() {

  return (
    <BrowserRouter >
      <Header />
      {
        window.location.pathname != '/' ? ( 
              <SessionTimer >
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/logout" element={<LogoutAlert />} />
                  <Route path="/reset" element={<Reset />} />
                  <Route path="/bank_details" element={<Bank />} />
                  <Route path="/college_details" element={<College />} />
                  <Route path="/hostel" element={<Hostel />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/branch_details" element={<BranchDetails />} />
                  <Route path="/branch_details/add_branch" element={<AddBranch />} />
                  <Route path="/branch_details/new_proposed_branch" element={<NewBranch />} />
                  <Route path="/branch_details/edit_branch" element={<EditBranch />} />
                  <Route path='/alert' element={<Alert />} />
                  {/* <Route path='/session_timer' element={<SessionTimer />} /> */}
                  <Route path='/admin' element={<Admin />} />

                </Routes>
              </SessionTimer>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/logout" element={<LogoutAlert />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/bank_details" element={<Bank />} />
              <Route path="/college_details" element={<College />} />
              <Route path="/hostel" element={<Hostel />} />
              <Route path="/home" element={<Home />} />
              <Route path="/branch_details" element={<BranchDetails />} />
              {/* <Route path="/branch_details/add_branch" element={<AddBranch />} /> */}
              <Route path="/branch_details/new_proposed_branch" element={<NewBranch />} />
              <Route path="/branch_details/edit_branch" element={<EditBranch />} />
              <Route path='/alert' element={<Alert />} />
              {/* <Route path='/session_timer' element={<SessionTimer />} /> */}
              <Route path='/admin' element={<Admin />} />
            </Routes>
          )
      }

    </BrowserRouter>
  )

}
export default Router;