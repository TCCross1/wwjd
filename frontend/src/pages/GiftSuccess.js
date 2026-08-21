import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { Loader2, Copy, Check, ArrowRight, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function GiftSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState("checking");
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

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
        const { data } = await api.get(`/payments/status/${sessionId}`);
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

  const activateLink = data ? `${window.location.origin}/activate?code=${data.activation_code}` : "";
  const smsBody = data
    ? `I'm giving you a gift — W.W.J.D., a quiet place to bring whatever is weighing on you and receive counsel drawn from the life and words of Jesus. Open it here and set up your login: ${activateLink}`
    : "";
  const smsHref = data
    ? `sms:${(data.recipient_phone || "").replace(/[^0-9+]/g, "")}?&body=${encodeURIComponent(smsBody)}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(activateLink);
    setCopied(true);
    toast.success("Gift link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 flex flex-col items-center text-center animate-fade" data-testid="gift-success-page">
      <Logo size="lg" />

      {status === "checking" && (
        <div className="mt-10 flex flex-col items-center gap-3 text-wwjd-soft" data-testid="gift-success-loading">
          <Loader2 className="animate-spin text-wwjd-gold" size={28} />
          <p>Confirming your gift…</p>
        </div>
      )}

      {status === "paid" && data && (
        <div className="mt-8 w-full">
          <h1 className="font-serif-display text-3xl sm:text-4xl text-wwjd-text">Your gift is ready to send</h1>
          <p className="mt-4 text-wwjd-soft leading-relaxed">
            Thank you. Your dollar now goes to help free someone from the grip of addiction. Send{" "}
            {data.recipient_name || "them"} the link below — they'll open it and set up their own login and password.
          </p>

          <div className="mt-8 bg-white/90 rounded-2xl border border-wwjd-line p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-wwjd-muted mb-4">Send by text</p>

            {smsHref && (
              <a
                href={smsHref}
                data-testid="send-sms-btn"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors"
              >
                <MessageSquare size={18} /> Text this gift to {data.recipient_name || "them"}
              </a>
            )}

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-wwjd-muted mb-2">Or copy the link</p>
              <div className="flex items-center gap-2 bg-wwjd-beige rounded-xl border border-wwjd-line px-4 py-3">
                <span className="text-sm text-wwjd-soft truncate flex-1 text-left" data-testid="gift-link">{activateLink}</span>
                <button onClick={copyLink} data-testid="copy-link-btn" className="text-wwjd-gold hover:text-wwjd-terracotta transition-colors shrink-0">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <p className="mt-5 text-sm text-wwjd-soft">
              Prefer a code? Share <span className="font-serif-display tracking-wide text-wwjd-text" data-testid="activation-code">{data.activation_code}</span> to redeem at{" "}
              <span className="text-wwjd-terracotta">{window.location.origin}/activate</span>
            </p>
          </div>

          <Link
            to="/stories"
            data-testid="gift-success-stories-link"
            className="inline-flex items-center gap-2 mt-8 text-wwjd-terracotta hover:gap-3 transition-all"
          >
            See the freedom your gift supports <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {(status === "pending" || status === "error") && (
        <div className="mt-10 text-wwjd-soft" data-testid="gift-success-pending">
          <h1 className="font-serif-display text-2xl text-wwjd-text mb-3">
            {status === "error" ? "We couldn't confirm this gift" : "Still processing"}
          </h1>
          <p className="max-w-md">
            {status === "error"
              ? "If you were charged, your gift link will still be created. Please check back shortly."
              : "Your payment is still being confirmed. This can take a moment."}
          </p>
          <Link to="/gift" className="inline-block mt-6 text-wwjd-terracotta" data-testid="gift-success-retry-link">
            Return to gift page
          </Link>
        </div>
      )}
    </div>
  );
}
