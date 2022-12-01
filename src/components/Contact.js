import React from "react";
import "../components/Contact.css";
import { phoneTypes } from "./constants";
import { useState, useEffect } from "react";
import databaseManager from "./db/dbManager";
import localStorageManager from "./db/localStorageManager";
import { useNavigate } from "react-router-dom";

export const Contact = (props) => {
  const [details, setDetails] = useState({});
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    const cnt = {};
    const id = details.id || Number(new Date());
    cnt.id = id;
    cnt.name = e.target[0].value;
    cnt.phone = e.target[1].value;
    cnt.phoneType = e.target[2].value;
    cnt.isWhatsapp = e.target[3].checked;
    //upload file in databse. and get the store.
    const file = e.target[5].files?.[0] || details.src;
    const filePayload = { id, file };
    if (file && !details.src) {
      databaseManager.UIResources.addRecords("details", [filePayload]);
    } else {
      databaseManager.UIResources.updateRecord("details", filePayload);
    }

    cnt.profilePhoto = id;
    cnt.src = file;
    if (details.id) {
      localStorageManager.updateContacts(cnt);
    } else {
      localStorageManager.saveToLocalStorage(cnt);
    }
    setDetails(cnt);
    navigate("/");
    e.preventDefault();
  };

  useEffect(() => {
    if (props.details) {
      setDetails(props.details);
    }
  }, [props.details]);

  return (
    <>
      <fieldset>
        <legend>Contact Page</legend>
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name.."
              defaultValue={details.name}
              required
            ></input>
            <label htmlFor="phone">phone number</label>
            <input
              placeholder="Your phone..."
              type="tel"
              id="phone"
              name="phone"
              required
              defaultValue={details.phone}
            ></input>
            <label htmlFor="phoneType">Phone Type</label>
            <select
              id="phoneType"
              name="phoneType"
              defaultValue={details.phoneType}
            >
              {Object.keys(phoneTypes).map((key) => {
                return (
                  <option key={key} value={key}>
                    {phoneTypes[key]}
                  </option>
                );
              })}
            </select>
            <label htmlFor="isWhatsapp">Is Whatsapp</label>
            <div className="radio">
              <input
                defaultChecked={details.isWhatsapp}
                id="whatsapp_yes"
                name="isWhatsapp"
                type="radio"
              />
              Yes
              <input
                defaultChecked={!details.isWhatsapp}
                name="isWhatsapp"
                type="radio"
              />
              No
            </div>
            <label htmlFor="profilePic">Profile Picture</label>
            <div>
              <input
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={(evt) =>
                  setDetails((d) => ({ ...d, src: evt.target.files[0] }))
                }
                required={!details.src}
                type="file"
              />
              {details.src && (
                <img
                  className="profile-img"
                  src={URL.createObjectURL(details.src)}
                  alt="Profile pic"
                />
              )}
            </div>
            <button type="submit" value="Submit" className="button">
              Submit
            </button>
          </form>
        </div>
      </fieldset>
    </>
  );
};
