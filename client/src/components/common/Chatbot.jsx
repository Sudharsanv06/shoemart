import { useState, useEffect, useRef } from "react";
import { chatAPI } from "../../api";

const WELCOME_MESSAGE = {
  role:    "assistant",
  content: "👋 Hi! I'm SHOEMART's AI assistant. I can help you find the perfect shoes, answer size questions, or help with your orders. What can I help you with today?",
};

const QUICK_REPLIES = [
  "What sizes are available?",
  "How do I track my order?",
  "What's the return policy?",
  "Suggest running shoes",
];

export default function Chatbot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([WELCOME_MESSAGE]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [isNew,     setIsNew]     = useState(true);
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setIsNew(false);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMessage = { role: "user", content: userText };
    const updated     = [...messages, userMessage];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res   = await chatAPI.send(updated);
      const reply = res.data.data.reply;
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([
        ...updated,
        {
          role:    "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold shadow-lg shadow-gold/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-gold/50"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {isNew && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-obsidian animate-pulse" />
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-sm overflow-hidden shadow-2xl border border-gold/20"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-obsidian border-b border-gold/20 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-sm">
                👟
              </div>
              <div>
                <p className="text-ivory text-sm font-semibold">SHOEMART Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-green-400 text-xs">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClear}
              title="Clear chat"
              className="text-muted hover:text-ivory text-xs transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-carbon px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-xs flex-shrink-0 mt-1 mr-2">
                    👟
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-sm text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "bg-gold text-obsidian font-medium rounded-br-none"
                      : "bg-charcoal text-ivory border border-white/5 rounded-bl-none"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-xs flex-shrink-0 mt-1 mr-2">
                  👟
                </div>
                <div className="bg-charcoal border border-white/5 px-4 py-3 rounded-sm rounded-bl-none">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies — show only at start */}
          {messages.length <= 1 && (
            <div className="bg-carbon border-t border-white/5 px-4 py-2 flex gap-2 flex-wrap flex-shrink-0">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="text-xs px-3 py-1.5 border border-gold/30 text-gold hover:bg-gold/10 rounded-full transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="bg-obsidian border-t border-gold/20 px-4 py-3 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={loading}
              className="flex-1 bg-carbon border border-white/10 text-ivory text-sm px-3 py-2 rounded-sm placeholder-muted focus:outline-none focus:border-gold/50 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-gold rounded-sm flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-gold/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}