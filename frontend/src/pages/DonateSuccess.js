import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { AngelBadge } from "@/components/AngelBadge";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function DonateSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("checking");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    let attempts = 0;
    let timer;
    const poll = async () => {
      attempts += 1;
      try {
        const { data } = await api.get(`/donations/status/${sessionId}`);
        if (data.payment_status === "paid") {
          setData(data);
          setStatus("paid");
          return;
        }
        if (data.payment_status === "failed" || data.payment_status === "expired") {
          setStatus("error");
          return;
        }
      } catch (e) {
        /* keep polling */
      }
      if (attempts >= 15) {
        setStatus("pending");
        return;
      }
      timer = setTimeout(poll, 2000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 flex flex-col items-center text-center animate-fade" data-testid="donate-success-page">
      <Logo size="md" />

      {status === "checking" && (
        <div className="mt-10 flex flex-col items-center gap-3 text-wwjd-soft" data-testid="donate-success-loading">
          <Loader2 className="animate-spin text-wwjd-gold" size={28} />
          <p>Receiving your gift…</p>
        </div>
      )}

      {status === "paid" && data && (
        <div className="mt-8 w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <AngelBadge size={140} testid="donate-success-badge" />
          </motion.div>

          <h1 className="font-serif-display text-3xl sm:text-4xl text-wwjd-text mt-4">
            Thank you, {data.donor_name || "friend"}
          </h1>
          <p className="mt-3 text-wwjd-soft">
            You are now among the angels of freedom. Your gift of ${data.amount} goes to help set
            someone free from the grip of addiction.
          </p>

          {data.blessing && (
            <div className="mt-8 bg-wwjd-beige rounded-2xl border border-wwjd-line p-8 w-full" data-testid="donate-blessing">
              <p className="text-xs uppercase tracking-[0.2em] text-wwjd-muted mb-4">A blessing over you</p>
              <p className="scripture-text text-xl sm:text-2xl text-wwjd-text leading-relaxed">
                &ldquo;{data.blessing.quote}&rdquo;
              </p>
              <p className="mt-3 text-sm text-wwjd-gold font-medium">{data.blessing.reference}</p>
            </div>
          )}

          <Link
            to="/donate"
            data-testid="donate-success-wall-link"
            className="inline-flex items-center gap-2 mt-8 text-wwjd-terracotta hover:gap-3 transition-all"
          >
            See the wall of angels <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {(status === "pending" || status === "error") && (
        <div className="mt-10 text-wwjd-soft" data-testid="donate-success-pending">
          <h1 className="font-serif-display text-2xl text-wwjd-text mb-3">
            {status === "error" ? "We couldn't confirm your gift" : "Still processing"}
          </h1>
          <p className="max-w-md">Please check back shortly. If you were charged, your gift has been received.</p>
          <Link to="/donate" className="inline-block mt-6 text-wwjd-terracotta" data-testid="donate-success-retry-link">
            Return to the donation page
          </Link>
        </div>
      )}
    </div>
  );
}
