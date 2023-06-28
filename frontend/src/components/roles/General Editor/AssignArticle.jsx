import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "../../Popup";
import ViewArticle from "../panels/ViewArticle";
import AssignEditor from "./AssignEditor";
import ReAssignEditor from "./ReAssignEditor";

function AssignArticle() {
  const [articleData, setArticleData] = useState([]);
  const [theArticle, setTheArticle] = useState();
  const [viewTrigger, setViewTrigger] = useState(false);
  const [assignTrigger, setAssignTrigger] = useState(false);
  const [reassignTrigger, setReassignTrigger] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:6969/readArticle").then((res) => {
      setArticleData(res.data.articles);
    });
  }, []);

  function assignedMapping(article) {
    if (article.status === "Waiting") {
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
                setTheArticle(article);
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
                setTheArticle(article);
                setAssignTrigger(true);
              }}
            >
              <i className="fa-solid fa-pencil"></i>Assign
            </button>
          </td>
        </tr>
      );
    }
  }

  function unassignedMapping(article) {
    if (!(article.status === "Waiting")) {
      return (
        <tr key={article._id}>
          <td className="first">
            <a href={article.path} target="_blank" rel="noopener noreferrer">
              {article.title.substring(0, 50)}
            </a>
          </td>
          <td className="fieldCat">{article.field}</td>
          <td className="fieldCat">{article.category}</td>
          <td className="dcolbut1">
            <button
              onClick={() => {
                setTheArticle(article);
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
                setTheArticle(article);
                setReassignTrigger(true);
              }}
            >
              <i className="fa-solid fa-pencil"></i>
              ReAssign
            </button>
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="assignArticle">
      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan={5}>Unassigned Articles</th>
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
            <td colSpan={2}></td>
          </tr>
          {articleData.map(assignedMapping)}
        </tbody>
      </table>

      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan="5">Assigned Articles</th>
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
            <td colSpan="2"></td>
          </tr>
          {articleData.map(unassignedMapping)}
        </tbody>
      </table>

      <Popup
        class="viewArticle"
        innerClass="viewArticle-inner"
        trigger={viewTrigger}
        setTrigger={setViewTrigger}
      >
        <ViewArticle article={theArticle} />
      </Popup>

      <Popup
        class="assignEditor"
        innerClass="assignEditor-inner"
        trigger={assignTrigger}
        setTrigger={setAssignTrigger}
      >
        <AssignEditor article={theArticle} />
      </Popup>

      <Popup
        class="assignEditor"
        innerClass="assignEditor-inner"
        trigger={reassignTrigger}
        setTrigger={setReassignTrigger}
      >
        <ReAssignEditor article={theArticle} />
      </Popup>
    </div>
  );
}

export default AssignArticle;