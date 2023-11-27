import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import Axios from "axios";

import { ImLocation } from "react-icons/im";

function Sld() {
  const { currentUser } = useSelector((state) => state.user);
  const [sold, setSold] = useState([]);

  useEffect(() => {
    // console.log(currentUser);
    Axios.get(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/getUser/${currentUser._id}`
    ).then((res) => {
      // console.log(res.data.dat);
      setSold(res.data.dat);
    });
  });

  return (
    <div style={{ paddingTop: "100px" }}>
      <NavBar />
      <div>Sld</div>
      {/* {map()} */}
      <div className="apartments">
        {sold.map((item, index) => (
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
        ))}
      </div>
    </div>
  );
}

export default Sld;
