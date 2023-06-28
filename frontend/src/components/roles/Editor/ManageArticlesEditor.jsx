import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Popup from "../../Popup";
import AssignReviewer from "./AssignReviewer";
import ViewArticle from "../panels/ViewArticle";
import ViewNotes from "./ViewNotes";
import swal from "sweetalert";

function ManageArticlesEditor() {
  const [articleData, setArticleData] = useState([]);
  const [article, setArticle] = useState();
  const [assignTrigger, setAssignTrigger] = useState(false);
  const [viewTrigger, setViewTrigger] = useState(false);
  const [noteTrigger, setNoteTrigger] = useState(false);

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
    if (article.status === "Editing") {
      return (
        <tr key={article._id}>
          <td className="first">
            <a href={article.path} target="_blank" rel="noopener noreferrer">
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
                setAssignTrigger(true);
              }}
            >
              <i className="fa-solid fa-pencil"></i>Assign
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

  function reviewedMapping(article) {
    function publishArticle() {
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
    function rejectArticle() {
      swal({
        title: "Are you sure?",
        text: `Do you want to publish this article?.\nChanges cannot be undo.`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          swal(`Successfully Publish ${article.title}`, {
            icon: "success"
          }).then(() => {
            axios.post("http://localhost:6969/publishArticle", {
              articleID: article._id,
              category: article.category,
              field: article.field
            });
            window.location.reload();
          });
        }
      });
    }
    if (article.status === "Reviewed") {
      return (
        <tr key={article._id}>
          <td className="first">
            <a href={article.path} target="_blank" rel="noopener noreferrer">
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
              <i className="fa-solid fa-pencil"></i>Notes
            </button>
          </td>
          <td className="dcolbut3">
            <button onClick={rejectArticle}>
              <i class="fa-solid fa-circle-check"></i>Publish
            </button>
          </td>
          <td className="dcolbut4">
            <button onClick={rejectArticle}>
              <i className="fa-solid fa-circle-xmark"></i>Reject
            </button>
          </td>
        </tr>
      );
    }
  }

  function pendingMapping(article) {
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
      return (
        <tr key={article._id}>
          <td className="first">
            <a href={article.path} target="_blank" rel="noopener noreferrer">
              {article.title.substring(0, 50)}
            </a>
          </td>
          <td>{article.field}</td>
          <td>{article.category}</td>
          <td>
            {article.dateline.substring(8, 10)}-
            {article.dateline.substring(5, 7)}-
            {article.dateline.substring(0, 4)}
          </td>
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
              <i className="fa-solid fa-pencil"></i>Notes
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
  return (
    <div className="manageArticlesEditor">
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
      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan={10}>Reviewed Articles</th>
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
            <td colSpan={4}></td>
          </tr>
          {articleData.map(reviewedMapping)}
        </tbody>
      </table>
      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan={10}>Pending</th>
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
            <td>
              <strong>Dateline</strong>
            </td>
            <td colSpan={3}></td>
          </tr>
          {articleData.map(pendingMapping)}
        </tbody>
      </table>
      <Popup
        class="assignReviewer"
        innerClass="assignReviewer-inner"
        trigger={assignTrigger}
        setTrigger={setAssignTrigger}
      >
        <AssignReviewer article={article} />
      </Popup>
      <Popup
        class="viewArticle"
        innerClass="viewArticle-inner"
        trigger={viewTrigger}
        setTrigger={setViewTrigger}
      >
        <ViewArticle article={article} />
      </Popup>
      <Popup
        class="viewNotes"
        innerClass="viewNotes-inner"
        trigger={noteTrigger}
        setTrigger={setNoteTrigger}
      >
        <ViewNotes article={article}/>
      </Popup>
    </div>
  );
}

export default ManageArticlesEditor;
