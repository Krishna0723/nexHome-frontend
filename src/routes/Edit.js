import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function Edit() {
  const { currentUser } = useSelector((state) => state.user);

  const [name, setName] = useState(`${currentUser.name}`);
  const [email, setEmail] = useState(`${currentUser.email}`);
  const [phonenumber, setPhonenumber] = useState(`${currentUser.phonenumber}`);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function save() {
    dispatch(updateUserStart());
    console.log(name);
    console.log(email);
    console.log(phonenumber);

    const data = {
      name: name,
      email: email,
      phonenumber: phonenumber,
    };

    console.log("Data : " + data);
    Axios.patch(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/edit/${currentUser._id}`,
      data
    ).then(async (res) => {
      if (res.status === 200) {
        document.getElementById(
          "alert"
        ).innerHTML = `<p class="alert alert-success">Successfully modified</p>`;
        dispatch(updateUserSuccess(res.data.user));
        setTimeout(() => {
          // window.location.reload();
          navigate("/profile");
        }, 2000);
      } else {
        dispatch(updateUserFailure());
        // alert("Not Sucess");
        document.getElementById(
          "alert"
        ).innerHTML = `<p class="alert alert-danger">Something happend Try to change once again</p>`;
      }
    });
  }

  return (
    <div style={{ paddingTop: "100px" }}>
      <NavBar />
      <div className="profile-menu">
        <h1>Edit</h1>
        <div>
          <img
            src="../../Images/edit.jpg"
            alt="ad"
            className="profile-user-img"
          />
          {/* <h1>Profile</h1> */}
        </div>
        <div>
          <label>Name</label>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            value={name}
          />
        </div>

        <div style={{ paddingTop: "10px" }}>
          <label>Email</label>

          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            value={email}
          />
        </div>
        <div style={{ paddingTop: "10px" }}>
          <label>Phonenumber</label>
          <input
            onChange={(e) => {
              setPhonenumber(e.target.value);
            }}
            type="number"
            value={phonenumber}
          />
        </div>
        <div className="p-4">
          <button onClick={save} type="button" className="btn btn-success ">
            Save changes
          </button>
        </div>
        <div
          id="alert"
          style={{ paddingTop: "10px", marginLeft: "40px" }}
        ></div>
      </div>
    </div>
  );
}

export default Edit;
