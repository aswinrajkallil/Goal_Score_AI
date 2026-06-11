import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getTeamFlag } from "../utils/countryFlags";

function Home() {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/fixtures?date=2026-06-11"
      );

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
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  const getStatusBadge = (match) => {
    if (match.strStatus === "Live" || match.strProgress?.includes("'")) {
      return "LIVE";
    }
    if (match.strStatus === "Half Time") {
      return "HT";
    }
    if (match.strStatus === "Full Time" || match.strStatus === "Finished") {
      return "FT";
    }
    return match.strStatus || "LIVE";
  };

  return (
    <div className="home-container">
      {/* Live Matches */}
      <section className="section">
        <div className="section-header">
          <h2>🔴 Live Matches</h2>
          <p className="section-subtitle">
            {liveMatches.length > 0
              ? `${liveMatches.length} match${liveMatches.length !== 1 ? "es" : ""} in progress`
              : "No live matches at the moment"}
          </p>
        </div>

        {loading ? (
          <div className="loading-skeleton">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : liveMatches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <p>No live matches right now. Check back soon!</p>
          </div>
        ) : (
          <div className="match-grid">
            {liveMatches.map((match) => (
              <div className="match-card live" key={match.idEvent}>
                <div className="match-header">
                  <span className="match-status-badge live-badge">
                    {getStatusBadge(match)}
                  </span>
                  <span className="match-minute">
                    {match.strProgress || "90+"}
                  </span>
                </div>

                <div className="match-teams">
                  <div className="team">
                    <span className="team-flag">
                      {getTeamFlag(match.strHomeTeam)}
                    </span>
                    <span className="team-name">
                      {match.strHomeTeam}
                    </span>
                  </div>

                  <div className="score-container">
                    <span className="score">
                      {match.intHomeScore ?? "-"}
                    </span>
                    <span className="score-separator">-</span>
                    <span className="score">
                      {match.intAwayScore ?? "-"}
                    </span>
                  </div>

                  <div className="team">
                    <span className="team-name">
                      {match.strAwayTeam}
                    </span>
                    <span className="team-flag">
                      {getTeamFlag(match.strAwayTeam)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Today's Fixtures */}
      <section className="section">
        <div className="section-header">
          <h2>📅 Today's Fixtures</h2>
          <p className="section-subtitle">
            {fixtures.length > 0
              ? `${fixtures.length} fixture${fixtures.length !== 1 ? "s" : ""} scheduled`
              : "No fixtures scheduled"}
          </p>
        </div>

        {loading ? (
          <div className="loading-skeleton">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
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
              >
                <div className="fixture-team">
                  <span className="team-flag">
                    {getTeamFlag(fixture.strHomeTeam)}
                  </span>
                  <span className="team-name">
                    {fixture.strHomeTeam}
                  </span>
                </div>

                <div className="fixture-info">
                  <div className="fixture-time">
                    {fixture.strTime || "TBD"}
                  </div>
                  <div className="fixture-vs">VS</div>
                </div>

                <div className="fixture-team away">
                  <span className="team-name">
                    {fixture.strAwayTeam}
                  </span>
                  <span className="team-flag">
                    {getTeamFlag(fixture.strAwayTeam)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Standings Preview */}
      <section className="section">
        <div className="section-header">
          <h2>📊 Group Standings Preview</h2>
          <p className="section-subtitle">
            Top teams from each group
          </p>
        </div>

        <div className="group-selector">
          {Object.keys(standingsData).map((group) => (
            <button
              key={group}
              className={`group-btn ${
                selectedGroup === group ? "active" : ""
              }`}
              onClick={() => setSelectedGroup(group)}
            >
              Group {group}
            </button>
          ))}
        </div>

        <div className="standings-preview">
          {standingsData[selectedGroup].map((team, index) => (
            <div
              className={`standing-row ${
                index < 2 ? "qualified" : ""
              }`}
              key={team.team}
            >
              <div className="rank">
                <span className="rank-badge">{index + 1}</span>
              </div>
              <div className="team-info">
                <span className="team-flag">
                  {getTeamFlag(team.team)}
                </span>
                <span className="team-name">{team.team}</span>
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
              <span>Qualified for knockout</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Quick Actions */}
      <section className="section">
        <div className="section-header">
          <h2>🤖 Ask GoalScore AI</h2>
          <p className="section-subtitle">
            Quick questions about the World Cup
          </p>
        </div>

        <div className="action-grid">
          {quickActions.map((action) => (
            <button
              className="action-button"
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;