const saveToLocalStorage = (data) => {
  const oldData = getContacts();
  localStorage.setItem("contacts", JSON.stringify([...oldData, data]));
};

const getContacts = () => {
  const data = localStorage.getItem("contacts");
  if (!data) return [];
  return JSON.parse(data);
};

const updateContacts = (toBeSaved) => {
  const data = getContacts();
  const oldIndex = data.findIndex((item) => item.id === toBeSaved.id);
  data[oldIndex] = toBeSaved;
  localStorage.setItem("contacts", JSON.stringify(data));
};

const deleteContact = (id) => {
  const data = getContacts();
  const remaining = data.filter((item) => item.id !== id);
  localStorage.setItem("contacts", JSON.stringify(remaining));
};

const getDataFromLocalStorage = (id) => {
  const data = getContacts();
  return data.find((item) => item.id === id);
};

const localStorageManager = {
  saveToLocalStorage,
  getDataFromLocalStorage,
  updateContacts,
  getContacts,
  deleteContact,
};

export default localStorageManager;
