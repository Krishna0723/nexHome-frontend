import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import Axios from "axios";
import { ImCross } from "react-icons/im";

import { PiBuildingsLight } from "react-icons/pi";

import { ImLocation } from "react-icons/im";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

import { useDispatch } from "react-redux";

function Sld() {
  const { currentUser } = useSelector((state) => state.user);
  const [sold, setSold] = useState([]);
  const [post, setPost] = useState(false);
  const [openPopupIndex, setOpenPopupIndex] = useState(null);

  const dispatch = useDispatch();

  const handleOpenClick = (index) => {
    setOpenPopupIndex(index);
  };

  const closePopUp = () => {
    setOpenPopupIndex(null);
  };

  function handleDelete(id) {
    dispatch(updateUserStart());
    console.log("Deleted");
    console.log(id);

    Axios.post(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/propertyDel/${currentUser._id}`,
      {
        id: id,
      }
    )
      .then(async (res) => {
        if (res.status === 200) {
          dispatch(updateUserSuccess(res.data));
          // window.location.reload();
        } else {
          dispatch(updateUserFailure());
        }
      })
      .then(() => {
        Axios.delete(
          `https://nexhome-backend-uhpg.onrender.com/sell/deletePropert/${id}`
        ).then((res) => {
          if (res.status === 200) {
            // alert("Successful");
            window.location.reload(true);
          }
        });
      });
  }

  useEffect(() => {
    // console.log(currentUser);
    Axios.get(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/getUser/${currentUser._id}`
    ).then(async (res) => {
      // console.log(res.data.dat);
      setSold(res.data.dat);
      setPost(true);
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
                  <button
                    className="contact-button"
                    onClick={() => handleOpenClick(index)}
                  >
                    more info
                  </button>
                  <i className="icon">
                    <AiTwotoneDelete onClick={() => handleDelete(item._id)} />
                  </i>
                </div>
              </div>

              {openPopupIndex !== null && (
                <div className="popup">
                  <div className="popup-header">
                    {/* <h1>Hello this is pop up</h1> */}
                    <div className="popup-images">
                      {sold[openPopupIndex].linkarr.map((image, imageIndex) => (
                        <img key={imageIndex} src={image} alt={"houseimage"} />
                      ))}
                    </div>

                    <h4>{sold[openPopupIndex].name}</h4>
                    <p>Type: {sold[openPopupIndex].Type}</p>
                    <p>Location: {sold[openPopupIndex].Location}</p>
                    <p>Bedrooms: {sold[openPopupIndex].bedrooms}</p>
                    <p>Bathrooms: {sold[openPopupIndex].bathrooms}</p>
                    <p>Cost: ₹{sold[openPopupIndex].cost}</p>
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
  );
}

export default Sld;
