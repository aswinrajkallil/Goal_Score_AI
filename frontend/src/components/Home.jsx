import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import TeamFlag from "./TeamFlag";

function Home() {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("A");

  const standingsData = {
    A: [
      { team: "Netherlands", points: 7 },
      { team: "Senegal", points: 6 },
      { team: "Ecuador", points: 4 },
      { team: "Qatar", points: 0 },
    ],
    B: [
      { team: "England", points: 7 },
      { team: "USA", points: 5 },
      { team: "Iran", points: 3 },
      { team: "Wales", points: 1 },
    ],
    C: [
      { team: "Argentina", points: 9 },
      { team: "Poland", points: 4 },
      { team: "Mexico", points: 4 },
      { team: "Saudi Arabia", points: 3 },
    ],
    D: [
      { team: "France", points: 7 },
      { team: "Australia", points: 6 },
      { team: "Tunisia", points: 4 },
      { team: "Denmark", points: 1 },
    ],
  };

  const quickActions = [
    {
      label: "Today's Fixtures",
      prompt: "What are today's World Cup fixtures?",
      icon: "📅",
    },
    {
      label: "Live Matches",
      prompt: "Show me all live World Cup matches.",
      icon: "🔴",
    },
    {
      label: "Who will qualify?",
      prompt: "Predict which teams are likely to qualify from the group stage.",
      icon: "🏆",
    },
    {
      label: "World Cup Trivia",
      prompt: "Tell me an interesting World Cup fact.",
      icon: "🎯",
    },
  ];

  // Fetch fixtures and filter live ones
  const fetchFixtures = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:5000/api/fixtures?date=2026-06-11"
      );

      if (!response.ok) {
        throw new Error("Unable to contact the sports stats server.");
      }

      const data = await response.json();
      const events = data.events || [];
      setFixtures(events);

      const live = events.filter(
        (event) =>
          event.strStatus === "Live" ||
          event.strProgress?.includes("'")
      );
      setLiveMatches(live);
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
      setError("Failed to synchronize matches. Check your internet connection.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // Initial load and auto-refresh every 60 seconds
  useEffect(() => {
    fetchFixtures();

    const interval = setInterval(() => {
      fetchFixtures(true); // Silent refresh to avoid blinking skeletons
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (prompt) => {
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  const getStatusBadge = (match) => {
    if (match.strStatus === "Live" || match.strProgress?.includes("'")) {
      return "LIVE";
    }
    if (match.strStatus === "Half Time" || match.strStatus === "HT") {
      return "HT";
    }
    if (match.strStatus === "Full Time" || match.strStatus === "Finished" || match.strStatus === "FT") {
      return "FT";
    }
    return match.strStatus || "LIVE";
  };

  return (
    <div className="home-container">
      {/* Live Matches */}
      <section className="section" aria-labelledby="live-heading">
        <div className="section-header">
          <h2 id="live-heading">
            <span className="live-dot-indicator"></span>
            Live Matches
          </h2>
          <p className="section-subtitle">
            {!loading && !error && (
              liveMatches.length > 0
                ? `${liveMatches.length} match${liveMatches.length !== 1 ? "es" : ""} in progress`
                : "No live matches at the moment"
            )}
            {loading && "Checking live match schedules..."}
          </p>
        </div>

        {error ? (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <div className="error-msg-container">
              <h3>Database Connection Offline</h3>
              <p>{error}</p>
            </div>
            <button className="retry-btn" onClick={() => fetchFixtures(false)}>
              🔄 Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="loading-skeleton" aria-hidden="true">
            <div className="skeleton-card skeleton-pulse"></div>
            <div className="skeleton-card skeleton-pulse"></div>
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <p>No live matches right now. Check back soon!</p>
          </div>
        ) : (
          <div className="match-grid">
            {liveMatches.map((match) => (
              <div className="match-card live-card" key={match.idEvent}>
                <div className="match-header">
                  <span className="match-status-badge live-badge">
                    {getStatusBadge(match)}
                  </span>
                  <span className="match-minute">
                    {match.strProgress || "90+"}
                  </span>
                </div>

                <div className="match-teams">
                  <div className="team home-team-row">
                    <TeamFlag teamName={match.strHomeTeam} className="card-flag" />
                    <span className="team-name">{match.strHomeTeam}</span>
                  </div>

                  <div className="score-container">
                    <span className="score">{match.intHomeScore ?? "-"}</span>
                    <span className="score-separator">-</span>
                    <span className="score">{match.intAwayScore ?? "-"}</span>
                  </div>

                  <div className="team away-team-row">
                    <span className="team-name">{match.strAwayTeam}</span>
                    <TeamFlag teamName={match.strAwayTeam} className="card-flag" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Today's Fixtures */}
      <section className="section" aria-labelledby="fixtures-heading">
        <div className="section-header">
          <h2 id="fixtures-heading">📅 Today's Fixtures</h2>
          <p className="section-subtitle">
            {!loading && !error && (
              fixtures.length > 0
                ? `${fixtures.length} fixture${fixtures.length !== 1 ? "s" : ""} scheduled`
                : "No fixtures scheduled"
            )}
            {loading && "Loading fixtures..."}
          </p>
        </div>

        {error ? (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <div className="error-msg-container">
              <h3>Unable to Load Fixtures</h3>
              <p>{error}</p>
            </div>
            <button className="retry-btn" onClick={() => fetchFixtures(false)}>
              🔄 Retry Load
            </button>
          </div>
        ) : loading ? (
          <div className="loading-skeleton list-skeleton" aria-hidden="true">
            <div className="skeleton-bar skeleton-pulse"></div>
            <div className="skeleton-bar skeleton-pulse"></div>
            <div className="skeleton-bar skeleton-pulse"></div>
          </div>
        ) : fixtures.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>No fixtures available for today.</p>
          </div>
        ) : (
          <div className="fixture-list">
            {fixtures.slice(0, 5).map((fixture) => (
              <div
                className="fixture-card"
                key={fixture.idEvent}
                onClick={() =>
                  navigate("/fixtures", {
                    state: { selectedFixture: fixture.idEvent },
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/fixtures", {
                      state: { selectedFixture: fixture.idEvent },
                    });
                  }
                }}
                aria-label={`Fixture: ${fixture.strHomeTeam} versus ${fixture.strAwayTeam}`}
              >
                <div className="fixture-main-row">
                  <div className="fixture-team home">
                    <TeamFlag teamName={fixture.strHomeTeam} className="fixture-flag" />
                    <span className="team-name">{fixture.strHomeTeam}</span>
                  </div>

                  <div className="fixture-info">
                    <div className="fixture-time">
                      {fixture.strTime ? fixture.strTime.substring(0, 5) : "TBD"}
                    </div>
                    <div className="fixture-vs">VS</div>
                  </div>

                  <div className="fixture-team away">
                    <span className="team-name">{fixture.strAwayTeam}</span>
                    <TeamFlag teamName={fixture.strAwayTeam} className="fixture-flag" />
                  </div>
                </div>

                {fixture.strVenue && (
                  <div className="fixture-venue-meta">
                    <span>🏟️ {fixture.strVenue}</span>
                    {fixture.strCity && <span className="venue-city"> ({fixture.strCity})</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Standings Preview */}
      <section className="section" aria-labelledby="standings-heading">
        <div className="section-header">
          <h2 id="standings-heading">📊 Group Standings Preview</h2>
          <p className="section-subtitle">Top teams in Group stage qualifiers</p>
        </div>

        <div className="group-selector" role="tablist" aria-label="Select Standings Group">
          {Object.keys(standingsData).map((group) => (
            <button
              key={group}
              role="tab"
              aria-selected={selectedGroup === group}
              className={`group-btn ${selectedGroup === group ? "active" : ""}`}
              onClick={() => setSelectedGroup(group)}
            >
              Group {group}
            </button>
          ))}
        </div>

        <div className="standings-preview">
          {standingsData[selectedGroup].map((team, index) => (
            <div
              className={`standing-row ${index < 2 ? "qualified" : ""}`}
              key={team.team}
            >
              <div className="rank">
                <span className="rank-badge">{index + 1}</span>
              </div>
              <div className="team-info">
                <TeamFlag teamName={team.team} className="preview-flag" />
                <span className="team-name">{team.team}</span>
                {index < 2 && (
                  <span className="q-badge" aria-label="Qualified for Knockouts">Q</span>
                )}
              </div>
              <div className="points">
                <span className="points-value">{team.points}</span>
                <span className="points-label">pts</span>
              </div>
            </div>
          ))}

          <div className="legend">
            <div className="legend-item qualified">
              <span className="legend-indicator"></span>
              <span>Knockout Stage Qualification (Top 2)</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Quick Actions */}
      <section className="section" aria-labelledby="ai-heading">
        <div className="section-header">
          <h2 id="ai-heading">🤖 Ask GoalScore AI</h2>
          <p className="section-subtitle">Quick intelligence actions about the World Cup</p>
        </div>

        <div className="action-grid">
          {quickActions.map((action) => (
            <button
              className="action-button"
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
              aria-label={`Ask assistant: ${action.label}`}
            >
              <span className="action-icon" aria-hidden="true">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;