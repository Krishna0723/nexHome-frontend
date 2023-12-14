import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Axios from "axios";
import { useSelector } from "react-redux";

import { PiBuildingsLight } from "react-icons/pi";

import { ImLocation } from "react-icons/im";
import { AiTwotoneDelete } from "react-icons/ai";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function Wishlist() {
  const { currentUser } = useSelector((state) => state.user);
  const [sold, setSold] = useState([]);
  const [post, setPost] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    Axios.get(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/getWishList/${currentUser._id}`
    ).then(async (res) => {
      await setSold(res.data);
      await setPost(true);
    });
  });

  function handleWishDel(id) {
    dispatch(updateUserStart());
    Axios.patch(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/delWish/${currentUser._id}`,
      {
        id: id,
      }
    ).then(async (res) => {
      if (res.status === 200) {
        dispatch(updateUserSuccess(res.data));
      } else {
        dispatch(updateUserFailure());
      }
    });
  }

  return (
    <div style={{ paddingTop: "100px" }}>
      <NavBar />
      <div>
        <h1>Wishlist</h1>

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
                      <AiTwotoneDelete
                        onClick={() => {
                          //   console.log(item._id);
                          handleWishDel(item._id);
                        }}
                      />
                    </i>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="lol">
              <PiBuildingsLight className="circle" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;