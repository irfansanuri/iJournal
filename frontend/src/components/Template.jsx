import React, { useState } from "react";
import Popup from "./Popup";
import ViewArticle from "./roles/panels/ViewArticle";

function Template() {
  const [trigger, setTrigger] = useState(false);

  function popupFunction() {
    setTrigger(true);
  }

  return (
    <div>
      <button onClick={popupFunction}>Click for Popup</button>
      <Popup
        trigger={trigger}
        setTrigger={setTrigger}
        class="viewArticle"
        innerClass="viewArticle-inner"
      >
        <ViewArticle />
      </Popup>
    </div>
  );
}

export default Template;