import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contact } from "./Contact";
import databaseManager from "./db/dbManager";
import localStorageManager from "./db/localStorageManager";

export default function EditContacts() {
  const [details, setDetails] = useState();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const det = localStorageManager.getDataFromLocalStorage(Number(id));
    if (!det) return;
    databaseManager.UIResources.getRecord("details", det.id, (data) => {
      det.src = data.file;
      setDetails(det);
    });
  }, [id]);
  if (!details) return <></>;
  return <Contact details={details} />;
}
