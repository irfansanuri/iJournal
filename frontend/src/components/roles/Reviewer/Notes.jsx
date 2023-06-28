import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import swal from "sweetalert";

function Note(props) {
  const [note, setNote] = useState("");
  let email = Cookies.get("email");
  const [article] = useState(props.article);

  function handleChange(event) {
    if (event.target.name === "note") {
      setNote(event.target.value);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (note === "") {
      swal({
        title: "Error!",
        text: `Review cannot be empty.`,
        icon: "error"
      });
    } else {
      swal({
        title: "Are you sure?",
        text: `Send this review?.\nChanges cannot be undo.`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          swal(`Successfully Add Review to the article`, {
            icon: "success"
          }).then(() => {
            axios.post("http://localhost:6969/setNote", {
              note: note,
              email: email,
              articleID: article._id,
              category: article.category,
              field: article.field
            });
            window.location.reload();
          });
        }
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="note">Write your review here:</label>
        <br />
        <textarea
          className="form-control"
          onChange={handleChange}
          placeholder="Write your review here."
          name="note"
          value={note}
          rows="15"
          cols="80"
        />
        <br />
        <button className="submitNote">Submit</button>
      </form>
    </div>
  );
}

export default Note;