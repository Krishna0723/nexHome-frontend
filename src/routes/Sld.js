import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import Axios from "axios";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { ImLocation } from "react-icons/im";

function Sld() {
  const { currentUser } = useSelector((state) => state.user);
  const [sold, setSold] = useState([]);
  const [post, setPost] = useState(false);

  useEffect(() => {
    // console.log(currentUser);
    Axios.get(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/getUser/${currentUser._id}`
    ).then(async (res) => {
      // console.log(res.data.dat);
      await setSold(res.data.dat);
      await setPost(true);
    });
  });

  return (
    <div style={{ paddingTop: "100px" }}>
      <NavBar />
      <div>
        <h1>Properties You Sold</h1>
      </div>
      {/* {map()} */}
      <div className="apartments">
        {post ? (
          sold.map((item, index) => (
            <div className="single" key={index}>
              <img src={item.linkarr[0]} alt="Property" />
              <div className="single-text">
                <div>
                  <p className="tag">{item.Type}</p>
                  <p className="tag">{item.to}</p>
                </div>
                <h4 className="property-name">{item.name}</h4>
                <p className="property-city">
                  <ImLocation />
                  {item.city}
                </p>
                <div className="property-details">
                  <div className="bedrooms">
                    <i className="icon">🛏️</i>
                    <span>{item.bedrooms} </span>
                  </div>
                  <div className="bathrooms">
                    <i className="icon">🛁</i>
                    <span>{item.bathrooms} </span>
                  </div>
                </div>
                <label className="price">
                  <span className="currency-icon">₹</span>
                  {item.cost}
                </label>
                <div className="buyer-tag">
                  <button className="contact-button">more info</button>
                  <i className="icon">
                    <AiTwotoneDelete />
                  </i>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </div>
  );
}

export default Sld;
