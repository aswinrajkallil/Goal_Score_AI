import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Standings.css";
import TeamFlag from "./TeamFlag";

function Standings() {
  const [selectedGroup, setSelectedGroup] = useState("A");
  const navigate = useNavigate();

  const askAI = (prompt) => {
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  // AI prompts keyed by group
  const groupAIActions = {
    A: [
      {
        label: "🔍 Qualification Scenarios",
        prompt:
          "Analyse Group A of the 2022 FIFA World Cup. Netherlands topped with 7 pts, Senegal qualified 2nd with 6 pts. Explain the tiebreakers and any dramatic qualification scenarios that played out.",
      },
      {
        label: "🏆 Top Performer",
        prompt:
          "Who was the standout player in FIFA World Cup 2022 Group A? Highlight stats for Netherlands and Senegal players who made the biggest impact.",
      },
      {
        label: "📊 Group Analysis",
        prompt:
          "Give me a full tactical breakdown of Group A at the 2022 FIFA World Cup — playing styles, key battles, and why Qatar struggled.",
      },
    ],
    B: [
      {
        label: "🔍 Qualification Scenarios",
        prompt:
          "Analyse Group B of the 2022 FIFA World Cup. England topped with 7 pts and USA qualified second. Discuss the crucial matches and moments that decided qualification.",
      },
      {
        label: "🏆 Top Performer",
        prompt:
          "Who were the standout players in FIFA World Cup 2022 Group B? Focus on England's top contributors and any surprise performances from USA or Iran.",
      },
      {
        label: "📊 Group Analysis",
        prompt:
          "Give me a tactical analysis of Group B at the 2022 FIFA World Cup. How did England dominate, and what went wrong for Wales?",
      },
    ],
    C: [
      {
        label: "🔍 Qualification Scenarios",
        prompt:
          "Analyse the dramatic Group C at the 2022 FIFA World Cup. Argentina's shock loss to Saudi Arabia shook the group — break down how they recovered and what it took to qualify.",
      },
      {
        label: "🏆 Top Performer",
        prompt:
          "Who was the best player in FIFA World Cup 2022 Group C? Did Messi deliver, and what was Saudi Arabia's most surprising performance?",
      },
      {
        label: "📊 Group Analysis",
        prompt:
          "Give me a full analysis of Group C at the 2022 FIFA World Cup — the Argentina vs Saudi Arabia upset, Poland's path to qualification, and Mexico's elimination.",
      },
    ],
    D: [
      {
        label: "🔍 Qualification Scenarios",
        prompt:
          "Analyse Group D of the 2022 FIFA World Cup. France and Australia both had 6 pts. Explain the tiebreakers that separated them and highlight the Australia upset over Denmark.",
      },
      {
        label: "🏆 Top Performer",
        prompt:
          "Who were the top performers in FIFA World Cup 2022 Group D? Highlight Kylian Mbappé's contributions and surprise Australian players.",
      },
      {
        label: "📊 Group Analysis",
        prompt:
          "Give me a tactical breakdown of Group D at the 2022 FIFA World Cup. Why did Denmark underperform and what made Australia's campaign so impressive?",
      },
    ],
  };

  const standingsData = {
    A: [
      {
        team: "Netherlands",
        played: 3,
        won: 2,
        draw: 1,
        lost: 0,
        gd: 4,
        points: 7,
      },
      {
        team: "Senegal",
        played: 3,
        won: 2,
        draw: 0,
        lost: 1,
        gd: 1,
        points: 6,
      },
      {
        team: "Ecuador",
        played: 3,
        won: 1,
        draw: 1,
        lost: 1,
        gd: 1,
        points: 4,
      },
      { team: "Qatar", played: 3, won: 0, draw: 0, lost: 3, gd: -6, points: 0 },
    ],

    B: [
      { team: "England", played: 3, won: 2, draw: 1, lost: 0, gd: 7, points: 7 },
      { team: "USA", played: 3, won: 1, draw: 2, lost: 0, gd: 1, points: 5 },
      { team: "Iran", played: 3, won: 1, draw: 0, lost: 2, gd: -3, points: 3 },
      { team: "Wales", played: 3, won: 0, draw: 1, lost: 2, gd: -5, points: 1 },
    ],

    C: [
      {
        team: "Argentina",
        played: 3,
        won: 2,
        draw: 0,
        lost: 1,
        gd: 3,
        points: 6,
      },
      { team: "Poland", played: 3, won: 1, draw: 1, lost: 1, gd: 0, points: 4 },
      {
        team: "Mexico",
        played: 3,
        won: 1,
        draw: 1,
        lost: 1,
        gd: -1,
        points: 4,
      },
      {
        team: "Saudi Arabia",
        played: 3,
        won: 1,
        draw: 0,
        lost: 2,
        gd: -2,
        points: 3,
      },
    ],

    D: [
      {
        team: "France",
        played: 3,
        won: 2,
        draw: 0,
        lost: 1,
        gd: 3,
        points: 6,
      },
      {
        team: "Australia",
        played: 3,
        won: 2,
        draw: 0,
        lost: 1,
        gd: -1,
        points: 6,
      },
      { team: "Tunisia", played: 3, won: 1, draw: 1, lost: 1, gd: 0, points: 4 },
      {
        team: "Denmark",
        played: 3,
        won: 0,
        draw: 1,
        lost: 2,
        gd: -2,
        points: 1,
      },
    ],
  };

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
        {Object.keys(standingsData).map((group) => (
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
            {standingsData[selectedGroup].map((team, index) => (
              <tr
                key={team.team}
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

                <td className="col-stat" data-label="Played">{team.played}</td>
                <td className="col-stat" data-label="Won">{team.won}</td>
                <td className="col-stat" data-label="Drawn">{team.draw}</td>
                <td className="col-stat" data-label="Lost">{team.lost}</td>

                <td className="col-stat" data-label="Goal Diff">
                  <span className={team.gd > 0 ? "positive" : team.gd < 0 ? "negative" : ""}>
                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                  </span>
                </td>

                <td className="col-points" data-label="Points">
                  <span className="points-badge">{team.points}</span>
                </td>
              </tr>
            ))}
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
          {(groupAIActions[selectedGroup] || []).map((action) => (
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