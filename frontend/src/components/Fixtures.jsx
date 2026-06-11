import { useEffect, useState } from "react";
import "./Fixtures.css";
import { getTeamFlag } from "../utils/countryFlags";

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, live, scheduled, finished

  useEffect(() => {
    getFixtures();
  }, []);

  const getFixtures = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/fixtures?date=2026-06-11"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch fixtures");
      }

      const data = await response.json();
      setFixtures(data.events || []);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (fixture) => {
    if (fixture.strStatus === "Live" || fixture.strProgress?.includes("'")) {
      return { text: "LIVE", type: "live" };
    }
    if (
      fixture.strStatus === "Half Time" ||
      fixture.strStatus === "Halftime"
    ) {
      return { text: "HT", type: "halftime" };
    }
    if (fixture.strStatus === "Full Time" || fixture.strStatus === "Finished") {
      return { text: "FT", type: "finished" };
    }
    return { text: "SCHEDULED", type: "scheduled" };
  };

  const filteredFixtures = fixtures.filter((fixture) => {
    if (filterStatus === "all") return true;
    const status = getStatusBadge(fixture);
    return status.type === filterStatus;
  });

  if (loading) {
    return (
      <div className="fixtures-container">
        <div className="page-header">
          <h1>📅 World Cup Fixtures</h1>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixtures-container">
        <div className="page-header">
          <h1>📅 World Cup Fixtures</h1>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixtures-container">
      <div className="page-header">
        <h1>📅 World Cup Fixtures</h1>
        <p className="header-subtitle">
          {filteredFixtures.length} match
          {filteredFixtures.length !== 1 ? "es" : ""} found
        </p>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All ({fixtures.length})
        </button>
        <button
          className={`filter-tab ${filterStatus === "live" ? "active" : ""}`}
          onClick={() => setFilterStatus("live")}
        >
          Live (
          {
            fixtures.filter(
              (f) =>
                f.strStatus === "Live" ||
                f.strProgress?.includes("'")
            ).length
          }
          )
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "scheduled" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("scheduled")}
        >
          Scheduled (
          {
            fixtures.filter(
              (f) =>
                f.strStatus !== "Live" &&
                f.strStatus !== "Half Time" &&
                f.strStatus !== "Full Time" &&
                f.strStatus !== "Finished"
            ).length
          }
          )
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "finished" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("finished")}
        >
          Finished (
          {
            fixtures.filter(
              (f) =>
                f.strStatus === "Full Time" || f.strStatus === "Finished"
            ).length
          }
          )
        </button>
      </div>

      {filteredFixtures.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <p>No fixtures in this category.</p>
        </div>
      ) : (
        <div className="fixtures-grid">
          {filteredFixtures.map((fixture) => {
            const status = getStatusBadge(fixture);
            return (
              <div
                className={`fixture-card ${status.type}`}
                key={fixture.idEvent}
              >
                <div className="fixture-header">
                  <div className="status-badge" data-status={status.type}>
                    {status.text}
                  </div>
                  {fixture.strProgress && (
                    <div className="match-minute">
                      {fixture.strProgress}
                    </div>
                  )}
                </div>

                <div className="fixture-match">
                  <div className="fixture-team home">
                    <span className="team-flag">
                      {getTeamFlag(fixture.strHomeTeam)}
                    </span>
                    <div className="team-details">
                      <span className="team-name">
                        {fixture.strHomeTeam}
                      </span>
                      <span className="team-code">
                        {fixture.strHomeTeam?.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="fixture-score">
                    <div className="score-display">
                      <span className="score-home">
                        {fixture.intHomeScore ?? "-"}
                      </span>
                      <span className="score-separator">-</span>
                      <span className="score-away">
                        {fixture.intAwayScore ?? "-"}
                      </span>
                    </div>
                    <div className="match-info">
                      <p className="match-date">
                        {fixture.dateEvent}
                      </p>
                      <p className="match-time">
                        {fixture.strTime || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="fixture-team away">
                    <div className="team-details">
                      <span className="team-name">
                        {fixture.strAwayTeam}
                      </span>
                      <span className="team-code">
                        {fixture.strAwayTeam?.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <span className="team-flag">
                      {getTeamFlag(fixture.strAwayTeam)}
                    </span>
                  </div>
                </div>

                <div className="fixture-footer">
                  <div className="stadium-info">
                    <span className="icon">🏟️</span>
                    <span className="stadium">
                      {fixture.strVenue || "TBA"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Fixtures;