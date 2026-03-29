import {React,useEffect,useState} from 'react';
import Logo from '../Assets/tnlogo.png'
import Logout from '../Assets/logout.png'
import './Styles/Header.css'
import axios from 'axios';
import { backend_path } from '../Constants/backend';
// import Alert from './Alert';

function Header() {

    useEffect(()=>{
        // if(window.location.href=="/l")
    },[])

    const handleLogout = async () =>{
        const res= await axios.post(`${backend_path}/logout`,{})
        
        if(res.data.success){
            window.location.href="/logout"  
        }
    }

    return (
        <div className='header_container'>
            <img src={Logo} className='header_logo'  alt="" />
            <div>
                <h3 className='header_heading' style={{fontSize:'large'}}>TAMILNADU ENGINEERING ADMISSIONS 2025</h3>
                <h3 className='header_heading'>தமிழ்நாடு பொறியியல் சேர்க்கை 2025</h3>
            </div>
            <div className='header_logout' onClick={handleLogout}>
             <img src={Logout} className='header_login' alt="logout" />
             <p className='logout_text'>Logout</p>
            </div>
            </div>
        );
}

export default Header;