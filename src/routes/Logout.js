import React, { useEffect } from "react";
import NavBar from "../components/NavBar";

function Logout() {
  useEffect(() => {
    window.location.reload(true);
  });

  return (
    <div
      style={{ paddingTop: "100px", marginLeft: "auto", marginRight: "auto" }}
    >
      <NavBar />
      <div>
        <p style={{ fontSize: "100px" }}>You are successfully logged out</p>
      </div>
    </div>
  );
}

export default Logout;
