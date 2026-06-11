import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Fixtures.css";
import TeamFlag from "./TeamFlag";

function Fixtures({ fixtures = [], loading = true, error = "", refreshFixtures }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFixtureId = location.state?.selectedFixture;
  const [filterStatus, setFilterStatus] = useState("all"); // all, live, scheduled, finished

  // Scroll to selected fixture when loading finishes
  useEffect(() => {
    if (!loading && selectedFixtureId && fixtures.length > 0) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`fixture-${selectedFixtureId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loading, selectedFixtureId, fixtures]);

  const getStatusBadge = (fixture) => {
    const status = fixture.strStatus ? fixture.strStatus.toLowerCase() : "";
    const progress = fixture.strProgress ? fixture.strProgress.toLowerCase() : "";

    if (status === "live" || progress.includes("'")) {
      return { text: "LIVE", type: "live" };
    }
    if (status === "half time" || status === "ht" || status === "halftime") {
      return { text: "HT", type: "halftime" };
    }
    if (status === "full time" || status === "finished" || status === "ft") {
      return { text: "FT", type: "finished" };
    }
    return { text: "SCHEDULED", type: "scheduled" };
  };

  const getFilteredFixtures = () => {
    return fixtures.filter((fixture) => {
      if (filterStatus === "all") return true;
      const status = getStatusBadge(fixture);
      if (filterStatus === "live") return status.type === "live";
      if (filterStatus === "scheduled") return status.type === "scheduled";
      if (filterStatus === "finished") return status.type === "finished" || status.type === "halftime";
      return true;
    });
  };

  const filteredFixtures = getFilteredFixtures();

  const handleAIAction = (fixture, actionType) => {
    let prompt = "";
    if (actionType === "analyze") {
      prompt = `Provide an in-depth tactical analysis and team overview for the World Cup match: ${fixture.strHomeTeam} vs ${fixture.strAwayTeam}.`;
    } else if (actionType === "predict") {
      prompt = `Predict the scoreline and key goalscorers for the World Cup match between ${fixture.strHomeTeam} and ${fixture.strAwayTeam}. Explain your reasoning.`;
    } else if (actionType === "context") {
      prompt = `Explain the tournament context, group stage standings, and qualification implications for the match: ${fixture.strHomeTeam} vs ${fixture.strAwayTeam} in Group ${fixture.strGroup || "N/A"}.`;
    }
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  return (
    <div className="fixtures-container">
      <div className="page-header">
        <h1>📅 World Cup Fixtures</h1>
        <p className="header-subtitle">
          {!loading && !error && (
            `${filteredFixtures.length} match${filteredFixtures.length !== 1 ? "es" : ""} found`
          )}
          {loading && "Loading fixtures database..."}
        </p>
      </div>

      <div className="filter-tabs" role="tablist" aria-label="Filter Match Status">
        <button
          className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
          role="tab"
          aria-selected={filterStatus === "all"}
        >
          All ({fixtures.length})
        </button>
        <button
          className={`filter-tab ${filterStatus === "live" ? "active" : ""}`}
          onClick={() => setFilterStatus("live")}
          role="tab"
          aria-selected={filterStatus === "live"}
        >
          Live (
          {
            fixtures.filter(
              (f) =>
                f.strStatus?.toLowerCase() === "live" ||
                f.strProgress?.includes("'")
            ).length
          }
          )
        </button>
        <button
          className={`filter-tab ${filterStatus === "scheduled" ? "active" : ""}`}
          onClick={() => setFilterStatus("scheduled")}
          role="tab"
          aria-selected={filterStatus === "scheduled"}
        >
          Scheduled (
          {
            fixtures.filter(
              (f) => getStatusBadge(f).type === "scheduled"
            ).length
          }
          )
        </button>
        <button
          className={`filter-tab ${filterStatus === "finished" ? "active" : ""}`}
          onClick={() => setFilterStatus("finished")}
          role="tab"
          aria-selected={filterStatus === "finished"}
        >
          Finished (
          {
            fixtures.filter(
              (f) => {
                const s = getStatusBadge(f);
                return s.type === "finished" || s.type === "halftime";
              }
            ).length
          }
          )
        </button>
      </div>

      {loading ? (
        <div className="fixtures-skeleton-container" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="fixture-skeleton-card skeleton-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="error-card">
          <span className="error-icon">⚠️</span>
          <div className="error-msg-container">
            <h3>Failed to Retrieve Fixtures</h3>
            <p>{error}</p>
          </div>
          <button className="retry-btn" onClick={() => refreshFixtures(false)}>
            🔄 Try Again
          </button>
        </div>
      ) : filteredFixtures.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <p>No fixtures found in this category.</p>
        </div>
      ) : (
        <div className="fixtures-grid">
          {filteredFixtures.map((fixture) => {
            const status = getStatusBadge(fixture);
            const isSelected = fixture.idEvent === selectedFixtureId;
            const homeCode = fixture.strHomeTeam?.substring(0, 3).toUpperCase();
            const awayCode = fixture.strAwayTeam?.substring(0, 3).toUpperCase();
            const displayTime = fixture.strTime ? fixture.strTime.substring(0, 5) : "TBD";

            return (
              <div
                className={`fixture-card ${status.type} ${isSelected ? "highlighted-selected" : ""}`}
                key={fixture.idEvent}
                id={`fixture-${fixture.idEvent}`}
              >
                {/* Event Thumbnail Banner */}
                {fixture.strThumb && (
                  <div className="fixture-thumbnail-container">
                    <img src={fixture.strThumb} alt="" className="fixture-thumbnail" loading="lazy" />
                    <div className="fixture-thumbnail-overlay">
                      <span className="fixture-competition-tag">{fixture.strLeague || "FIFA World Cup"}</span>
                    </div>
                  </div>
                )}

                <div className="fixture-header">
                  <div className="badge-row">
                    <span className="status-badge" data-status={status.type}>
                      {status.text}
                    </span>
                    {fixture.strGroup && (
                      <span className="group-badge">Group {fixture.strGroup}</span>
                    )}
                  </div>
                  {fixture.strProgress && (
                    <div className="match-minute">{fixture.strProgress}</div>
                  )}
                </div>

                <div className="fixture-match">
                  <div className="fixture-team home">
                    <div className="team-flag-badges">
                      <TeamFlag teamName={fixture.strHomeTeam} className="fixture-flag" />
                      {fixture.strHomeTeamBadge && (
                        <img src={fixture.strHomeTeamBadge} alt="" className="team-crest" loading="lazy" />
                      )}
                    </div>
                    <div className="team-details">
                      <span className="team-name">{fixture.strHomeTeam}</span>
                      <span className="team-code">{fixture.strHomeTeam?.substring(0, 3).toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="fixture-score">
                    <div className="score-display">
                      <span className="score-home">{fixture.intHomeScore ?? "-"}</span>
                      <span className="score-separator">-</span>
                      <span className="score-away">{fixture.intAwayScore ?? "-"}</span>
                    </div>
                    <div className="match-info">
                      <p className="match-date">{fixture.dateEvent}</p>
                      <p className="match-time">{fixture.strTime ? fixture.strTime.substring(0, 5) : "TBD"}</p>
                    </div>
                    {/* Mobile-centered compact bar: visible only on small screens */}
                    <div className="fixture-mobile-bar" aria-hidden={!fixture}>
                      <span className="mobile-team-code">{homeCode}</span>
                      <span className="mobile-vs">VS</span>
                      <span className="mobile-team-code">{awayCode}</span>
                      <span className="mobile-time">{displayTime}</span>
                    </div>
                  </div>

                  <div className="fixture-team away">
                    <div className="team-details">
                      <span className="team-name">{fixture.strAwayTeam}</span>
                      <span className="team-code">{fixture.strAwayTeam?.substring(0, 3).toUpperCase()}</span>
                    </div>
                    <div className="team-flag-badges">
                      {fixture.strAwayTeamBadge && (
                        <img src={fixture.strAwayTeamBadge} alt="" className="team-crest" loading="lazy" />
                      )}
                      <TeamFlag teamName={fixture.strAwayTeam} className="fixture-flag" />
                    </div>
                  </div>
                </div>

                <div className="fixture-footer">
                  <div className="stadium-info">
                    <span className="icon">🏟️</span>
                    <span className="stadium">
                      {fixture.strVenue ? fixture.strVenue : "Stadium TBA"}
                      {fixture.strCity && `, ${fixture.strCity}`}
                      {fixture.strCountry && ` (${fixture.strCountry})`}
                    </span>
                  </div>

                  {fixture.strVideo && (
                    <a
                      href={fixture.strVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="highlights-btn"
                      aria-label={`Watch highlights for ${fixture.strHomeTeam} versus ${fixture.strAwayTeam}`}
                    >
                      📺 Highlights
                    </a>
                  )}
                </div>

                {/* AI Analyst Actions */}
                <div className="fixture-ai-command-bar">
                  <button
                    className="fixture-ai-action-btn"
                    onClick={() => handleAIAction(fixture, "analyze")}
                    aria-label="Analyze Match with AI"
                  >
                    📊 Analyze Match
                  </button>
                  <button
                    className="fixture-ai-action-btn"
                    onClick={() => handleAIAction(fixture, "predict")}
                    aria-label="Predict Outcome with AI"
                  >
                    🔮 Predict Outcome
                  </button>
                  <button
                    className="fixture-ai-action-btn"
                    onClick={() => handleAIAction(fixture, "context")}
                    aria-label="Explain Match Context with AI"
                  >
                    🧠 Explain Context
                  </button>
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