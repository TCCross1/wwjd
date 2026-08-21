import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowRight, HandHeart, BookOpen, MessageCircleHeart } from "lucide-react";

export default function Landing() {
  const [scripture, setScripture] = useState(null);

  useEffect(() => {
    api.get("/scripture/daily").then(({ data }) => setScripture(data)).catch(() => {});
  }, []);

  return (
    <div className="animate-fade">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 pb-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Logo size="xl" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 max-w-xl scripture-text text-xl sm:text-2xl text-wwjd-soft"
          data-testid="landing-tagline"
        >
          A quiet place to bring whatever is weighing on you — and receive counsel drawn
          from the life and words of Jesus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/gift"
            data-testid="landing-give-gift-btn"
            className="px-8 py-4 rounded-full bg-wwjd-terracotta text-white font-medium tracking-wide hover:bg-[#a04e35] transition-colors flex items-center gap-2"
          >
            <HandHeart size={18} /> Give this gift · $1/month
          </Link>
          <Link
            to="/activate"
            data-testid="landing-activate-link"
            className="px-8 py-4 rounded-full border border-wwjd-line text-wwjd-text hover:border-wwjd-gold transition-colors"
          >
            I received a gift
          </Link>
        </motion.div>
      </section>

      {/* Daily scripture preview */}
      {scripture && (
        <section className="max-w-2xl mx-auto px-5 sm:px-8 pb-16">
          <div className="bg-wwjd-beige rounded-2xl border border-wwjd-line p-8 sm:p-10" data-testid="landing-scripture-card">
            <p className="text-xs uppercase tracking-[0.2em] text-wwjd-muted mb-4">A word from Jesus today</p>
            <p className="scripture-text text-xl sm:text-2xl text-wwjd-text leading-relaxed">
              &ldquo;{scripture.quote}&rdquo;
            </p>
            <p className="mt-3 text-sm text-wwjd-gold font-medium">{scripture.reference}</p>
            <p className="mt-5 text-wwjd-soft leading-relaxed">{scripture.invitation}</p>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: MessageCircleHeart, title: "Bring what's heavy", text: "Fears, decisions, resentments, or quiet thoughts. Nothing is too small or too much." },
            { icon: BookOpen, title: "Receive his counsel", text: "Every response is grounded in the recorded words and actions of Jesus in the Gospels." },
            { icon: HandHeart, title: "Pass it forward", text: "When it has helped you, give a month to someone else for just $1." },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-wwjd-line p-7" data-testid={`landing-step-${i}`}>
              <c.icon className="text-wwjd-gold mb-4" size={26} strokeWidth={1.5} />
              <h3 className="font-serif-display text-lg text-wwjd-text mb-2">{c.title}</h3>
              <p className="text-sm text-wwjd-soft leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-20 text-center">
        <div className="border-t border-wwjd-line pt-12">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-wwjd-text mb-4">Given, not sold</h2>
          <p className="text-wwjd-soft leading-relaxed max-w-xl mx-auto">
            W.W.J.D. is meant to be given as a gift. It is just $1 a month, and every dollar — after
            payment processing — goes to help people suffering from the stranglehold of addiction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              to="/stories"
              data-testid="landing-stories-link"
              className="inline-flex items-center gap-2 text-wwjd-terracotta hover:gap-3 transition-all"
            >
              See stories of freedom <ArrowRight size={16} />
            </Link>
            <Link
              to="/donate"
              data-testid="landing-donate-link"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-wwjd-line text-wwjd-text hover:border-wwjd-gold transition-colors"
            >
              Donate to the recovery fund
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
