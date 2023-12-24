import { useRef, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AiOutlineHeart } from "react-icons/ai";
import { ImLocation, ImCross } from "react-icons/im";
import Axios from "axios";
import "./Buy.css";

import emailjs from "emailjs-com";

import { PiBuildingsLight } from "react-icons/pi";
import { useSelector } from "react-redux";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Buy() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [arr, setArr] = useState([]);
  const [shuffledArr, setShuffledArr] = useState([]);
  const [openPopupIndex, setOpenPopupIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [propertyType, setPropertyType] = useState("all");
  const [houseType, setHouseType] = useState("all");
  const [filteredArr, setFilteredArr] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const [post, setPost] = useState(false);

  useEffect(() => {
    // Load filter state from local storage
    // window.location.reload(true);
    const storedFilters = JSON.parse(localStorage.getItem("buyFilters")) || {};

    // Set default values if there are no stored filters
    setSearchTerm(storedFilters.searchTerm || "");
    setPropertyType(storedFilters.propertyType || "all");
    setHouseType(storedFilters.houseType || "all");
    setSortBy(storedFilters.sortBy || "created_at_desc");

    // Fetch data on component mount and set the state
    Axios.get("https://nexhome-backend-uhpg.onrender.com/sell/")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          const sortedData = [...data].sort(
            (a, b) => b.created_at - a.created_at
          );

          // If there are no stored filters, set filteredArr to show all properties
          const initialFilteredArr = storedFilters.searchTerm
            ? sortedData.filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(storedFilters.searchTerm.toLowerCase())
              )
            : sortedData;

          setArr(sortedData);
          setShuffledArr([...sortedData].sort(() => Math.random() - 0.5));
          setFilteredArr(initialFilteredArr);
        } else {
          Promise.reject();
        }
      })
      .catch((err) => alert(err));

    // Reset filters and fetch all properties if the component is mounted for the first time
    if (!Object.keys(storedFilters).length) {
      setSearchTerm("");
      setPropertyType("all");
      setHouseType("all");
      setSortBy("created_at_desc");

      Axios.get("https://nexhome-backend-uhpg.onrender.com/sell/")
        .then((res) => {
          if (res.status === 200) {
            const data = res.data;
            const sortedData = [...data].sort(
              (a, b) => b.created_at - a.created_at
            );

            setArr(sortedData);
            setShuffledArr([...sortedData].sort(() => Math.random() - 0.5));
            setFilteredArr(sortedData);
            setPost(true);
          } else {
            Promise.reject();
          }
        })
        .catch((err) => alert(err));
    }

    // Clear filters in local storage when the component mounts
    localStorage.removeItem("buyFilters");
  }, []);

  const handleOpenClick = (index) => {
    setOpenPopupIndex(index);
  };

  const closePopUp = () => {
    setOpenPopupIndex(null);
  };

  // const form = useRef();

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   emailjs
  //     .sendForm(
  //       "service_6z5ko2s",
  //       "template_lfpox7h",
  //       form.current,
  //       "MLsCDsGiIOgV7-uCk"
  //     )
  //     .then(
  //       (result) => {
  //         console.log(result.text);
  //         document.getElementById(
  //           "response"
  //         ).innerHTML = `<p class="response">Message sent Sucessfully</p>`;
  //       },
  //       (error) => {
  //         console.log(error.text);
  //         document.getElementById(
  //           "response"
  //         ).innerHTML = `<p class="text-successs">${error.text}</p>`;
  //       }
  //     );
  // };

  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState(0);
  const [name, setName] = useState("");

  const form = useRef();

  const handleSubmit = (iemail, iname, iid) => {
    // event.preventDefault();
    return function (e) {
      e.preventDefault();

      console.log(iemail);

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
            console.log(result.text);
            document.getElementById(
              "response"
            ).innerHTML = `<p class="response">Message sent Sucessfully</p>`;
          },
          (error) => {
            console.log(error.text);
          }
        );
    };
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Filter the data based on the current filters
    const filteredData = applyFilters(arr, {
      searchTerm,
      propertyType,
      houseType,
    });

    // Sort the data
    const sortedData = sortData(filteredData, sortBy);

    // Update the state with the filtered and sorted results
    setFilteredArr(sortedData);

    // Save filter state to local storage
    const filtersToSave = {
      searchTerm,
      propertyType,
      houseType,
      sortBy,
    };
    localStorage.setItem("buyFilters", JSON.stringify(filtersToSave));
  };

  const hadleLink = (id) => {
    console.log("Called");
    console.log(`Product id is : ${id}`);
    dispatch(updateUserStart());
    Axios.patch(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/wishlist/${currentUser._id}`,
      {
        id: id,
      }
    ).then(async (res) => {
      if (res.status === 200) {
        // alert(res.data.msg);
        dispatch(updateUserSuccess(res.data.user));
      } else {
        dispatch(updateUserFailure());
      }
    });
  };

  const map = () => {
    return (
      <div className="properties-container">
        <div className="sidebar">
          <form onSubmit={handleFormSubmit}>
            <div className="input-group">
              <label htmlFor="searchTerm">Search</label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search by property name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Type of Purchase</label>
              <div>
                <div>
                  <label>All</label>
                  <input
                    type="checkbox"
                    checked={propertyType === "all"}
                    onChange={() => setPropertyType("all")}
                  />
                </div>
                <div>
                  <label>Buy</label>
                  <input
                    type="checkbox"
                    checked={propertyType === "Sell"}
                    onChange={() => setPropertyType("Sell")}
                  />
                </div>
                <div>
                  <label>Rent</label>
                  <input
                    type="checkbox"
                    checked={propertyType === "Rent"}
                    onChange={() => setPropertyType("Rent")}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Type of Property</label>
                <div>
                  <div>
                    <label>All</label>
                    <input
                      type="checkbox"
                      checked={houseType === "all"}
                      onChange={() => setHouseType("all")}
                    />
                  </div>
                  <div>
                    <label>Flat</label>
                    <input
                      type="checkbox"
                      checked={houseType === "Flat"}
                      onChange={() => setHouseType("Flat")}
                    />
                  </div>
                  <div>
                    <label>Home</label>
                    <input
                      type="checkbox"
                      checked={houseType === "House"}
                      onChange={() => setHouseType("House")}
                    />
                  </div>
                  <div>
                    <label>Shop</label>
                    <input
                      type="checkbox"
                      checked={houseType === "Shop"}
                      onChange={() => setHouseType("Shop")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="input-group">
              <label>Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at_desc">Latest</option>
                <option value="created_at_asc">Oldest</option>
                <option value="cost_desc">Price high to low</option>
                <option value="cost_asc">Price low to high</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="property-list">
          <div className="apartments">
            {post ? (
              filteredArr.map((val, index) => (
                <div className="single" key={index}>
                  <img src={val.linkarr[0]} alt="houseimage" />
                  <div className="single-text">
                    <div className="tags">
                      <div>
                        <p className="tag">{val.Type}</p>
                      </div>
                      <div>
                        <p>
                          {val.to === "Sell" ? (
                            <p className="tag">Buy</p>
                          ) : (
                            <p className="tag">Rent</p>
                          )}
                        </p>
                      </div>
                    </div>
                    <h4 className="property-name">{val.name}</h4>
                    <p className="property-city">
                      <ImLocation />
                      {val.Location}
                    </p>
                    <div className="property-details">
                      <div className="bedrooms">
                        <i className="icon">🛏</i>
                        <span>{val.bedrooms} </span>
                      </div>
                      <div className="bathrooms">
                        <i className="icon">🛁</i>
                        <span>{val.bathrooms} </span>
                      </div>
                    </div>
                    <label className="price">
                      <span className="currency-icon">₹</span>
                      {val.cost}
                    </label>
                    <div className="buyer-tag">
                      <button
                        type="button"
                        className="contact-button"
                        onClick={() => handleOpenClick(index)}
                      >
                        Contact Agent
                      </button>
                      <i className="icon">
                        <AiOutlineHeart
                          onClick={() => {
                            // console.log(val._id);
                            if (currentUser) {
                              hadleLink(val._id);
                            } else {
                              navigate("/login");
                            }
                          }}
                        />
                      </i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="lol">
                {/* <div className="circle"> */}
                <PiBuildingsLight className="circle" />
                {/* </div> */}
              </div>
            )}
          </div>

          {openPopupIndex !== null && (
            <div className="popup">
              <div className="popup-header">
                <div className="popup-images">
                  {filteredArr[openPopupIndex].linkarr.map(
                    (image, imageIndex) => (
                      <img key={imageIndex} src={image} alt={"houseimage"} />
                    )
                  )}
                </div>

                <h4>{filteredArr[openPopupIndex].name}</h4>
                <p>Type: {filteredArr[openPopupIndex].Type}</p>
                <p>Location: {filteredArr[openPopupIndex].Location}</p>
                <p>Bedrooms: {filteredArr[openPopupIndex].bedrooms}</p>
                <p>Bathrooms: {filteredArr[openPopupIndex].bathrooms}</p>
                <p>Cost: ₹{filteredArr[openPopupIndex].cost}</p>

                <form
                  ref={form}
                  onSubmit={handleSubmit(
                    filteredArr[openPopupIndex].mail,
                    filteredArr[openPopupIndex].name,
                    filteredArr[openPopupIndex]._id
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

                    <div id="response"></div>

                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
              <ImCross className="popup-icon" onClick={closePopUp} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      {map()}
    </div>
  );
}

export default Buy;

function sortData(data, sortBy) {
  return [...data].sort((a, b) => {
    const order = sortBy.endsWith("_desc") ? -1 : 1;
    const field = sortBy.split("_")[0];
    if (field === "created_at") {
      return order * (new Date(b[field]) - new Date(a[field]));
    }
    return order * (a[field] - b[field]);
  });
}

function applyFilters(data, filters) {
  const { searchTerm, propertyType, houseType } = filters;
  return data.filter((item) => {
    const itemName = item.name || "";
    const itemType = item.to || "";
    const itemHouseType = item.Type || "";

    return (
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (propertyType === "all" ||
        itemType.toLowerCase() === propertyType.toLowerCase()) &&
      (houseType === "all" ||
        itemHouseType.toLowerCase() === houseType.toLowerCase())
    );
  });
}
