import { useState } from "react";
import "./Standings.css";
import TeamFlag from "./TeamFlag";

function Standings() {
  const [selectedGroup, setSelectedGroup] = useState("A");

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