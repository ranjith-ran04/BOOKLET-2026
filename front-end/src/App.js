import React,{useEffect} from "react";
import { BrowserRouter,useLocation } from "react-router-dom";
import Router from "./Router";
import Header from "./Components/Header";
import axios from "axios";
function App() {
  const location = window.location.pathname;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  axios.defaults.withCredentials = true;
  return (
      <Router/>
  );
}
export default App;
