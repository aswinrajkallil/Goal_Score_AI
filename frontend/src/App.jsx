import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Chat from "./components/Chat";
import Home from "./components/Home";
import Fixtures from "./components/Fixtures";
import Standings from "./components/Standings";
import Navbar from "./components/NavBar";

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFixtures = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${API_URL}/api/fixtures?date=2026-06-11`
      );

      if (!response.ok) {
        throw new Error("Unable to contact sports stats server.");
      }

      const data = await response.json();
      const events = data.events || [];
      setFixtures(events);

      const live = events.filter(
        (event) =>
          event.strStatus?.toLowerCase() === "live" ||
          event.strProgress?.includes("'")
      );
      setLiveMatches(live);
    } catch (err) {
      console.error("Central fetch fixtures error:", err);
      setError("Failed to synchronize match database.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();

    const interval = setInterval(() => {
      fetchFixtures(true); // silent refresh
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar hasLiveMatches={liveMatches.length > 0} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              fixtures={fixtures}
              liveMatches={liveMatches}
              loading={loading}
              error={error}
              refreshFixtures={fetchFixtures}
            />
          }
        />
        <Route
          path="/fixtures"
          element={
            <Fixtures
              fixtures={fixtures}
              loading={loading}
              error={error}
              refreshFixtures={fetchFixtures}
            />
          }
        />
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