import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, formatApiErrorDetail } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/app";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-14 animate-fade" data-testid="login-page">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="md" />
        <h1 className="font-serif-display text-3xl text-wwjd-text mt-6">Welcome back</h1>
        <p className="text-wwjd-soft mt-2 text-sm">Return to your quiet place.</p>
      </div>

      <form onSubmit={submit} className="space-y-5 bg-white rounded-2xl border border-wwjd-line p-7">
        <div>
          <label className="block text-sm text-wwjd-soft mb-2">Email</label>
          <Input
            type="email"
            data-testid="login-email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-wwjd-soft mb-2">Password</label>
          <Input
            type="password"
            data-testid="login-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
            required
          />
        </div>
        {error && <p className="text-sm text-wwjd-terracotta" data-testid="login-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          data-testid="login-submit"
          className="w-full py-3.5 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin" size={18} />} Sign in
        </button>
      </form>

      <p className="text-center text-sm text-wwjd-soft mt-6">
        New here?{" "}
        <Link to="/register" data-testid="login-to-register" className="text-wwjd-terracotta">
          Create an account
        </Link>
      </p>
    </div>
  );
}
