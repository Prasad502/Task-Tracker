import { useEffect, useRef, useState } from "react";
import api from "../api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const me = await api.get('/auth/me');
        if (!mounted) return;
        setUser(me.data);
      } catch (e) {
        if (!mounted) return;
        setUser(null);
      }

      try {
        const res = await api.get('/chat');
        if (!mounted) return;
        setMessages(res.data || []);
      } catch (e) {
        // ignore
      } finally {
        mounted && setLoading(false);
      }
    };

    load();

    // Poll for new messages every second for near real-time updates
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get('/chat');
        if (!mounted) return;
        setMessages(res.data || []);
      } catch (e) {
        // ignore polling errors
      }
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    // scroll to bottom on new messages
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/chat/messages', { text });
      setText("");
      // optimistic fetch will be picked up by poll; optionally append immediately
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to send message');
    }
  };

  if (loading) return null;

  // Sort messages by timestamp (oldest first)
  const sorted = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const getDateKey = (iso) => {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const getDayLabel = (iso) => {
    const d = new Date(iso);
    const now = new Date();

    const todayKey = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);

    const key = getDateKey(iso);
    if (key === todayKey) return 'Today';
    if (key === yesterdayKey) return 'Yesterday';

    const opts = d.getFullYear() === now.getFullYear()
      ? { month: 'short', day: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  };

  return (
    <>
      <h2>Team Chat</h2>

      <div className="card chat-card">
        <div className="chat-messages">
          {(() => {
            let lastKey = null;

            // linkify utility: returns array of React nodes (text, <a>, <br/>)
            const linkify = (text) => {
              if (!text) return text;

              // regex matches urls starting with http(s) or www.
              const urlRegex = /\b((?:https?:\/\/)|(?:www\.)|(?:mailto:))[\w\-@:%._\+~#=\/?&;\(\)\[\]][^\s]*/gi;
              const nodes = [];
              let lastIndex = 0;
              let match;
              while ((match = urlRegex.exec(text)) !== null) {
                const idx = match.index;
                if (idx > lastIndex) {
                  const before = text.slice(lastIndex, idx);
                  // preserve newlines
                  before.split('\n').forEach((part, i) => {
                    nodes.push(part);
                    if (i < before.split('\n').length - 1) nodes.push(<br key={`br-before-${lastIndex}-${i}`} />);
                  });
                }

                let url = match[0];
                let href = url;
                if (url.startsWith('www.')) href = 'http://' + url;
                // Prevent javascript: pseudo-protocols
                if (href.toLowerCase().startsWith('javascript:')) {
                  nodes.push(url);
                } else {
                  nodes.push(
                    <a key={`a-${idx}`} href={href} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  );
                }

                lastIndex = idx + url.length;
              }

              const rest = text.slice(lastIndex);
              if (rest) {
                rest.split('\n').forEach((part, i) => {
                  nodes.push(part);
                  if (i < rest.split('\n').length - 1) nodes.push(<br key={`br-rest-${lastIndex}-${i}`} />);
                });
              }

              return nodes;
            };

            return sorted.map(m => {
              const key = getDateKey(m.createdAt);
              const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

              const parts = [];
              if (key !== lastKey) {
                parts.push(
                  <div key={`sep-${key}`} className="day-sep">
                    <span>{getDayLabel(m.createdAt)}</span>
                  </div>
                );
                lastKey = key;
              }

              parts.push(
                <div key={m.id} className="chat-message">
                  <div className="chat-meta">
                    <strong>{m.name}</strong>{' '}
                    <span className="chat-ts">{timeStr}</span>
                  </div>
                  <div className="chat-text">{linkify(m.text)}</div>
                </div>
              );

              return parts;
            });
          })()}

          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            placeholder={user ? 'Message the team...' : 'Sign in to chat'}
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={!user}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button onClick={send} disabled={!user || !text.trim()}>Send</button>
        </div>

        {!user && (
          <div className="chat-note">You must be signed in to send messages.</div>
        )}
      </div>
    </>
  );
}
