import React from "react";
import { Link } from "react-router-dom";
import { BOOKS, BESIDE } from "@/data/scriptureRoad";

export default function Beside() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10 animate-fade">
      <Link to="/word" className="text-sm text-wwjd-muted">← The road</Link>
      <h1 className="font-serif-display text-3xl mt-6">Beside the story</h1>
      <p className="mt-4 text-wwjd-soft leading-relaxed">
        These writings were read among God’s people in some times and places.
        They help you hear the world of Scripture. They are not a test of which church you belong to.
        They are not a conspiracy. The road from Genesis to Revelation is still the road.
      </p>
      <div className="mt-8 grid gap-3">
        {BESIDE.map((id) => (
          <Link
            key={id}
            to={`/word/${id}`}
            className="block rounded-2xl border border-wwjd-border bg-white/80 p-5 hover:border-wwjd-gold"
          >
            <p className="font-serif-display text-xl">{BOOKS[id].title}</p>
            <p className="text-wwjd-soft mt-1">{BOOKS[id].door}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
