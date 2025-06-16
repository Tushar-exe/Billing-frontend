import React from "react";
import reportImage from "../Assets/report.jpg"
import Sidebar from "./Sidebar";

const Report= ()=>{
    return(
        <>
        <div>
            <img src={reportImage} alt="img not"
            style={{ height: "100%", width: "100%" }}></img>
        </div>
        </>
    )
}

export default Report;
