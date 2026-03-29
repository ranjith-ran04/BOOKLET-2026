import "./Styles/reset.css";
import axios from "axios";
import passwordicon from "../Assets/passwordicon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend_path } from "../Constants/backend";
import Alert from "./Alert";

function Reset() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [path, setPath] = useState("/");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    clg_code: sessionStorage.getItem("clg_code"),
    password: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loginVerify() {
      const res = await axios.post(`${backend_path}/login_verification`);
      if (res.data.token_sts === "ok") {
        navigate("../home");
      }
    }
    loginVerify();
  }, [navigate]);

  function validate(values) {
    let error = {};
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*]).{8,}$/.test(
        values.password
      )
    ) {
      error.password = "⚠ Invalid Password";
    }
    return error;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchData = async () => {
    const res = await axios.post(`${backend_path}/resetpassword`, data);
    if (res.data.success === true) {
      setAlertMsg(res.data.message);
      setShowAlert(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      fetchData();
    }
  };

  return (
    <div className="reset_container1">
      <form className="reset_form1" onSubmit={handleSubmit}>
        <div className="reset_content1">
          <h2 className="reset_heading">RESET YOUR PASSWORD</h2>
          <div className="reset_body1">
            <img
              src={passwordicon}
              alt="Password Icon"
              className="reset_userimages1"
            />
            <div className="password-wrapper">
              <input
                className="reset_input1"
                name="password"
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
              />
              <span
                className="reset_eye_icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {errors.password && (
            <p className="reset_errors">{errors.password}</p>
          )}

          <div className="reset_body1">
            <button className="reset_button1" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>

      {showAlert && <Alert message={alertMsg} path={path} />}

      <div className="reset_footer">
        <h3>DIRECTORATE OF TECHNICAL EDUCATION CHENNAI- 600 025</h3>
        <h4>தொழில்நுட்பக் கல்வி இயக்ககம் சென்னை - 600 025</h4>
      </div>
    </div>
  );
}

export default Reset;
