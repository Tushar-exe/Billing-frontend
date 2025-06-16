
import React from "react";

import homeImage from '../Assets/homeImage.png';


const HomeComponent = () => {
  return (
    <>
      <div><img
        src={homeImage}
        alt="img not"
        style={{ height: "720px", width: "100%", marginLeft: "40px",marginTop:"20px", }}
      />

      </div>
    </>
  );
};

export default HomeComponent;
