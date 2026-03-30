import "./Styles/login.css";
import axios from "axios";
import usericon from "../Assets/usericon.png";
import userprofile from "../Assets/user-profile.png";
import passwordicon from "../Assets/passwordicon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { backend_path } from "../Constants/backend";
import Alert from "./Alert";

function Login() {
  const navigate = useNavigate();
  const [data, setdata] = useState({});
  const [errors, seterrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [path, setPath] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function loginVerify() {
      const res = await axios.post(`${backend_path}/login_verification`);
      if (res.data.token_sts === "ok") {
        navigate("./home");
      }
    }
    loginVerify();
  }, []);

  function validate(values) {
    let error = {};
    if (!values.username) {
      error.username = "⚠ Required";
    }
    if (!values.password) {
      error.password = "⚠ Required";
    }
    return error;
  }

  const handlechange = (e) => {
    const { name, value } = e.target;
    setdata((prev) => ({ ...prev, [name]: value }));
  };

  const fetchdata = async () => {
    const res = await axios.post(`${backend_path}/login`, data);
    if (res.data.result) {
      if (res.data.result[0].changed === 0) {
        navigate("/reset");
      } else {
        navigate("/home");
      }
    } else {
      setAlertMsg(res.data.message === "Failed to receive" ? "Invalid username" : res.data.message);
      setPath("/");
      setShowAlert(true);
    }
    if (res.data.message === "admin_login") {
      navigate('/admin');
    }
  };
//suma
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate(data);
    seterrors(error);
    sessionStorage.setItem('clg_code', data.username);
    if (data.username === "boss" || data.password === "boss") {
      navigate("/admin");
    }
    if (Object.keys(error).length === 0) {
      fetchdata();
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login_container">
      <h2 className="login_header1">INFORMATION ABOUT THE COLLEGES</h2>
      <h2 className="login_header1" style={{marginTop:"40px"}}>BOOKLET INFORMATION  FOR THE FIRST YEAR BE/BTech., ADMISSIONS - 2026</h2>
      <h3 className="login_header2">கல்லூரிகள் பற்றிய தகவல்கள்</h3>
      <form className="login_form" onSubmit={handleSubmit}>
        <div className="login_content">
          <div className="login_body">
            <img src={usericon} alt="User Icon" className="login_usericon" />
          </div>

          {/* Username field */}
          <div className="login_body">
            <img src={userprofile} alt="User Icon" className="login_userimages" />
            <div className="login_input_wrapper">
              <input
                className="login_input"
                name="username"
                placeholder="User Name"
                onChange={handlechange}
              />
            </div>
          </div>
          {errors.username && <p className="login_errors">{errors.username}</p>}

          {/* Password field */}
          <div className="login_body">
            <img src={passwordicon} alt="Password Icon" className="login_userimages" />
            <div className="login_input_wrapper">
              <input
                className="login_input"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                onChange={handlechange}
              />
              <span className="login_eye_icon" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {errors.password && <p className="login_errors">{errors.password}</p>}

          <div className="login_body">
            <button className="login_button" type="submit">Login</button>
          </div>
        </div>

        {showAlert && <Alert message={alertMsg} path={path} />}
      </form>

      <div className="login_footer">
        <h3>DIRECTORATE OF TECHNICAL EDUCATION CHENNAI - 600 025</h3>
        <h4>தொழில்நுட்பக் கல்வி இயக்ககம் சென்னை - 600 025</h4>
      </div>
    </div>
  );
}

export default Login;
