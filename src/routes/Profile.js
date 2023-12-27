// import React from "react";
// import NavBar from "../components/NavBar";
// import { useSelector } from "react-redux";
// import Axios from "axios";

// function Profile() {
//   const { currentUser } = useSelector((state) => state.user);

//   function handleClick() {
//     Axios.delete(`https://nexhome-backend-uhpg.onrender.com/nexHome/delete/${currentUser._id}`)

//       .then((res) => {
//         if (res.status === 200) {
//           localStorage.clear();
//           alert("Record deleted successfully");
//           window.location.reload(true);
//         } else Promise.reject();
//       })
//       .catch((err) => {
//         alert(err);
//         console.log(err);
//       });
//   }

//   return (
//     <div style={{ paddingTop: "100px" }}>
//       <NavBar />
//       <div>
//         <div>
//           <h1>Profile</h1>
//         </div>
//         <div>
//           <label>Name :</label>
//           <label>{currentUser.name}</label>
//         </div>
//         <div>
//           <label>Email :</label>
//           <label>{currentUser.email}</label>
//         </div>
//         <div>
//           <label>Phone Number :</label>
//           <label>{currentUser.phonenumber}</label>
//         </div>
//         <div>
//           <button type="button" class="btn btn-warning">
//             EditProfile
//           </button>
//         </div>
//         <br></br>
//         <div>
//           <button type="button" onClick={handleClick} class="btn btn-danger">
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

// import React from "react";
// import NavBar from "../components/NavBar";
// import { useSelector } from "react-redux";

// function Profile() {
//   const { currentUser } = useSelector((state) => state.user);
//   return (
//     <div style={{ paddingTop: "100px" }}>
//       <NavBar />
//       <div>
//         <div>
//           <h1>Profile</h1>
//         </div>
//         <div>
//           <label>Name :</label>
//           <label>{currentUser.name}</label>
//         </div>
//         <div>
//           <label>Email :</label>
//           <label>{currentUser.email}</label>
//         </div>
//         <div>
//           <label>Phone Number :</label>
//           <label>{currentUser.phonenumber}</label>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

import React from "react";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import "./Profile.css";
import Axios from "axios";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  // console.log(currentUser.sold);

  const soldData = { soldArray: currentUser.sold };

  function handleClick() {
    Axios.delete(
      `https://nexhome-backend-uhpg.onrender.com/nexHome/delete/${currentUser._id}`
    )

      .then((res) => {
        if (res.status === 200) {
          localStorage.clear();
          alert("Record deleted successfully");
          window.location.reload(true);
        } else Promise.reject();
      })
      .catch((err) => {
        alert(err);
        // console.log(err);
      });
  }

  return (
    <div style={{ paddingTop: "100px" }}>
      <NavBar />
      <div className="profile-menu">
        <div>
          <img
            src="../../Images/profile.png"
            alt="ad"
            className="profile-user-img"
          />
          {/* <h1>Profile</h1> */}
        </div>
        <div>
          <div>
            <label>Name :</label>
            <label>{currentUser.name}</label>
          </div>
          <div>
            <label>Email :</label>
            <label>{currentUser.email}</label>
          </div>
          <div>
            <label>Phone Number :</label>
            <label>{currentUser.phonenumber}</label>
          </div>
        </div>
        <div className="profile-buttons">
          <div>
            <Link to={"/edit"}>
              <button type="button" className="edit-button">
                Edit Profile
              </button>
            </Link>
          </div>
          <div>
            <button
              onClick={handleClick}
              type="button"
              className="delete-button"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
