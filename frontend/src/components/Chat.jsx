import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./chat.css";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
                  <span className="bullet-label stat-metric">
                    {line.slice(0, colonIdx + 1)}
                  </span>
                  <span className="bullet-value stat-val">
                    {line.slice(colonIdx + 1).trim()}
                  </span>
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
export default function Chat({ messages = [], setMessages }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasPopulated = useRef(false);

  // Handle pre-filled prompt from route state exactly once
  useEffect(() => {
    if (location.state?.initialPrompt && !hasPopulated.current) {
      setInput(location.state.initialPrompt);
      hasPopulated.current = true;
      // Clear route state so reloading or back-navigation doesn't re-populate it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages update or loading state changes
  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100); // Small delay to guarantee DOM stability
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { text: input, sender: "user", time: getTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    // Maintain input focus
    setTimeout(() => inputRef.current?.focus(), 50);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      
      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          text: data.reply,
          sender: "bot",
          time: getTime(),
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          text: "VAR Review: Lost connection to the stadium server. Please try resending.",
          sender: "bot",
          time: getTime(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-wrapper tournament-theme">
      <div className="chat-container goalscore-panel">
        {/* Header: World Cup Pitch/Stadium Vibe */}
        <div className="chat-header worldcup-header">
          <div className="chat-header-avatar emblem" aria-hidden="true">🏆</div>
          <div className="chat-header-info">
            <div className="chat-header-name">GoalScore AI</div>
            <div className="chat-header-status live-indicator">
              <span className="live-dot" /> World Cup Intel Hub
            </div>
          </div>
          <div className="header-match-badge">LIVE STATS</div>
        </div>

        {/* Messages Arena */}
        <div className="chat-box pitch-bg">
          {messages.length === 0 && (
            <div className="empty-state stadium-kickoff">
              <div className="empty-state-icon trophy-pulse">🏆</div>
              <div className="empty-state-title">Welcome to the Arena</div>
              <div className="empty-state-sub">
                Ask about World Cup match analysis, historical stats,
                line-ups, or predictions.
              </div>
              <div className="kickoff-suggestions">
                <button
                  onClick={() => setInput("Who won the 1970 World Cup?")}
                  className="suggest-btn"
                  aria-label="Suggest prompt: Who won the 1970 World Cup?"
                >
                  1970 Winner? 🏅
                </button>
                <button
                  onClick={() =>
                    setInput("Show top goalscorers tournament record")
                  }
                  className="suggest-btn"
                  aria-label="Suggest prompt: Show top goalscorers tournament record"
                >
                  Top Scorers 👟
                </button>
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

              <div
                className={`message ${
                  msg.sender === "user" ? "home-team" : "away-team"
                }`}
              >
                <div className="msg-avatar" role="img" aria-label={msg.sender}>
                  {msg.sender === "user" ? "🏃‍♂️" : "🤖"}
                </div>
                <div className="msg-bubble-container">
                  <div
                    className={`bubble ${msg.sender}-bubble ${
                      msg.isError ? "red-card" : ""
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <BotMessage text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className="msg-time match-minute">{msg.time}</div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message away-team">
              <div className="msg-avatar">🤖</div>
              <div className="bubble bot-bubble typing-indicator" aria-label="AI is typing">
                <span className="pitch-dot" />
                <span className="pitch-dot" />
                <span className="pitch-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about match analysis, stats, predictions..."
              className="chat-input"
              rows="2"
              disabled={loading}
              aria-label="Ask GoalScore AI"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="send-btn"
              aria-label="Send message"
            >
              {loading ? "⏳" : "⚽ Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}