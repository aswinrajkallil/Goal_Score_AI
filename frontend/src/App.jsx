import { Routes, Route } from "react-router-dom";

import Chat from "./components/Chat";
import Home from "./components/Home";
import Fixtures from "./components/Fixtures";
import Standings from "./components/Standings";
import Navbar from "./components/NavBar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;