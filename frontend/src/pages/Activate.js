import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Activate() {
  const { user, setUser, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefillCode = (params.get("code") || "").toUpperCase();

  const [code, setCode] = useState(prefillCode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const attempted = useRef(false);

  const authed = user && typeof user === "object";

  const doActivate = async (activationCode) => {
    const { data } = await api.post("/gifts/activate", { activation_code: activationCode });
    setUser(data.user);
    toast.success("Your gift is now active.");
    navigate("/app", { replace: true });
  };

  // If the recipient arrives already signed in with a code in the link, activate automatically.
  useEffect(() => {
    if (authed && prefillCode && !attempted.current) {
      attempted.current = true;
      setLoading(true);
      doActivate(prefillCode).catch((err) => {
        setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, prefillCode]);

  const submitAuthed = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await doActivate(code);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  const submitNewAccount = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Please choose a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      await doActivate(code);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-14 animate-fade" data-testid="activate-page">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="lg" />
        <h1 className="font-serif-display text-3xl text-wwjd-text mt-8">Someone gave this to you</h1>
        <p className="text-wwjd-soft mt-4 leading-relaxed">
          They wanted you to have a place where you can bring whatever is weighing on you and receive
          counsel drawn from the life and words of Jesus. Set up your own login below to begin.
        </p>
      </div>

      {authed ? (
        <form onSubmit={submitAuthed} className="space-y-5 bg-white/90 rounded-2xl border border-wwjd-line p-7" data-testid="activate-authed-form">
          <div>
            <label className="block text-sm text-wwjd-soft mb-2">Activation code</label>
            <Input
              data-testid="activate-code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="WWJD-XXXXXX"
              className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12 tracking-wider font-serif-display text-lg"
              required
            />
          </div>
          {error && <p className="text-sm text-wwjd-terracotta" data-testid="activate-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            data-testid="activate-submit"
            className="w-full py-3.5 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={18} />} Activate my gift
          </button>
        </form>
      ) : (
        <form onSubmit={submitNewAccount} className="space-y-4 bg-white/90 rounded-2xl border border-wwjd-line p-7" data-testid="activate-newaccount-form">
          <p className="text-sm text-wwjd-soft">Create your private account:</p>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Your name</label>
            <Input data-testid="activate-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12" required />
          </div>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Email</label>
            <Input data-testid="activate-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12" required />
          </div>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Choose a password</label>
            <Input data-testid="activate-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12" required />
          </div>
          <div>
            <label className="block text-sm text-wwjd-soft mb-1.5">Activation code</label>
            <Input
              data-testid="activate-code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="WWJD-XXXXXX"
              className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12 tracking-wider font-serif-display text-lg"
              required
            />
          </div>
          {error && <p className="text-sm text-wwjd-terracotta" data-testid="activate-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            data-testid="activate-create-submit"
            className="w-full py-3.5 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={18} />} Create account & activate
          </button>
          <p className="text-center text-sm text-wwjd-soft">
            Already have an account?{" "}
            <Link to="/login" state={{ from: `/activate?code=${code}` }} className="text-wwjd-terracotta" data-testid="activate-login-link">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
