// Add state for each input
// Add a value for each input equal to matching state
// onChange handler for each input
// on did mount, check edit mode
// if edit mode, get data from id and set your states to individual response fields

import React from "react";
import { navigate } from "hookrouter";
import { NavLink } from "react-router-dom";
import axios from "axios";

const UpdateTrack = props => {
  const [pain_input, setPain_input] = React.useState("");
  const [journalDetail_input, setjournalDetail_input] = React.useState("");
  const [symptomInput, setSymptomInput] = React.useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (props.editMode) {
      await axios
        .put(`https://hjournal.herokuapp.com/journal/${props.id}`, {
          symptom: symptomInput,
          pain_rate: pain_input,
          journal_detail: journalDetail_input
        })
        .then(window.location.reload)
        .then(navigate("/home"))
        .then(window.location.reload)
        .catch(error => console.log("put error", error));

      navigate("/home");
    } else {
      await fetch("https://hjournal.herokuapp.com/add-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          symptom: symptomInput,
          pain_rate: pain_input,
          journal_detail: journalDetail_input
        })
      })
        .then(result => result.json())
        .then(setjournalDetail_input(""))
        .then(props.history.push("/home"))
        .catch(err => console.log("form submit", err));
    }
  };

  const handleGetIndividual = id => {
    fetch(`https://hjournal.herokuapp.com/journal/${id}`)
      .then(response => response.json())
      .then(data => {
        setPain_input(data.pain_rate);
        setjournalDetail_input(data.journal_detail);
        setSymptomInput(data.symptom);
      });
  };

  React.useEffect(() => {
    if (props.editMode) {
      handleGetIndividual(props.id);
    }
  }, [props.editMode]);

  return (
    <div className="update-track-container">
      <form onSubmit={handleSubmit}>
        <select
          className="select-list"
          value={symptomInput}
          onChange={e => setSymptomInput(e.target.value)}
        >
          <option defaultValue>Select Symptom...</option>
          <option>Headache</option>
          <option>Abdominal Pain</option>
          <option>Nausea</option>
          <option>Drowsy</option>
          <option>Fatigue</option>
        </select>

        <div>
          <input
            className="manual-input-button"
            placeholder="Other"
            value={symptomInput}
            onChange={e => setSymptomInput(e.target.value)}
          />
        </div>

        <div>
          <select
            className="select-list"
            value={pain_input}
            onChange={e => setPain_input(e.target.value)}
          >
            <option defaultValue>Select Intensity...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </select>
        </div>
        <div>
          <textarea
            className="note-area"
            placeholder="Note any details of your symptoms…"
            value={journalDetail_input}
            onChange={e => setjournalDetail_input(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="common-button">
            {props.editMode ? "Update" : "Submit"}
          </button>
        </div>
        <div>
          <NavLink className="common-button" to="/home">
            Back
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default UpdateTrack;
