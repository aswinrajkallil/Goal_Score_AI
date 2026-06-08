import { useState, useRef, useEffect } from "react";
import "./chat.css"; // Ensure you update your CSS variables to match the new theme!
// import logo from "../assets/goalscore-logo.png"; // Optional: Add a matching logo asset

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Stat/Bullet Renderer ────────────────────────────────────
// Tailored for sports stats, match summaries, and tournament data
function BotMessage({ text }) {
  const lines = text
    .split(/•/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (lines.length <= 1) return <span>{text}</span>;

  return (
    <ul className="bot-bubble-list match-stats-list">
      {lines.map((line, i) => {
        const colonIdx = line.indexOf(":");
        const hasLabel = colonIdx !== -1 && colonIdx < 22;

        return (
          <li key={i} className="stat-item">
            <span className="bot-bullet-icon">⚽</span>
            <span className="bot-bullet-body">
              {hasLabel ? (
                <>
                  <span className="bullet-label stat-metric">{line.slice(0, colonIdx + 1)}</span>
                  <span className="bullet-value stat-val">{line.slice(colonIdx + 1).trim()}</span>
                </>
              ) : (
                <span className="bullet-value stat-val">{line}</span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Main GoalScore AI ───────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { text: input, sender: "user", time: getTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages([...newMessages, { text: data.reply, sender: "bot", time: getTime() }]);
    } catch {
      setMessages([
        ...newMessages,
        { text: "VAR Review: Lost connection to the stadium server.", sender: "bot", time: getTime(), isError: true },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-wrapper tournament-theme">
      <div className="chat-container goalscore-panel">

        {/* Header: World Cup Pitch/Stadium Vibe */}
        <div className="chat-header worldcup-header">
          <div className="chat-header-avatar emblem">🏆</div>
          <div className="chat-header-info">
            <div className="chat-header-name">GoalScore AI</div>
            <div className="chat-header-status live-indicator">
              <span className="live-dot" /> World Cup Intel Hub
            </div>
          </div>
          <div className="header-match-badge">
            LIVE STATS
          </div>
        </div>

        {/* Messages Arena */}
        <div className="chat-box pitch-bg">
          {messages.length === 0 && (
            <div className="empty-state stadium-kickoff">
              <div className="empty-state-icon trophy-pulse">🏆</div>
              <div className="empty-state-title">Welcome to the Arena</div>
              <div className="empty-state-sub">
                Ask about World Cup match analysis, historical stats, line-ups, or top scorers.
              </div>
              <div className="kickoff-suggestions">
                <button onClick={() => setInput("Who won the 1970 World Cup?")} className="suggest-btn">1970 Winner? 🏅</button>
                <button onClick={() => setInput("Show top goalscorers tournament record")} className="suggest-btn">Top Scorers 👟</button>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {i === 0 && (
                <div className="date-divider matchday-divider">
                  <span>Matchday Timeline</span>
                </div>
              )}

              <div className={`message ${msg.sender === "user" ? "home-team" : "away-team"}`}>
                <div className="msg-avatar">
                  {msg.sender === "user" ? "🏃‍♂️" : "🤖"}
                </div>
                <div>
                  <div className={`bubble ${msg.sender}-bubble ${msg.isError ? "red-card" : ""}`}>
                    {msg.sender === "bot" ? <BotMessage text={msg.text} /> : msg.text}
                  </div>
                  <div className="msg-time match-minute">{msg.time}</div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message away-team">
              <div className="msg-avatar">🤖</div>
              <div className="bubble bot-bubble typing-indicator">
                <span className="pitch-dot" />
                <span className="pitch-dot" />
                <span className="pitch-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Sector */}
        <div className="input-arena-footer">
          <div className="input-area tactical-input">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask GoalScore AI (e.g., 'Compare Messi vs Ronaldo World Cup stats')..."
                disabled={loading}
                maxLength={2000}
              />
            </div>
            <button 
              className="send-btn kickoff-btn" 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              title="Send Pass"
            >
              ➔
            </button>
          </div>
          <div className="input-footer stadium-credits">
            <span className="input-hint">Powered by GoalScore Tactical Engine</span>
            <span className="input-hint">⚽ 🌍</span>
          </div>
        </div>

      </div>
    </div>
  );
}