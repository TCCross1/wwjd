import React, { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BOOKS, nextOnRoad } from "@/data/scriptureRoad";

const SEEN_KEY = "wwjd-scripture-road-seen";

export default function BookVisit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = BOOKS[id];
  const [step, setStep] = useState(0);
  const [carried, setCarried] = useState(null);

  const steps = useMemo(() => {
    if (!book) return [];
    return [
      { key: "door", label: "The book" },
      { key: "story", label: "The story" },
      { key: "associate", label: "Ground and page" },
      { key: "thread", label: "Jesus" },
      { key: "carry", label: "Take one thing" },
    ];
  }, [book]);

  if (!book) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <p>That book is not on this road yet.</p>
        <Link to="/word" className="text-wwjd-terracotta mt-4 inline-block">Back to the road</Link>
      </div>
    );
  }

  const markSeen = () => {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    if (!seen.includes(id)) {
      seen.push(id);
      localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    }
    localStorage.setItem("wwjd-scripture-road-current", id);
  };

  const next = nextOnRoad(id);

  return (
    <div className="max-w-xl mx-auto px-5 py-10 animate-fade">
      <Link to="/word" className="text-sm text-wwjd-muted">← The road</Link>
      <p className="text-xs tracking-[0.2em] uppercase text-wwjd-muted mt-6">{book.section}</p>
      <h1 className="font-serif-display text-4xl mt-1">{book.title}</h1>

      <div className="flex gap-1 mt-6 mb-8">
        {steps.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-wwjd-gold" : "bg-wwjd-border"}`}
            aria-label={s.label}
          />
        ))}
      </div>

      {step === 0 && (
        <section>
          <p className="scripture-text text-2xl text-wwjd-text">{book.door}</p>
          <button
            data-testid="teaching-begin-story"
            onClick={() => setStep(1)}
            className="mt-10 px-8 py-3 rounded-full bg-wwjd-terracotta text-white"
          >
            Begin the story
          </button>
        </section>
      )}

      {step === 1 && (
        <section>
          <p className="text-xs uppercase tracking-wide text-wwjd-muted">The story</p>
          <p className="mt-4 text-lg leading-relaxed text-wwjd-text">{book.campfire}</p>
          <button onClick={() => setStep(2)} className="mt-10 px-8 py-3 rounded-full bg-wwjd-terracotta text-white">
            Show me the ground
          </button>
        </section>
      )}

      {step === 2 && (
        <section>
          <p className="text-xs uppercase tracking-wide text-wwjd-muted">Associated</p>
          <div className="mt-4 rounded-2xl border border-wwjd-border bg-white/80 p-5">
            <p className="text-xs uppercase tracking-wide text-wwjd-muted">From the ground</p>
            <p className="font-serif-display text-xl mt-2">{book.object}</p>
            <p className="mt-2 text-wwjd-soft">{book.pointAt}</p>
            {book.objectNote && <p className="mt-3 text-sm text-wwjd-muted italic">{book.objectNote}</p>}
          </div>
          <div className="mt-3 rounded-2xl border border-wwjd-gold/40 bg-[#FBF6E8] p-5">
            <p className="text-xs uppercase tracking-wide text-wwjd-muted">From the page</p>
            <p className="font-serif-display text-xl mt-2">{book.pageAsks}</p>
          </div>
          {book.ink && (
            <p className="mt-6 text-sm text-wwjd-soft leading-relaxed">{book.ink}</p>
          )}
          <button onClick={() => setStep(3)} className="mt-10 px-8 py-3 rounded-full bg-wwjd-terracotta text-white">
            Where this looks toward Jesus
          </button>
        </section>
      )}

      {step === 3 && (
        <section>
          <p className="text-xs uppercase tracking-wide text-wwjd-muted">Last, not first</p>
          <p className="scripture-text text-2xl mt-4">{book.thread}</p>
          <button onClick={() => { markSeen(); setStep(4); }} className="mt-10 px-8 py-3 rounded-full bg-wwjd-terracotta text-white">
            Take one thing with you
          </button>
        </section>
      )}

      {step === 4 && (
        <section>
          <p className="font-serif-display text-2xl">Take one thing</p>
          <div className="mt-6 grid gap-3">
            <button
              onClick={() => setCarried("fact")}
              className={`text-left rounded-2xl border p-4 ${carried === "fact" ? "border-wwjd-gold bg-white" : "border-wwjd-border bg-white/70"}`}
            >
              <p className="text-xs uppercase text-wwjd-muted">A fact</p>
              <p className="mt-1">{book.pointAt}</p>
            </button>
            <button
              onClick={() => setCarried("ask")}
              className={`text-left rounded-2xl border p-4 ${carried === "ask" ? "border-wwjd-gold bg-white" : "border-wwjd-border bg-white/70"}`}
            >
              <p className="text-xs uppercase text-wwjd-muted">A line from the page</p>
              <p className="mt-1">{book.pageAsks}</p>
            </button>
            <button
              onClick={() => setCarried("carry")}
              className={`text-left rounded-2xl border p-4 ${carried === "carry" ? "border-wwjd-gold bg-white" : "border-wwjd-border bg-white/70"}`}
            >
              <p className="text-xs uppercase text-wwjd-muted">A sentence to keep</p>
              <p className="mt-1">{book.carry}</p>
            </button>
          </div>

          <p className="mt-8 text-wwjd-soft text-sm">
            The WWJD counsel you already have is for after you have stood in a book. It is not a substitute for the page.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {next && !book.beside && (
              <button
                onClick={() => { markSeen(); navigate(`/word/${next}`); }}
                className="px-6 py-3 rounded-full bg-wwjd-terracotta text-white"
              >
                Next on the road: {BOOKS[next].title}
              </button>
            )}
            <Link to="/counsel" className="px-6 py-3 rounded-full border border-wwjd-border text-center">
              Ask counsel
            </Link>
            <Link to="/word" className="px-6 py-3 text-center text-wwjd-muted">
              Back to the road
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
