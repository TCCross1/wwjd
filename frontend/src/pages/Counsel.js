import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, API, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Loader2, HandHeart, Pin, HeartHandshake, Save } from "lucide-react";
import { toast } from "sonner";

export default function Counsel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [prayOpen, setPrayOpen] = useState(false);
  const [prayerText, setPrayerText] = useState("");
  const [prayerLoading, setPrayerLoading] = useState(false);
  const scrollRef = useRef(null);
  const endRef = useRef(null);

  const hasAccess = user?.has_access;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const resp = await fetch(`${API}/counsel/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text, conversation_id: conversationId }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(formatApiErrorDetail(err.detail) || "Unable to receive counsel.");
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          try {
            const evt = JSON.parse(json);
            if (evt.type === "meta" && evt.conversation_id) {
              setConversationId(evt.conversation_id);
            } else if (evt.type === "delta") {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + evt.content };
                return copy;
              });
            } else if (evt.type === "error") {
              toast.error(evt.content);
            }
          } catch (e) {
            /* ignore parse errors */
          }
        }
      }
    } catch (err) {
      toast.error(err.message);
      setMessages((m) => {
        const copy = [...m];
        if (copy[copy.length - 1]?.role === "assistant" && !copy[copy.length - 1].content) {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  const prayThis = async (counselText) => {
    setPrayOpen(true);
    setPrayerLoading(true);
    setPrayerText("");
    try {
      const { data } = await api.post("/counsel/pray", { counsel_text: counselText });
      setPrayerText(data.prayer);
    } catch (err) {
      setPrayerText("");
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Couldn't compose the prayer.");
    } finally {
      setPrayerLoading(false);
    }
  };

  const saveCounsel = async (text) => {
    try {
      await api.post("/counsel/save", { text, source: "counsel" });
      toast.success("Saved. It will greet you quietly at home.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Couldn't save that.");
    }
  };

  if (!hasAccess) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center animate-fade" data-testid="counsel-locked">
        <h1 className="font-serif-display text-2xl text-wwjd-text mb-3">Your gift awaits activation</h1>
        <p className="text-wwjd-soft mb-6">Enter your activation code to open this quiet place.</p>
        <Link to="/activate" className="px-6 py-3 rounded-full bg-wwjd-terracotta text-white" data-testid="counsel-activate-link">
          Activate my gift
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 flex flex-col min-h-[calc(100vh-4rem)]" data-testid="counsel-page">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade">
          <HeartHandshake className="text-wwjd-gold mb-5" size={40} strokeWidth={1.3} />
          <h1 className="font-serif-display text-2xl sm:text-3xl text-wwjd-text">What is weighing on you?</h1>
          <p className="mt-4 text-wwjd-soft max-w-md leading-relaxed">
            Bring your fears, decisions, resentments, or thoughts. You'll receive counsel drawn only
            from the life and words of Jesus.
          </p>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-6 py-4">
        {messages.map((m, i) => (
          <div key={i} data-testid={`message-${m.role}-${i}`} className="animate-fade-up">
            {m.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-wwjd-beige border border-wwjd-line rounded-2xl rounded-br-md px-5 py-3 max-w-[85%]">
                  <p className="text-wwjd-text whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-full">
                <div className="bg-white border border-wwjd-line rounded-2xl rounded-bl-md px-6 py-5">
                  {m.content ? (
                    <p className="scripture-text not-italic text-wwjd-text leading-[1.85] whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-wwjd-muted text-sm">
                      <Loader2 className="animate-spin" size={16} /> He is listening…
                    </div>
                  )}
                </div>
                {m.content && !(streaming && i === messages.length - 1) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => prayThis(m.content)}
                      data-testid={`pray-this-btn-${i}`}
                      className="inline-flex items-center gap-1.5 text-sm text-wwjd-terracotta border border-wwjd-line rounded-full px-4 py-2 hover:border-wwjd-terracotta transition-colors"
                    >
                      <HandHeart size={15} /> Pray this with me
                    </button>
                    <button
                      onClick={() => saveCounsel(m.content)}
                      data-testid={`save-counsel-btn-${i}`}
                      className="inline-flex items-center gap-1.5 text-sm text-wwjd-soft border border-wwjd-line rounded-full px-4 py-2 hover:border-wwjd-gold transition-colors"
                    >
                      <Pin size={15} /> Hold onto this
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 bg-wwjd-bg pt-3 pb-4">
        <div className="bg-white border border-wwjd-line rounded-2xl p-3 flex items-end gap-2">
          <Textarea
            data-testid="counsel-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Bring it here, in your own words…"
            rows={1}
            className="flex-1 border-0 focus-visible:ring-0 resize-none bg-transparent min-h-[44px] max-h-40"
          />
          <button
            onClick={send}
            disabled={streaming || !input.trim()}
            data-testid="counsel-send-btn"
            className="shrink-0 w-11 h-11 rounded-full bg-wwjd-terracotta text-white flex items-center justify-center hover:bg-[#a04e35] transition-colors disabled:opacity-40"
          >
            {streaming ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>

      {/* Pray This With Me dialog */}
      <Dialog open={prayOpen} onOpenChange={setPrayOpen}>
        <DialogContent className="bg-wwjd-bg border-wwjd-line max-w-lg" data-testid="pray-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-2xl text-wwjd-text flex items-center gap-2">
              <HandHeart className="text-wwjd-gold" size={22} /> Pray this with me
            </DialogTitle>
          </DialogHeader>
          {prayerLoading ? (
            <div className="flex items-center gap-2 text-wwjd-muted py-8 justify-center">
              <Loader2 className="animate-spin" size={18} /> Composing a prayer…
            </div>
          ) : (
            <>
              <p className="text-sm text-wwjd-soft mb-2">Pray it as it is, or make it your own.</p>
              <Textarea
                data-testid="prayer-text"
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                rows={9}
                className="scripture-text not-italic bg-white border-wwjd-line focus-visible:ring-wwjd-gold leading-relaxed text-wwjd-text"
              />
              <button
                onClick={() => {
                  saveCounsel(prayerText);
                  setPrayOpen(false);
                }}
                data-testid="save-prayer-btn"
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-wwjd-terracotta self-start"
              >
                <Save size={15} /> Hold onto this prayer
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
