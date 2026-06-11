
import "./Home.css";

function Home() {
  const liveMatches = [
    {
      id: 1,
      home: "Argentina",
      away: "Brazil",
      homeScore: 2,
      awayScore: 1,
      status: "67' LIVE",
    },
    {
      id: 2,
      home: "Spain",
      away: "France",
      homeScore: 0,
      awayScore: 0,
      status: "HT",
    },
  ];

  const fixtures = [
    {
      id: 1,
      home: "France",
      away: "Germany",
      time: "20:00",
    },
    {
      id: 2,
      home: "Spain",
      away: "Portugal",
      time: "22:00",
    },
    {
      id: 3,
      home: "England",
      away: "Netherlands",
      time: "23:30",
    },
  ];

  const standings = [
    { team: "USA", points: 7 },
    { team: "Mexico", points: 6 },
    { team: "Canada", points: 4 },
    { team: "Japan", points: 0 },
  ];

  const quickActions = [
    "Today's Fixtures",
    "Live Matches",
    "Who will qualify?",
    "World Cup Trivia",
  ];

  return (
    <div className="home-container">
      {/* Live Matches */}
      <section className="section">
        <div className="section-header">
          <h2>🔴 Live Matches</h2>
        </div>

        <div className="match-grid">
          {liveMatches.map((match) => (
            <div className="match-card" key={match.id}>
              <span className="match-status">{match.status}</span>

              <div className="match-teams">
                <span>{match.home}</span>
                <span className="score">
                  {match.homeScore} - {match.awayScore}
                </span>
                <span>{match.away}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Fixtures */}
      <section className="section">
        <div className="section-header">
          <h2>📅 Today's Fixtures</h2>
        </div>

        <div className="fixture-list">
          {fixtures.map((fixture) => (
            <div className="fixture-card" key={fixture.id}>
              <span>{fixture.home}</span>
              <span className="fixture-time">{fixture.time}</span>
              <span>{fixture.away}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Standings Preview */}
      <section className="section">
        <div className="section-header">
          <h2>📊 Group A Standings</h2>
        </div>

        <div className="standings-card">
          {standings.map((team, index) => (
            <div className="standing-row" key={team.team}>
              <span>{index + 1}.</span>
              <span>{team.team}</span>
              <span>{team.points} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Quick Actions */}
      <section className="section">
        <div className="section-header">
          <h2>🤖 Ask GoalScore AI</h2>
        </div>

        <div className="action-grid">
          {quickActions.map((action) => (
            <button className="action-button" key={action}>
              {action}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

