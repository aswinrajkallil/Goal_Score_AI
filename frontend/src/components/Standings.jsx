import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Standings.css";
import TeamFlag from "./TeamFlag";

// Reusable structural layout helper to map dynamic labels to targeted AI engine string prompts
const generateAIPrompts = (groupName) => [
  {
    label: "🔍 Qualification Scenarios",
    prompt: `Analyse Group ${groupName} tournament standings. Detail qualification pathways, potential tiebreaker scenarios, and historic metrics determining progress.`
  },
  {
    label: "🏆 Top Performer",
    prompt: `Identify standout players and statistical leaders within Group ${groupName}. Detail match ratings, goals, contributions, and key defensive metrics.`
  },
  {
    label: "📊 Group Analysis",
    prompt: `Provide a comprehensive tactical analysis of Group ${groupName} match styles, system formations, pressing structures, and team tracking data.`
  }
];

function Standings({ liveData = {}, initialGroup = "A" }) {
  // Accepts dynamic 'liveData' object structure containing array lists indexed by group keys (e.g., { A: [...], B: [...] })
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const navigate = useNavigate();

  const askAI = (prompt) => {
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  // Safe runtime execution defaults to fallback array loops smoothly if data is missing or fetching
  const availableGroups = Object.keys(liveData).length > 0 ? Object.keys(liveData) : ["A", "B", "C", "D"];
  const currentGroupStandings = liveData[selectedGroup] || [];
  const activeAIActions = generateAIPrompts(selectedGroup);

  return (
    <div className="standings-container">
      <div className="page-header">
        <h1>📊 World Cup Group Standings</h1>
        <p className="header-subtitle">
          Top 2 teams from each group qualify for the knockout stage
        </p>
      </div>

      {/* GROUP TABS */}
      <div className="group-tabs" role="tablist" aria-label="Select Standings Group">
        {availableGroups.map((group) => (
          <button
            key={group}
            role="tab"
            aria-selected={selectedGroup === group}
            className={`group-tab ${selectedGroup === group ? "active" : ""}`}
            onClick={() => setSelectedGroup(group)}
          >
            Group {group}
          </button>
        ))}
      </div>

      {/* STANDINGS TABLE */}
      <div className="table-wrapper" tabIndex={0} aria-label="Standings data table (scrollable)">
        <table className="standings-table">
          <thead>
            <tr className="table-header">
              <th className="col-rank">#</th>
              <th className="col-team">Team</th>
              <th className="col-stat">P</th>
              <th className="col-stat">W</th>
              <th className="col-stat">D</th>
              <th className="col-stat">L</th>
              <th className="col-stat">GD</th>
              <th className="col-points">Pts</th>
            </tr>
          </thead>

          <tbody>
            {currentGroupStandings.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data-fallback" style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)" }}>
                  No standings data available for Group {selectedGroup}.
                </td>
              </tr>
            ) : (
              currentGroupStandings.map((team, index) => (
                <tr
                  key={team.team || index}
                  className={`table-row ${index < 2 ? "qualified" : ""}`}
                >
                  <td className="col-rank">
                    <span className="rank-badge">{index + 1}</span>
                  </td>

                  <td className="col-team">
                    <div className="team-cell">
                      <TeamFlag teamName={team.team} className="standing-flag" />
                      <span className="team-name">{team.team}</span>
                      {index < 2 && (
                        <span className="q-badge" aria-label="Qualified for Knockouts">Q</span>
                      )}
                    </div>
                  </td>

                  <td className="col-stat" data-label="Played">{team.played ?? 0}</td>
                  <td className="col-stat" data-label="Won">{team.won ?? 0}</td>
                  <td className="col-stat" data-label="Drawn">{team.draw ?? 0}</td>
                  <td className="col-stat" data-label="Lost">{team.lost ?? 0}</td>

                  <td className="col-stat" data-label="Goal Diff">
                    <span className={(team.gd ?? 0) > 0 ? "positive" : (team.gd ?? 0) < 0 ? "negative" : ""}>
                      {(team.gd ?? 0) > 0 ? `+${team.gd}` : team.gd ?? 0}
                    </span>
                  </td>

                  <td className="col-points" data-label="Points">
                    <span className="points-badge">{team.points ?? 0}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* AI GROUP ANALYSIS ACTIONS */}
      <div className="standings-ai-bar">
        <div className="standings-ai-label">
          <span className="ai-bar-icon">🤖</span>
          <span>GoalScore AI — Group {selectedGroup} Analysis</span>
        </div>
        <div className="standings-ai-actions">
          {activeAIActions.map((action) => (
            <button
              key={action.label}
              className="standings-ai-btn"
              onClick={() => askAI(action.prompt)}
              aria-label={`Ask AI: ${action.label}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEGEND */}
      <div className="qualification-legend">
        <div className="legend-item qualified">
          <span className="legend-indicator"></span>
          <span className="legend-text">Top 2 teams - Qualify for Round of 16</span>
        </div>
        <div className="legend-item eliminated">
          <span className="legend-indicator"></span>
          <span className="legend-text">Eliminated from group stage</span>
        </div>
      </div>

      {/* STATS INFO */}
      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">📊</div>
          <h3>League Format</h3>
          <p>All teams play each other once. 3 points for a win, 1 for a draw.</p>
        </div>

        <div className="info-card">
          <div className="info-icon">🏆</div>
          <h3>Qualification</h3>
          <p>Top 2 teams from each of 8 groups advance to the knockout stage.</p>
        </div>

        <div className="info-card">
          <div className="info-icon">⚽</div>
          <h3>Tiebreaker</h3>
          <p>Goal difference, then goals scored, then head-to-head record.</p>
        </div>
      </div>
    </div>
  );
}

export default Standings;