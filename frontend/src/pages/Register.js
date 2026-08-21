import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, formatApiErrorDetail } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Please choose a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/activate", { replace: true });
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-14 animate-fade" data-testid="register-page">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="md" />
        <h1 className="font-serif-display text-3xl text-wwjd-text mt-6">Create your account</h1>
        <p className="text-wwjd-soft mt-2 text-sm">A private, sacred space of your own.</p>
      </div>

      <form onSubmit={submit} className="space-y-5 bg-white rounded-2xl border border-wwjd-line p-7">
        <div>
          <label className="block text-sm text-wwjd-soft mb-2">Name</label>
          <Input
            data-testid="register-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-wwjd-soft mb-2">Email</label>
          <Input
            type="email"
            data-testid="register-email"
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
            data-testid="register-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
            required
          />
        </div>
        {error && <p className="text-sm text-wwjd-terracotta" data-testid="register-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          data-testid="register-submit"
          className="w-full py-3.5 rounded-full bg-wwjd-terracotta text-white font-medium hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin" size={18} />} Create account
        </button>
      </form>

      <p className="text-center text-sm text-wwjd-soft mt-6">
        Already have an account?{" "}
        <Link to="/login" data-testid="register-to-login" className="text-wwjd-terracotta">
          Sign in
        </Link>
      </p>
    </div>
  );
}
