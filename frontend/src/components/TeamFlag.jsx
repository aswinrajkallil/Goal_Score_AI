import { useState, useEffect } from "react";
import { getTeamFlagUrl } from "../utils/countryFlags";

export default function TeamFlag({ teamName, className = "" }) {
  const [error, setError] = useState(false);
  const flagUrl = getTeamFlagUrl(teamName);

  // Reset error state if teamName changes
  useEffect(() => {
    setError(false);
  }, [teamName]);

  if (!flagUrl || error) {
    return (
      <span 
        className={`fallback-flag-icon ${className}`} 
        role="img" 
        aria-label="Football Icon"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "16px",
          fontSize: "1.1rem",
          verticalAlign: "middle"
        }}
      >
        ⚽
      </span>
    );
  }

  return (
    <img
      src={flagUrl}
      alt={`${teamName} flag`}
      className={`team-flag-img ${className}`}
      onError={() => setError(true)}
      style={{
        width: "24px",
        height: "16px",
        objectFit: "cover",
        borderRadius: "2px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
        display: "inline-block",
        verticalAlign: "middle",
        backgroundColor: "rgba(255, 255, 255, 0.1)"
      }}
    />
  );
}
