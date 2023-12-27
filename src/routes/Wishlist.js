import React, { useRef, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Axios from "axios";
import { useSelector } from "react-redux";
import { ImCross } from "react-icons/im";
import emailjs from "emailjs-com";

import { PiBuildingsLight } from "react-icons/pi";

import { ImLocation } from "react-icons/im";
import { AiTwotoneDelete } from "react-icons/ai";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { currentUser } = useSelector((state) => state.user);
  const [sold, setSold] = useState([]);
  const [post, setPost] = useState(false);
  const [openPopupIndex, setOpenPopupIndex] = useState(null);

  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState(0);
  const [name, setName] = useState("");

  const form = useRef();

  const handleSubmit = (iemail, iname, iid) => {
    // event.preventDefault();
    return function (e) {
      e.preventDefault();

      // console.log(iemail);

      const data = {
        reply_to: iemail,
        name_to: iname,
        name_from: name,
        textarea: text,
        phoneNumber: number,
        from: email,
      };

      emailjs
        .send(
          "service_6z5ko2s",
          "template_lfpox7h",
          // form.current,
          data,
          "MLsCDsGiIOgV7-uCk"
        )
        .then(
          (result) => {
            // console.log(result.text);

            alert("Message sent sucessfully");
          },
          (error) => {
            // console.log(error.text);
          }
        );
    };
  };

  const dispatch = useDispatch();

  const handleOpenClick = (index) => {
    setOpenPopupIndex(index);
  };

  const closePopUp = () => {
    setOpenPopupIndex(null);
  };

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
                    <button
                      className="contact-button"
                      onClick={() => handleOpenClick(index)}
                    >
                      more info
                    </button>
                    <i className="icon">
                      <AiTwotoneDelete
                        onClick={() => {
                          handleWishDel(item._id);
                        }}
                      />
                    </i>
                  </div>
                </div>

                {openPopupIndex !== null && (
                  <div className="popup">
                    <div className="popup-header">
                      <div className="popup-images">
                        {sold[openPopupIndex].linkarr.map(
                          (image, imageIndex) => (
                            <img
                              key={imageIndex}
                              src={image}
                              alt={"houseimage"}
                            />
                          )
                        )}
                      </div>

                      <h4>{sold[openPopupIndex].name}</h4>
                      <p>Type: {sold[openPopupIndex].Type}</p>
                      <p>Location: {sold[openPopupIndex].Location}</p>
                      <p>Bedrooms: {sold[openPopupIndex].bedrooms}</p>
                      <p>Bathrooms: {sold[openPopupIndex].bathrooms}</p>
                      <p>Cost: ₹{sold[openPopupIndex].cost}</p>

                      <form
                        ref={form}
                        onSubmit={handleSubmit(
                          sold[openPopupIndex].mail,
                          sold[openPopupIndex].name,
                          sold[openPopupIndex]._id
                        )}
                      >
                        <div className="popup-content">
                          <textarea
                            placeholder="Enter your information..."
                            rows="4"
                            name="textarea"
                            onChange={(e) => {
                              setText(e.target.value);
                            }}
                          ></textarea>
                          <input
                            type="number"
                            placeholder="Phone Number"
                            name="phoneNumber"
                            onChange={(e) => {
                              setNumber(e.target.value);
                            }}
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            name="reply_to"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                          <input
                            type="text"
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                            placeholder="Name"
                            name="name"
                          />

                          <p id="response"></p>

                          {/* <button type="submit">Submit</button> */}
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                navigate("/login");
                              }
                            }}
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                    <ImCross className="popup-icon" onClick={closePopUp} />
                  </div>
                )}
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
