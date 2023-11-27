import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "./Login.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const array = [email, password];

  let navigate = useNavigate();
  const dispatch = useDispatch();

  function handelClick() {
    console.log("Button Clicked");
    dispatch(signInStart());

    Axios.post("https://nexhome-backend-uhpg.onrender.com/nexHome/login", {
      email,
      password,
    })
      .then((result) => {
        // console.log(result);
        if (result.data.msg === "Sucess") {
          dispatch(signInSuccess(result.data.userData));
          navigate("/");
        } else {
          dispatch(signInFailure(result.data.msg));
          document.getElementById(
            "Alert"
          ).innerHTML = `<p class="alert alert-danger">${result.data.msg}</p>`;
        }
      })
      .catch((error) => {
        dispatch(signInFailure(error.message));
        console.log(error);
      });
  }
  return (
    <div className="body" style={{ paddingTop: "100px" }}>
      <NavBar />
      <div className="Login-page">
        <div className="login-form">
          <form id="loginForm">
            <h2>Login</h2>
            <div id="Alert"></div>
            <label for="email">Email:</label>
            <br />
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              required
            />
            <div id="emailError" className="error-message"></div>
            <label for="password">Password:</label>
            <br />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              required
            />
            <br />
            <button
              onClick={() => {
                console.log(array);
                handelClick();
              }}
              type="button"
              className="btn btn-success"
            >
              Login
            </button>
            <br />
            <p>
              Don't have an account?{" "}
              <Link style={{ color: "#007bff" }} to={"/Signup"}>
                Signup
              </Link>
            </p>
          </form>
        </div>
        <div>
          <img
            src="../../Images/login-img.jpg"
            alt="login-page-img"
            className="login-page-img"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
