import React, { useEffect, useState } from 'react'
import axios from 'axios';

function ViewNotes(props) {
  const [article] = useState(props.article);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    });
  
  }, []);

  function noteMapping(note){

    let noteName = "";

    {userData.map(user=>{
      if(user.email === note.email){
        noteName = user.fname + " " + user.lname;

      }
    })}

    return(
      <div className="left float-child" key={article.notes.indexOf(note)}>
        <h6>{noteName}</h6>
        <p>{note.note}</p>
      </div>
    );

  }

  return (
    <div className='float-container'>{article.notes.map(noteMapping)}</div>
  )
}

export default ViewNotes

