import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { sendMessageThunk, clearChat } from "../redux/slices/chatSlice";
import {
  selectChatResponse,
  selectChatMovies,
  selectChatLoading,
  selectChatError,
  selectChatQuery,
} from "../redux/selectors/chatSelectors";
import { Link } from "react-router-dom";

const ChatAssistant = () => {
  const dispatch = useDispatch<AppDispatch>();
  const response = useSelector(selectChatResponse);
  const movies = useSelector(selectChatMovies);
  const loading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);
  const prevQuery = useSelector(selectChatQuery);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".chat-toggle")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    dispatch(sendMessageThunk(input.trim()));
    setInput("");
  };

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden animate-fade-in"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] bg-[#0a0a0a]">
            <span className="text-[#f5f5f1] text-sm font-medium uppercase tracking-[0.1em]">
              Movie Assistant
            </span>
            <div className="flex items-center gap-2">
              {prevQuery && (
                <button
                  onClick={() => dispatch(clearChat())}
                  className="text-[#6b6b6b] hover:text-[#f5f5f1] text-xs transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-[#6b6b6b] hover:text-[#f5f5f1] transition-colors text-sm leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {!response && !loading && !error && (
              <p className="text-[#6b6b6b] text-sm text-center mt-8">
                Ask me for movie recommendations.
                <br />
                <span className="text-xs">
                  e.g. "a thriller like Inception but set in space"
                </span>
              </p>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 mt-8">
                <div className="animate-spin w-6 h-6 border-2 border-[#c9774d] border-t-transparent rounded-full" />
                <p className="text-[#6b6b6b] text-xs">Thinking...</p>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center mt-8">{error}</p>
            )}

            {response && (
              <div className="space-y-4">
                <p className="text-[#d1d5db] text-sm leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>

                {movies.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#2a2a2a]">
                    <p className="text-[#6b6b6b] text-xs uppercase tracking-[0.1em]">
                      Referenced movies
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {movies.map((m) => (
                        <Link
                          key={m.id}
                          to={`/movie/${m.id}`}
                          onClick={() => setOpen(false)}
                          className="flex-shrink-0 w-20 group"
                        >
                          <div className="aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a1a]">
                            {m.poster ? (
                              <img
                                src={m.poster}
                                alt={m.title}
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#6b6b6b] text-xs">
                                No Poster
                              </div>
                            )}
                          </div>
                          <p className="text-[#9ca3af] text-[10px] mt-1 truncate group-hover:text-[#c9774d] transition-colors">
                            {m.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-3 border-t border-[#2a2a2a] bg-[#0a0a0a]"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you in the mood for?"
              className="flex-1 bg-transparent text-[#f5f5f1] text-sm placeholder:text-[#6b6b6b] focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="text-xs uppercase tracking-[0.1em] text-[#c9774d] hover:text-[#d98a5e] disabled:text-[#4a4a4a] disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="chat-toggle fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#c9774d] hover:bg-[#d98a5e] text-white rounded-full shadow-lg flex items-center justify-center transition-colors text-lg"
        aria-label="Toggle movie assistant"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
};

export default ChatAssistant;
