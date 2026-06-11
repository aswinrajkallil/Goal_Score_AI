import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./chat.css";

// ─── Helpers ──────────────────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Stat/Bullet Renderer ─────────────────────────────────────
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

// ─── Follow-Up Chip Generator ─────────────────────────────────
function generateFollowUps(userQuestion, botReply) {
  const q = (userQuestion + " " + botReply).toLowerCase();

  if (q.includes("mbappe") || q.includes("mbappé"))
    return [
      "How many goals did Mbappé score in 2022?",
      "Compare Mbappé vs Messi at the 2022 final",
      "What clubs has Mbappé played for?",
    ];
  if (q.includes("messi") || q.includes("argentina"))
    return [
      "How did Argentina beat France in the final?",
      "Messi's complete World Cup goal record",
      "Argentina's best players in 2022",
    ];
  if (q.includes("final") || q.includes("penalty"))
    return [
      "Who scored in the 2022 World Cup final?",
      "Full penalty shootout breakdown",
      "Greatest World Cup finals of all time",
    ];
  if (q.includes("group") || q.includes("standings") || q.includes("qualify"))
    return [
      "Who were the biggest upsets in the group stage?",
      "Which teams were eliminated in the group stage?",
      "Top goalscorers from the group stage",
    ];
  if (
    q.includes("england") ||
    q.includes("france") ||
    q.includes("netherlands")
  )
    return [
      "How far did England go in 2022?",
      "France's road to the final",
      "Netherlands' best World Cup performances",
    ];
  if (q.includes("goal") || q.includes("scorer") || q.includes("hat-trick"))
    return [
      "Who is the all-time World Cup top scorer?",
      "Any hat-tricks scored at 2022 World Cup?",
      "Golden Boot winners since 2006",
    ];
  if (
    q.includes("history") ||
    q.includes("winner") ||
    q.includes("champion")
  )
    return [
      "Which country has won the most World Cups?",
      "First ever FIFA World Cup winner",
      "Biggest World Cup upsets in history",
    ];

  // Generic fallbacks
  return [
    "Who was the best goalkeeper at 2022 World Cup?",
    "Surprise teams that reached the knockout rounds?",
    "What is the VAR controversy from 2022?",
  ];
}

// ─── Main GoalScore AI ────────────────────────────────────────
export default function Chat() {
  // ── Internal state — no props needed ──
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasPopulated = useRef(false);

  // ── Focus helper — uses rAF to restore focus after paint ──
  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Handle pre-filled prompt from route state (runs once)
  useEffect(() => {
    if (location.state?.initialPrompt && !hasPopulated.current) {
      setInput(location.state.initialPrompt);
      hasPopulated.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // ── Auto-scroll to bottom whenever messages or loading changes ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Send message ──────────────────────────────────────────────
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { text: trimmed, sender: "user", time: getTime() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setFollowUps([]);
    setLoading(true);
    focusInput(); // Restore focus immediately after sending

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      // Graceful fallback if reply field is missing
      const botReply =
        data.reply ||
        "VAR Review: The assistant returned an empty response. Please try again.";

      setFollowUps(generateFollowUps(trimmed, botReply));
      setMessages([
        ...updatedMessages,
        { text: botReply, sender: "bot", time: getTime() },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...updatedMessages,
        {
          text: "VAR Review: Lost connection to the stadium server. Please try resending.",
          sender: "bot",
          time: getTime(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      focusInput(); // Restore focus after AI responds (or on error)
    }
  };

  // Enter → send, Shift+Enter → newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chip click: populate input and restore focus
  const handleFollowUp = (suggestion) => {
    setInput(suggestion);
    setFollowUps([]);
    focusInput();
  };

  // Send button: use onMouseDown + preventDefault to avoid stealing focus
  const handleSendMouseDown = (e) => {
    e.preventDefault(); // Keeps focus on textarea
  };

  return (
    <div className="chat-wrapper tournament-theme">
      <div className="chat-container goalscore-panel">

        {/* ── Header: World Cup Pitch/Stadium Vibe ── */}
        <div className="chat-header worldcup-header">
          <div className="chat-header-avatar emblem" aria-hidden="true">
            🏆
          </div>
          <div className="chat-header-info">
            <div className="chat-header-name">GoalScore AI</div>
            <div className="chat-header-status live-indicator">
              <span className="live-dot" /> World Cup Intel Hub
            </div>
          </div>
          <div className="header-match-badge">LIVE STATS</div>
        </div>

        {/* ── Messages Arena ── */}
        <div className="chat-box pitch-bg">
          {/* Empty state shown before any conversation starts */}
          {messages.length === 0 && (
            <div className="empty-state stadium-kickoff">
              <div className="empty-state-icon trophy-pulse">🏆</div>
              <div className="empty-state-title">Welcome to the Arena</div>
              <div className="empty-state-sub">
                Ask about World Cup match analysis, historical stats, line-ups,
                or predictions.
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

          {/* Message list */}
          {messages.map((msg, i) => (
            <div key={i}>
              {/* Divider shown once before the first message */}
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
                <div
                  className="msg-avatar"
                  role="img"
                  aria-label={msg.sender}
                >
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

                  {/* Follow-up chips — only beneath the latest bot message */}
                  {msg.sender === "bot" &&
                    i === messages.length - 1 &&
                    followUps.length > 0 &&
                    !loading && (
                      <div className="followup-chips">
                        {followUps.map((chip) => (
                          <button
                            key={chip}
                            className="followup-chip"
                            onClick={() => handleFollowUp(chip)}
                            aria-label={`Follow-up: ${chip}`}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator while awaiting bot response */}
          {loading && (
            <div className="message away-team">
              <div className="msg-avatar">🤖</div>
              <div
                className="bubble bot-bubble typing-indicator"
                aria-label="AI is typing"
              >
                <span className="pitch-dot" />
                <span className="pitch-dot" />
                <span className="pitch-dot" />
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={chatEndRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about match analysis, stats, predictions..."
              className="chat-input"
              rows="2"
              disabled={loading}
              aria-label="Ask GoalScore AI"
            />
            <button
              onMouseDown={handleSendMouseDown} // Prevents focus loss on click
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