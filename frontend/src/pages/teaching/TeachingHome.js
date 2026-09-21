import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BOOKS, ROAD_ORDER, CHEST, groupedRoad } from "@/data/scriptureRoad";

const SEEN_KEY = "wwjd-scripture-road-seen";
const TRUST_KEY = "wwjd-scripture-road-trust";

export default function TeachingHome() {
  const [trust, setTrust] = useState(() => localStorage.getItem(TRUST_KEY) === "1");
  const [progress, setProgress] = useState(() => localStorage.getItem("wwjd-scripture-road-current") || "genesis");

  useEffect(() => {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    if (seen.length) {
      const last = seen[seen.length - 1];
      const idx = ROAD_ORDER.indexOf(last);
      setProgress(ROAD_ORDER[Math.min(idx + 1, ROAD_ORDER.length - 1)]);
    }
  }, []);

  if (!trust) {
    return (
      <div className="max-w-xl mx-auto px-5 py-12 animate-fade">
        <p className="text-xs tracking-[0.2em] uppercase text-wwjd-muted">The Word</p>
        <h1 className="font-serif-display text-3xl mt-2 text-wwjd-text">How we treat the Book</h1>
        <div className="mt-8 space-y-4 text-wwjd-soft leading-relaxed">
          <p>We open Scripture and try to understand what it says, from the beginning of the story to the end.</p>
          <p>God used real people in real weather. We will show you that weather so the page is not a fog.</p>
          <p>We will not sort you into a denomination. We will not ask you to join a fight. We will not hide a hard chapter.</p>
          <p>This is a guide to the text. It is not your church. It is not the Holy Spirit.</p>
          <p>If a screen ever feels like a debate instead of a Bible, that screen has failed.</p>
        </div>
        <button
          data-testid="teaching-trust-accept"
          onClick={() => {
            localStorage.setItem(TRUST_KEY, "1");
            setTrust(true);
          }}
          className="mt-10 px-8 py-4 rounded-full bg-wwjd-terracotta text-white font-medium"
        >
          Show me the first page
        </button>
      </div>
    );
  }

  const current = BOOKS[progress] || BOOKS.genesis;
  const groups = groupedRoad();

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 animate-fade">
      <p className="text-xs tracking-[0.2em] uppercase text-wwjd-muted">Beginning to end</p>
      <h1 className="font-serif-display text-3xl mt-2">The road</h1>
      <p className="mt-3 text-wwjd-soft max-w-xl">
        One thing from the ground. One line from the page. Associated. Not a fight.
      </p>

      <div className="mt-8 grid gap-3">
        <Link
          to={`/word/${progress}`}
          data-testid="teaching-continue"
          className="block rounded-2xl border border-wwjd-border bg-white/80 p-5 hover:border-wwjd-gold transition-colors"
        >
          <p className="text-xs uppercase tracking-wide text-wwjd-muted">Continue the road</p>
          <p className="font-serif-display text-2xl mt-1">{current.title}</p>
          <p className="text-wwjd-soft mt-2">{current.door}</p>
        </Link>
        <Link
          to="/word/mark"
          data-testid="teaching-walk-mark"
          className="block rounded-2xl border border-wwjd-border bg-white/80 p-5 hover:border-wwjd-gold transition-colors"
        >
          <p className="text-xs uppercase tracking-wide text-wwjd-muted">If you have never read a Gospel</p>
          <p className="font-serif-display text-2xl mt-1">Walk Mark</p>
          <p className="text-wwjd-soft mt-2">{BOOKS.mark.door}</p>
        </Link>
      </div>

      <h2 className="font-serif-display text-2xl mt-12">Something on my chest</h2>
      <p className="text-wwjd-soft mt-1 mb-4">Opens a book. Not a random verse.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CHEST.map((c) => (
          <Link
            key={c.id}
            to={`/word/${c.book}?from=${c.id}`}
            className="rounded-xl border border-wwjd-border bg-white/70 px-3 py-4 text-center text-sm hover:border-wwjd-gold"
          >
            {c.label}
          </Link>
        ))}
      </div>

      <h2 className="font-serif-display text-2xl mt-12">Every book on the road</h2>
      {groups.map((g) => (
        <div key={g.section} className="mt-6">
          <p className="text-xs uppercase tracking-wide text-wwjd-muted">{g.section}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {g.books.map((id) => (
              <Link
                key={id}
                to={`/word/${id}`}
                className="px-3 py-1.5 rounded-full border border-wwjd-border bg-white/70 text-sm hover:border-wwjd-gold"
              >
                {BOOKS[id].title}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-12 mb-8 rounded-2xl border border-wwjd-border bg-white/60 p-5">
        <p className="text-xs uppercase tracking-wide text-wwjd-muted">Beside the story</p>
        <p className="mt-2 text-wwjd-soft">
          Other old writings sat among God’s people in some times and places. They help you hear the world of the text. They are not a test of which church you belong to.
        </p>
        <Link to="/word/beside" className="inline-block mt-3 text-wwjd-terracotta">
          Open that shelf →
        </Link>
      </div>
    </div>
  );
}
