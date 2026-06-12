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

// ─── Default Questions Pool ───────────────────────────────────
const defaultQuestions = [
  {
    label: "🏆 2026 Format",
    question: "How does the new 48-team FIFA World Cup 2026 format work?"
  },
  {
    label: "🌎 Host Cities",
    question: "Which cities across the USA, Canada, and Mexico are hosting World Cup matches?"
  },
  {
    label: "⚽ Today's Fixtures",
    question: "Show today's FIFA World Cup 2026 match schedule."
  },
  {
    label: "🇦🇷 Argentina",
    question: "Analyze Argentina's chances of winning the 2026 World Cup."
  },
  {
    label: "🇧🇷 Brazil",
    question: "Who are Brazil's key players for the 2026 World Cup?"
  },
  {
    label: "🇫🇷 France",
    question: "Can France reach another World Cup final in 2026?"
  },
  {
    label: "🇪🇸 Spain",
    question: "What is Spain's expected lineup for the 2026 tournament?"
  },
  {
    label: "📊 Group Stage",
    question: "How many teams advance from each group in the 2026 World Cup?"
  },
  {
    label: "🔥 Golden Boot",
    question: "Who are the favorites to win the Golden Boot in 2026?"
  },
  {
    label: "🚀 Dark Horses",
    question: "Which teams could be the biggest surprise packages in the 2026 World Cup?"
  },
  {
    label: "🏟️ Final Venue",
    question: "Which stadium will host the FIFA World Cup 2026 Final?"
  },
  {
    label: "🎯 Predictions",
    question: "Predict the semifinalists for the 2026 FIFA World Cup."
  }
];

// Helper function to pick 3 unique random items
function getRandomSuggestions(pool) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

// ─── Stat/Bullet Renderer ─────────────────────────────────────
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

// ─── Follow-Up Chip Generator (2026 World Cup Real-Time Intent) ───
function generateFollowUps(userQuestion, botReply) {
  const q = `${userQuestion} ${botReply}`.toLowerCase();

  if (q.includes("usa") || q.includes("united states") || q.includes("mexico") || q.includes("canada")) {
    return [
      "What stadium is hosting the 2026 Final?",
      "Check Group A fixtures for Team Mexico",
      "When is the next USMNT group stage game?",
    ];
  }
  if (q.includes("group") || q.includes("format") || q.includes("bracket") || q.includes("standings")) {
    return [
      "How do the best 3rd-place teams qualify for the Round of 32?",
      "Show all 12 groups from Group A to L",
      "How many total games does it take to win the 2026 title?",
    ];
  }
  if (q.includes("rule") || q.includes("referee") || q.includes("var") || q.includes("countdown") || q.includes("card")) {
    return [
      "Explain the new 5-second countdown rule for restarts",
      "What is the 10-second substitution limit rule?",
      "How are yellow cards wiped in the 2026 knockout rounds?",
    ];
  }
  if (q.includes("argentina") || q.includes("brazil") || q.includes("france") || q.includes("england") || q.includes("spain")) {
    return [
      "Who are the favorites in Group J with Argentina?",
      "Analyze France's Group I schedule against Senegal and Norway",
      "Show Spain's upcoming fixture list",
    ];
  }
  if (q.includes("upset") || q.includes("qualified") || q.includes("debut") || q.includes("points")) {
    return [
      "Which teams are making their World Cup debut in 2026?",
      "What are the group stage tiebreaker rules for equal points?",
      "Predict the biggest group stage underdogs",
    ];
  }

  return [
    "Which 16 cities are hosting matches across North America?",
    "How does the new Round of 32 single-elimination bracket work?",
    "Show today's active 2026 match timeline",
  ];
}

// ─── Main GoalScore AI ────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  
  // Dynamic starter suggestions state
  const [suggestions, setSuggestions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasPopulated = useRef(false);

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Initial seed for suggestions on mount
  useEffect(() => {
    setSuggestions(getRandomSuggestions(defaultQuestions));
  }, []);

  // Bonus Rotation Feature: Rotates questions every 15s only when messages array is empty
  useEffect(() => {
    if (messages.length > 0) return;

    const interval = setInterval(() => {
      setSuggestions(getRandomSuggestions(defaultQuestions));
    }, 15000);

    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    if (location.state?.initialPrompt && !hasPopulated.current) {
      setInput(location.state.initialPrompt);
      hasPopulated.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { text: trimmed, sender: "user", time: getTime() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setFollowUps([]);
    setLoading(true);
    focusInput();

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || "VAR Review: The assistant returned an empty response. Please try again.";

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
      focusInput();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFollowUp = (suggestion) => {
    setInput(suggestion);
    setFollowUps([]);
    focusInput();
  };

  const handleSendMouseDown = (e) => {
    e.preventDefault();
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
              <span className="live-dot" /> 2026 Intel Arena Hub
            </div>
          </div>
        </div>

        {/* ── Messages Arena ── */}
        <div className="chat-box pitch-bg">
          {messages.length === 0 && (
            <div className="empty-state stadium-kickoff">
              <div className="empty-state-icon trophy-pulse">🏆</div>
              <div className="empty-state-title">Welcome to the 2026 Arena</div>
              <div className="empty-state-sub"></div>
              
              {/* ── Dynamic Kickoff Suggestions ── */}
              <div className="kickoff-suggestions">
                {suggestions.map((item, index) => (
                  <button
                    key={`${item.label}-${index}`}
                    onClick={() => setInput(item.question)}
                    className="suggest-btn"
                    aria-label={`Suggest prompt: ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {i === 0 && (
                <div className="date-divider matchday-divider">
                  <span>2026 Matchday Timeline</span>
                </div>
              )}

              <div className={`message ${msg.sender === "user" ? "home-team" : "away-team"}`}>
                <div className="msg-avatar" role="img" aria-label={msg.sender}>
                  {msg.sender === "user" ? "🏃‍♂️" : "🤖"}
                </div>

                <div className="msg-bubble-container">
                  <div className={`bubble ${msg.sender}-bubble ${msg.isError ? "red-card" : ""}`}>
                    {msg.sender === "bot" ? (
                      <BotMessage text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>

                  <div className="msg-time match-minute">{msg.time}</div>

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

          {loading && (
            <div className="message away-team">
              <div className="msg-avatar">🤖</div>
              <div className="bubble bot-bubble typing-indicator" aria-label="AI analyzing data">
                <span className="pitch-dot" />
                <span className="pitch-dot" />
                <span className="pitch-dot" />
              </div>
            </div>
          )}

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
              placeholder="Ask anything about FIFA World Cup 2026..."
              className="chat-input"
              rows="2"
              disabled={loading}
              aria-label="Ask GoalScore AI"
            />
            <button
              onMouseDown={handleSendMouseDown}
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