import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Home.css";
import { phoneTypes } from "./constants";
import databaseManager from "./db/dbManager";
import localStorageManager from "./db/localStorageManager";

export const Home = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  const updateSrc = (cnt) => {
    if (!cnt.length) return;
    const assignSrc = (i) => {
      var reader = new FileReader();
      databaseManager.UIResources.getRecord(
        "details",
        cnt[i].profilePhoto,
        (data) => {
          const file = data.file;
          // it's onload event and you forgot (parameters)
          reader.onload = function (e) {
            // the result image data
            cnt[i].src = e.target.result;
            setContacts((cn) => {
              if (cn.findIndex((c) => c.id === cnt[i].id) === -1) {
                return [...cn, cnt[i]];
              }
              return [...cn];
            });
            if (i < cnt.length - 1) {
              assignSrc(i + 1);
            }
          };
          // you have to declare the file loading
          reader.readAsDataURL(file);
        }
      );
    };
    assignSrc(0);
  };

  useEffect(() => {
    let cnt = localStorageManager.getContacts();
    cnt = cnt.sort((a, b) => (a.name < b.name ? -1 : 1));
    updateSrc(cnt);
  }, []);

  const editDetails = (id) => {
    navigate("/edit-contact/" + id);
  };

  const deleteDetails = (id) => {
    const confirmed = window.confirm("Do you want to delete?");
    if (confirmed) {
      localStorageManager.deleteContact(id);
      window.location.reload();
    }
  };

  return (
    <>
      <div className="">
        <h3>Contacts</h3>
        <table className="customers">
          <tr>
            <th>name</th>
            <th>phone number</th>
            <th>Phone Type</th>
            <th>Is Whatsapp</th>
            <th>Profile Picture</th>
            <th>Action</th>
          </tr>
          {!contacts.length && (
            <tr>
              <td style={{ textAlign: "center" }} colSpan={6}>
                No Contacts...
              </td>
            </tr>
          )}
          {contacts.map((cnt) => {
            return (
              <tr>
                <td>{cnt.name}</td>
                <td>{cnt.phone}</td>
                <td>{phoneTypes[cnt.phoneType]}</td>
                <td>{cnt.isWhatsapp ? "Yes" : "No"}</td>
                <td>
                  <img
                    className="table-image"
                    src={cnt.src}
                    alt="profile pic"
                  ></img>
                </td>
                <td>
                  <button onClick={() => editDetails(cnt.id)}>Edit</button>
                  <button onClick={() => deleteDetails(cnt.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};
