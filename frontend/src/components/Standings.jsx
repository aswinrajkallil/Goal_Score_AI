import { useState } from "react";
import "./Standings.css";

function Standings() {
  const [selectedGroup, setSelectedGroup] = useState("A");

  const standingsData = {
    A: [
      { team: "USA", played: 3, won: 2, draw: 1, lost: 0, gd: 3, points: 7 },
      { team: "Mexico", played: 3, won: 2, draw: 0, lost: 1, gd: 2, points: 6 },
      { team: "Canada", played: 3, won: 1, draw: 1, lost: 1, gd: 0, points: 4 },
      { team: "Japan", played: 3, won: 0, draw: 0, lost: 3, gd: -5, points: 0 },
    ],
    B: [
      { team: "Brazil", played: 3, won: 3, draw: 0, lost: 0, gd: 5, points: 9 },
      { team: "France", played: 3, won: 2, draw: 0, lost: 1, gd: 2, points: 6 },
      { team: "South Korea", played: 3, won: 1, draw: 0, lost: 2, gd: -1, points: 3 },
      { team: "Morocco", played: 3, won: 0, draw: 0, lost: 3, gd: -6, points: 0 },
    ],
  };

  return (
    <div className="standings-container">
      <div className="standings-header">
        <h1>📊 Group Standings</h1>
        <p>FIFA World Cup 2026</p>
      </div>

      <div className="group-tabs">
        {Object.keys(standingsData).map((group) => (
          <button
            key={group}
            className={`group-tab ${
              selectedGroup === group ? "active" : ""
            }`}
            onClick={() => setSelectedGroup(group)}
          >
            Group {group}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="standings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>

          <tbody>
            {standingsData[selectedGroup].map((team, index) => (
              <tr key={team.team}>
                <td>{index + 1}</td>
                <td>{team.team}</td>
                <td>{team.played}</td>
                <td>{team.won}</td>
                <td>{team.draw}</td>
                <td>{team.lost}</td>
                <td>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td className="points">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="qualification-info">
        <div className="legend-item">
          <span className="legend qualified"></span>
          <p>Qualified for Round of 32</p>
        </div>
      </div>
    </div>
  );
}

export default Standings;
