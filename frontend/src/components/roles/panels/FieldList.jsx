import React, { useEffect, useState } from "react";
import ReactPopup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import swal from "sweetalert";
import axios from "axios";

import Popup from "../../Popup";

function FieldList() {
  const [fieldData, setFieldData] = useState([]);
  const [field, setField] = useState("");
  const [category, setCategory] = useState("");

  const [fieldTrigger, setFieldTrigger] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:6969/fieldRead").then((res) => {
      setFieldData(res.data);
    });
  }, []);

  function handleChange(e) {
    e.preventDefault();

    const { name, value } = e.target;
    if (name === "field") {
      setField(value);
    } else if (name === "category") {
      setCategory(value);
    }
  }

  function fieldSubmit(e) {
    e.preventDefault();

    let exist = false;

    fieldData.forEach((each) => {
      if (field === each.name) {
        exist = true;
      }
    });

    if (exist) {
      swal({
        text: "Field already exist",
        icon: "error",
        type: "error"
      });
    } else {
      axios
        .post("http://localhost:6969/fieldCreate", {
          field: field
        })
        .then(() => {
          swal({
            text: `Succesfully added ${field} to the database`,
            icon: "success",
            type: "success"
          }).then(() => {
            window.location.reload();
          });
        });
    }
  }

  function fieldMap(field) {
    function fieldDelete() {
      swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover ${field.name}`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          swal(`${field.name} has been deleted!`, {
            icon: "success"
          }).then(() => {
            axios.post("http://localhost:6969/fieldDelete", {
              field: field.name
            });
            setCategory("");
            setField("");
            window.location.reload();
          });
        }
      });
    }

    function categoryMap(category) {
      function categoryDelete() {
        swal({
          title: "Are you sure?",
          text: `Once deleted, you will not be able to recover ${category.name} from ${field.name}`,
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then((willDelete) => {
          if (willDelete) {
            swal(`${category.name} has been deleted from ${field.name}!`, {
              icon: "success"
            }).then(() => {
              axios.post("http://localhost:6969/categoryDelete", {
                field: field.name,
                category: category.name
              });
              window.location.reload();
            });
          }
        });
        setCategory("");
        setField("");
      }

      return (
        <tr key={category._id} className="category">
          <td className="catcol1">{category.name}</td>
          <td className="catcol2" colSpan="2">
            <button onClick={categoryDelete}>
              <i className="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      );
    }

    function categorySubmit(e) {
      e.preventDefault();

      let exist = false;

      field.categories.forEach((each) => {
        if (each.name === category) {
          exist = true;
        }
      });

      if (exist) {
        swal({
          text: "Category already exist",
          icon: "error",
          type: "error"
        });
      } else {
        swal({
          title: "Are you sure?",
          text: `Add ${category} to ${field.name} ?`,
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then((will) => {
          if (will) {
            swal(`${category} has been added to ${field.name}!`, {
              icon: "success"
            }).then(() => {
              axios.post("http://localhost:6969/categoryCreate", {
                field: field.name,
                category: category
              });
              window.location.reload();
            });
          }
          setCategory("");
          setField("");
        });
      }
    }

    return (
      <div key={field._id}>
        <table className="tableFull shadow-dreamy">
          <thead>
            <tr className="field">
              <th className="fcol1">{field.name}</th>
              <th className="fcol2">
                <ReactPopup
                  trigger={
                    <button>
                      <i className="fa-solid fa-plus"></i> Add
                    </button>
                  }
                  position="center"
                >
                  <div className="addCategoryForm">
                    <form onSubmit={categorySubmit} method="post">
                      <input
                        type="text"
                        autoComplete="off"
                        name="category"
                        value={category}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={`Enter New Category`}
                      />
                      <button>Add</button>
                    </form>
                  </div>
                </ReactPopup>
              </th>
              <th className="fcol3">
                <button onClick={fieldDelete}>
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </th>
            </tr>
          </thead>
          <tbody>{field.categories.map(categoryMap)}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="fieldList">
      <button
        className="addField"
        onClick={() => {
          setFieldTrigger(true);
        }}
      >
        <i className="fa-solid fa-circle-plus"></i>
        Add New Field
      </button>
      <Popup
        class="fieldForm"
        innerClass="fieldForm-inner"
        trigger={fieldTrigger}
        setTrigger={setFieldTrigger}
      >
        <form className="addFieldForm" onSubmit={fieldSubmit} method="post">
          <input
            type="text"
            autoComplete="off"
            name="field"
            value={field}
            onChange={handleChange}
            className="form-control"
            placeholder="Add New Field"
          />

          <button type="submit">Add</button>
        </form>
      </Popup>

      {fieldData.map(fieldMap)}
    </div>
  );
}

export default FieldList;
