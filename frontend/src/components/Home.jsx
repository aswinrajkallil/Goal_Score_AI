import { useNavigate } from "react-router-dom";
import "./Home.css";
import TeamFlag from "./TeamFlag";
import { useState } from "react";

function Home({ fixtures = [], liveMatches = [], loading = true, error = null, refreshFixtures }) {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState("A");

  const standingsData = {
    A: [
      { team: "Netherlands", points: 7, gd: 4 },
      { team: "Senegal", points: 6, gd: 1 },
      { team: "Ecuador", points: 4, gd: 1 },
      { team: "Qatar", points: 0, gd: -6 },
    ],
    B: [
      { team: "England", points: 7, gd: 7 },
      { team: "USA", points: 5, gd: 1 },
      { team: "Iran", points: 3, gd: -3 },
      { team: "Wales", points: 1, gd: -5 },
    ],
    C: [
      { team: "Argentina", points: 9, gd: 3 },
      { team: "Poland", points: 4, gd: 0 },
      { team: "Mexico", points: 4, gd: -1 },
      { team: "Saudi Arabia", points: 3, gd: -2 },
    ],
    D: [
      { team: "France", points: 7, gd: 3 },
      { team: "Australia", points: 6, gd: -1 },
      { team: "Tunisia", points: 4, gd: 0 },
      { team: "Denmark", points: 1, gd: -2 },
    ],
  };

  const quickActions = [
    {
      label: "Today's Fixtures",
      prompt: "What are today's World Cup fixtures and their match significance?",
      icon: "📅",
    },
    {
      label: "Live Match Analysis",
      prompt: "Show me all live World Cup matches and analyze their current momentum.",
      icon: "🔴",
    },
    {
      label: "Qualification Predictions",
      prompt: "Predict which teams are likely to qualify from the group stage of the 2026 World Cup.",
      icon: "🏆",
    },
    {
      label: "World Cup Trivia",
      prompt: "Tell me an interesting and lesser-known World Cup history fact.",
      icon: "🎯",
    },
    {
      label: "Team Insights",
      prompt: "Give me tactical insights on the top performing national teams in this tournament.",
      icon: "📊",
    },
    {
      label: "Match Summaries",
      prompt: "Summarize the key results and talking points from the latest World Cup matchday.",
      icon: "📝",
    },
    {
      label: "Tournament Overview",
      prompt: "Give me a high-level overview of the FIFA World Cup 2026 groups and tournament structure.",
      icon: "🌎",
    },
    {
      label: "Explain Group Scenarios",
      prompt: "Explain how tiebreakers and qualification scenarios work in the World Cup group stage.",
      icon: "🧠",
    },
    {
      label: "Compare Teams",
      prompt: "Compare the historical records and current tactical lineups of Brazil and Argentina.",
      icon: "⚖️",
    },
    {
      label: "Historical World Cup Facts",
      prompt: "Tell me about the most dramatic and iconic finals in FIFA World Cup history.",
      icon: "📜",
    },
  ];

  const handleQuickAction = (prompt) => {
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  const getStatusBadge = (match) => {
    const status = match.strStatus ? match.strStatus.toLowerCase() : "";
    const progress = match.strProgress ? match.strProgress.toLowerCase() : "";

    if (status === "live" || progress.includes("'")) {
      return "LIVE";
    }
    if (status === "half time" || status === "ht") {
      return "HT";
    }
    if (status === "full time" || status === "finished" || status === "ft") {
      return "FT";
    }
    return match.strStatus || "LIVE";
  };

  const getFeaturedMatch = () => {
    if (liveMatches.length > 0) return liveMatches[0];
    if (fixtures.length > 0) return fixtures[0];
    return null;
  };

  const featuredMatch = getFeaturedMatch();

  return (
    <div className="home-container">
      {!loading && !error && featuredMatch && (
        <section className="featured-section" aria-labelledby="featured-heading">
          <div className="featured-header-badge">★ FEATURED MATCH</div>
          <div className="featured-card">
            <div className="featured-meta">
              <span className="featured-league">🏆 {featuredMatch.strLeague || "FIFA World Cup"}</span>
              {featuredMatch.strGroup && (
                <span className="featured-group">Group {featuredMatch.strGroup}</span>
              )}
            </div>

            <div className="featured-match-core">
              <div className="featured-team home">
                <div className="crest-flag-stack">
                  <TeamFlag teamName={featuredMatch.strHomeTeam} className="featured-flag" />
                  {featuredMatch.strHomeTeamBadge && (
                    <img src={featuredMatch.strHomeTeamBadge} alt="" className="featured-crest" />
                  )}
                </div>
                <h3 className="featured-team-name">{featuredMatch.strHomeTeam}</h3>
              </div>

              <div className="featured-center">
                {featuredMatch.strStatus === "NS" ? (
                  <div className="featured-vs-box">
                    <span className="featured-time">
                      {featuredMatch.strTime ? featuredMatch.strTime.substring(0, 5) : "TBD"}
                    </span>
                    <span className="featured-vs">VS</span>
                  </div>
                ) : (
                  <div className="featured-score-box">
                    <span className="featured-score">{featuredMatch.intHomeScore ?? "0"}</span>
                    <span className="featured-score-sep">:</span>
                    <span className="featured-score">{featuredMatch.intAwayScore ?? "0"}</span>
                  </div>
                )}

                <div className="featured-status-label">
                  <span className={`status-badge-indicator ${featuredMatch.strStatus?.toLowerCase() === "live" ? "live" : ""}`}></span>
                  {getStatusBadge(featuredMatch)}
                  {featuredMatch.strProgress && ` (${featuredMatch.strProgress})`}
                </div>
              </div>

              <div className="featured-team away">
                <div className="crest-flag-stack">
                  {featuredMatch.strAwayTeamBadge && (
                    <img src={featuredMatch.strAwayTeamBadge} alt="" className="featured-crest" />
                  )}
                  <TeamFlag teamName={featuredMatch.strAwayTeam} className="featured-flag" />
                </div>
                <h3 className="featured-team-name">{featuredMatch.strAwayTeam}</h3>
              </div>
            </div>

            <div className="featured-footer">
              <div className="featured-venue-info">
                <span>🏟️ {featuredMatch.strVenue || "Stadium TBA"}</span>
                {featuredMatch.strCity && <span>, {featuredMatch.strCity}</span>}
              </div>

              <button
                className="featured-ai-btn"
                onClick={() =>
                  handleQuickAction(
                    `Provide an expert analysis and preview of the match: ${featuredMatch.strHomeTeam} vs ${featuredMatch.strAwayTeam}. Venue: ${featuredMatch.strVenue || "TBA"}. Group: ${featuredMatch.strGroup || "N/A"}.`
                  )
                }
              >
                🤖 GoalScore AI Match Preview
              </button>
            </div>
          </div>
        </section>
      )}

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
            <button className="retry-btn" onClick={() => refreshFixtures(false)}>
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
                    <div className="team-assets">
                      <TeamFlag teamName={match.strHomeTeam} className="card-flag" />
                      {match.strHomeTeamBadge && (
                        <img src={match.strHomeTeamBadge} alt="" className="team-card-crest" />
                      )}
                    </div>
                    <span className="team-name">{match.strHomeTeam}</span>
                  </div>

                  <div className="score-container">
                    <span className="score">{match.intHomeScore ?? "-"}</span>
                    <span className="score-separator">-</span>
                    <span className="score">{match.intAwayScore ?? "-"}</span>
                  </div>

                  <div className="team away-team-row">
                    <span className="team-name">{match.strAwayTeam}</span>
                    <div className="team-assets">
                      {match.strAwayTeamBadge && (
                        <img src={match.strAwayTeamBadge} alt="" className="team-card-crest" />
                      )}
                      <TeamFlag teamName={match.strAwayTeam} className="card-flag" />
                    </div>
                  </div>
                </div>

                <div className="match-card-actions">
                  <button
                    className="match-ai-btn"
                    onClick={() =>
                      handleQuickAction(
                        `Provide a live match momentum analysis for ${match.strHomeTeam} vs ${match.strAwayTeam}. The current score is ${match.intHomeScore ?? "0"}-${match.intAwayScore ?? "0"} in the ${match.strProgress || "N/A"} minute. Who has the momentum and what are the key talking points?`
                      )
                    }
                  >
                    🤖 Live Analyst Feed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="fixtures-heading">
        <div className="section-header">
          <h2>📅 Today's Fixtures</h2>
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
            <button className="retry-btn" onClick={() => refreshFixtures(false)}>
              🔄 Retry Load
            </button>
          </div>
        ) : loading ? (
          <div className="loading-skeleton list-skeleton" aria-hidden="true">
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
                aria-label={`Fixture: ${fixture.strHomeTeam} versus ${fixture.strAwayTeam}`}
              >
                <div className="fixture-main-row">
                  <div className="fixture-team home">
                    <TeamFlag teamName={fixture.strHomeTeam} className="fixture-flag" />
                    {fixture.strHomeTeamBadge && (
                      <img src={fixture.strHomeTeamBadge} alt="" className="fixture-crest-img" />
                    )}
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
                    {fixture.strAwayTeamBadge && (
                      <img src={fixture.strAwayTeamBadge} alt="" className="fixture-crest-img" />
                    )}
                    <TeamFlag teamName={fixture.strAwayTeam} className="fixture-flag" />
                  </div>
                </div>

                {fixture.strVenue && (
                  <div className="fixture-venue-meta">
                    <span>🏟️ {fixture.strVenue}</span>
                    {fixture.strCity && <span className="venue-city"> ({fixture.strCity})</span>}
                    {fixture.strGroup && <span className="preview-stage-badge"> • Group {fixture.strGroup}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="standings-heading">
        <div className="section-header">
          <h2>📊 Group Standings Preview</h2>
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
              <div className="points-col">
                <span className="gd-value" data-pos={team.gd > 0} data-neg={team.gd < 0}>
                  {team.gd > 0 ? `+${team.gd}` : team.gd} GD
                </span>
                <span className="points-value">{team.points}</span>
                <span className="points-label">pts</span>
              </div>
            </div>
          ))}

          <div className="legend standings-preview-footer">
            <div className="legend-item qualified">
              <span className="legend-indicator"></span>
              <span>Knockout Stage Qualification (Top 2)</span>
            </div>

            <button
              className="standings-ai-btn"
              onClick={() =>
                handleQuickAction(
                  `Analyze the current group standings and scenarios for Group ${selectedGroup} of the World Cup. Predict which teams are likely to qualify for the round of 16 and explain why.`
                )
              }
            >
              🤖 Group {selectedGroup} Scenarios & Predictions
            </button>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ai-heading">
        <div className="section-header">
          <h2>🤖 AI Command System</h2>
          <p className="section-subtitle">Select a command to launch interactive analysis</p>
        </div>

        <div className="action-grid actions-full-grid">
          {quickActions.map((action) => (
            <button
              className="action-button"
              key={action.label}
              onClick={() => handleQuickAction(action.prompt)}
              aria-label={`Command: ${action.label}`}
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