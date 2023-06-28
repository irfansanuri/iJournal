import React from "react";

function Popup(props) {

  return props.trigger ? (
    <div className={props.class}>
      <div className={props.innerClass}>
        <button onClick={()=> props.setTrigger(false)} className="close-btn"><i className="fa-solid fa-xmark"></i></button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;