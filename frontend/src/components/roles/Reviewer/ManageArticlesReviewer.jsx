import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import swal from "sweetalert";

import Notes from "../Reviewer/Notes";
import ViewArticle from "../panels/ViewArticle";
import Popup from "../../Popup";

function ManageArticlesReviewer() {
  const [articleData, setArticleData] = useState([]);
  const [article, setArticle] = useState();
  const [noteTrigger, setNoteTrigger] = useState(false);
  const [viewTrigger, setViewTrigger] = useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:6969/readSpecificUser", {
        email: Cookies.get("email")
      })
      .then((res) => {
        setArticleData(res.data.articles);
      });
  }, []);

  function unreviewedMapping(article) {
    function rejectArticle() {
      swal({
        title: "Are you sure?",
        text: `Do you want to reject this article?.\nChanges cannot be undo.`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          swal(`Successfully Rejecting ${article.title}`, {
            icon: "success"
          }).then(() => {
            axios.post("http://localhost:6969/rejectArticle", {
              articleID: article._id,
              category: article.category,
              field: article.field
            });
            window.location.reload();
          });
        }
      });
    }
    if (article.status === "Reviewing") {
      let check = false;

      article.notes.map((each) => {
        if (each.email === Cookies.get("email")) {
          check = true;

        }
      });
      if(!check){
        return (
          <tr key={article._id}>
            <td className="first">
              <a
                href={article.path}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.title.substring(0, 50)}
              </a>
            </td>
            <td>{article.field}</td>
            <td>{article.category}</td>
            <td className="dcolbut1">
              <button
                onClick={() => {
                  setArticle(article);
                  setViewTrigger(true);
                }}
              >
                <i className="fa-solid fa-eye"></i>
                View
              </button>
            </td>
            <td className="dcolbut2">
              <button
                onClick={() => {
                  setArticle(article);
                  setNoteTrigger(true);
                }}
              >
                <i className="fa-solid fa-pencil"></i>Note
              </button>
            </td>
            <td className="dcolbut3">
              <button onClick={rejectArticle}>
                <i className="fa-solid fa-circle-xmark"></i>Reject
              </button>
            </td>
          </tr>
        );
      }
    }
  }

  return (
    <div className="manageArticlesReviewer">
      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan={10}>Unreviewed Articles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Title</strong>
            </td>
            <td>
              <strong>Field</strong>
            </td>
            <td>
              <strong>Category</strong>
            </td>
            <td colSpan={3}></td>
          </tr>
          {articleData.map(unreviewedMapping)}
        </tbody>
      </table>
      <Popup
        class="viewArticle"
        innerClass="viewArticle-inner"
        trigger={viewTrigger}
        setTrigger={setViewTrigger}
      >
        <ViewArticle article={article} />
      </Popup>
      <Popup
        class="setNote"
        innerClass="setNote-inner"
        trigger={noteTrigger}
        setTrigger={setNoteTrigger}
      >
        <Notes article={article} />
      </Popup>
    </div>
  );
}

export default ManageArticlesReviewer;