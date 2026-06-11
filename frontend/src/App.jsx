import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Chat from "./components/Chat";
import Home from "./components/Home";
import Fixtures from "./components/Fixtures";
import Standings from "./components/Standings";
import Navbar from "./components/NavBar";

function App() {
  const [chatMessages, setChatMessages] = useState([]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/standings" element={<Standings />} />
        <Route
          path="/chat"
          element={
            <Chat messages={chatMessages} setMessages={setChatMessages} />
          }
        />
      </Routes>
    </>
  );
}

export default App;