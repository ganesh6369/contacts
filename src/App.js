import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";
import { Contact } from "./components/Contact";
import EditContacts from "./components/EditContacts";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/add-contact" element={<Contact />}></Route>
          <Route path="/edit-contact/:id" element={<EditContacts />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
