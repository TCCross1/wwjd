import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { MessageCircleHeart, BookOpen, Sparkles, Pin, HandHeart, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [scripture, setScripture] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    api.get("/scripture/daily").then(({ data }) => setScripture(data)).catch(() => {});
    api.get("/counsel/saved").then(({ data }) => setSaved(data && data.text ? data : null)).catch(() => {});
  }, []);

  const hasAccess = user?.has_access;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 animate-fade" data-testid="dashboard-page">
      <div className="flex flex-col items-center text-center">
        <Logo size="lg" />
        <p className="mt-6 text-wwjd-soft scripture-text text-lg">
          Peace be with you, {user?.name?.split(" ")[0] || "friend"}.
        </p>
      </div>

      {!hasAccess && (
        <div className="mt-8 bg-wwjd-beige border border-wwjd-line rounded-2xl p-7 text-center" data-testid="dashboard-activate-prompt">
          <p className="text-wwjd-soft leading-relaxed">
            Your gift hasn't been activated yet. Enter your activation code to open your quiet place.
          </p>
          <Link
            to="/activate"
            data-testid="dashboard-activate-link"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-wwjd-terracotta text-white"
          >
            Activate my gift
          </Link>
        </div>
      )}

      {/* Daily scripture */}
      {scripture && (
        <div className="mt-8 bg-white rounded-2xl border border-wwjd-line p-8" data-testid="dashboard-scripture">
          <p className="text-xs uppercase tracking-[0.2em] text-wwjd-muted mb-4">A word from Jesus today</p>
          <p className="scripture-text text-xl sm:text-2xl text-wwjd-text leading-relaxed">
            &ldquo;{scripture.quote}&rdquo;
          </p>
          <p className="mt-3 text-sm text-wwjd-gold font-medium">{scripture.reference}</p>
          <p className="mt-5 text-wwjd-soft leading-relaxed">{scripture.invitation}</p>
        </div>
      )}

      {/* Saved counsel */}
      {saved && (
        <div className="mt-6 bg-wwjd-beige rounded-2xl border border-wwjd-line p-8" data-testid="dashboard-saved-counsel">
          <div className="flex items-center gap-2 text-wwjd-gold mb-3">
            <Pin size={16} />
            <p className="text-xs uppercase tracking-[0.2em]">Counsel you're holding onto</p>
          </div>
          <p className="scripture-text text-lg text-wwjd-text leading-relaxed whitespace-pre-wrap">{saved.text}</p>
          {saved.reference && <p className="mt-3 text-sm text-wwjd-gold font-medium">{saved.reference}</p>}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Link to="/counsel" data-testid="dashboard-counsel-link" className="group bg-white rounded-2xl border border-wwjd-line p-7 hover:border-wwjd-gold transition-colors">
          <MessageCircleHeart className="text-wwjd-gold mb-3" size={24} strokeWidth={1.5} />
          <h3 className="font-serif-display text-lg text-wwjd-text">Bring what's heavy</h3>
          <p className="text-sm text-wwjd-soft mt-1">Receive counsel from the words of Jesus.</p>
          <span className="inline-flex items-center gap-1 text-sm text-wwjd-terracotta mt-3 group-hover:gap-2 transition-all">Begin <ArrowRight size={14} /></span>
        </Link>
        <Link to="/diary" data-testid="dashboard-diary-link" className="group bg-white rounded-2xl border border-wwjd-line p-7 hover:border-wwjd-gold transition-colors">
          <BookOpen className="text-wwjd-gold mb-3" size={24} strokeWidth={1.5} />
          <h3 className="font-serif-display text-lg text-wwjd-text">Spiritual diary</h3>
          <p className="text-sm text-wwjd-soft mt-1">Record what you brought and how you walked it out.</p>
          <span className="inline-flex items-center gap-1 text-sm text-wwjd-terracotta mt-3 group-hover:gap-2 transition-all">Open <ArrowRight size={14} /></span>
        </Link>
        <Link to="/stories" data-testid="dashboard-stories-link" className="group bg-white rounded-2xl border border-wwjd-line p-7 hover:border-wwjd-gold transition-colors">
          <Sparkles className="text-wwjd-gold mb-3" size={24} strokeWidth={1.5} />
          <h3 className="font-serif-display text-lg text-wwjd-text">Stories of freedom</h3>
          <p className="text-sm text-wwjd-soft mt-1">See the fruit your gift helps to grow.</p>
          <span className="inline-flex items-center gap-1 text-sm text-wwjd-terracotta mt-3 group-hover:gap-2 transition-all">View <ArrowRight size={14} /></span>
        </Link>
        <Link to="/pay-it-forward" data-testid="dashboard-payforward-link" className="group bg-white rounded-2xl border border-wwjd-line p-7 hover:border-wwjd-gold transition-colors">
          <HandHeart className="text-wwjd-gold mb-3" size={24} strokeWidth={1.5} />
          <h3 className="font-serif-display text-lg text-wwjd-text">Give this gift</h3>
          <p className="text-sm text-wwjd-soft mt-1">Pass a month forward to someone struggling.</p>
          <span className="inline-flex items-center gap-1 text-sm text-wwjd-terracotta mt-3 group-hover:gap-2 transition-all">Give <ArrowRight size={14} /></span>
        </Link>
      </div>
    </div>
  );
}
