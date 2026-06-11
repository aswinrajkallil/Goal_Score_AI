import { useEffect, useState } from "react";

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      console.log(data);

      setFixtures(data.events || []);
    } catch (error) {
      console.error("Error fetching fixtures:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading fixtures...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Fixtures</h1>

      {fixtures.length === 0 ? (
        <p>No fixtures found.</p>
      ) : (
        fixtures.map((fixture) => (
          <div
            key={fixture.idEvent}
            style={{
              border: "1px solid #444",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>
              {fixture.strHomeTeam} vs {fixture.strAwayTeam}
            </h3>

            <p>
              Score:{" "}
              {fixture.intHomeScore ?? "-"} -{" "}
              {fixture.intAwayScore ?? "-"}
            </p>

            <p>
              Status:{" "}
              {fixture.strStatus ||
                fixture.strProgress ||
                "Scheduled"}
            </p>

            <p>Date: {fixture.dateEvent}</p>

            <p>Time: {fixture.strTime}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Fixtures;