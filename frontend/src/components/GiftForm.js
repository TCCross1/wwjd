import React, { useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart } from "lucide-react";
import { toast } from "sonner";

// Reusable gift purchase form. Redirects to Stripe Checkout on submit.
// Primary contact is a mobile number so the giver can text the gift link.
export function GiftForm({ testidPrefix = "gift" }) {
  const [form, setForm] = useState({ recipient_name: "", recipient_phone: "", recipient_email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.recipient_name.trim()) {
      toast.error("Please add a name for the person you're giving to.");
      return;
    }
    if (!form.recipient_phone.trim() && !form.recipient_email.trim()) {
      toast.error("Add a mobile number (to text the link) or an email.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/gifts/checkout", {
        ...form,
        origin_url: window.location.origin,
      });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" data-testid={`${testidPrefix}-form`}>
      <div>
        <label className="block text-sm text-wwjd-soft mb-2">Their name</label>
        <Input
          data-testid={`${testidPrefix}-recipient-name`}
          value={form.recipient_name}
          onChange={(e) => setForm({ ...form, recipient_name: e.target.value })}
          placeholder="Someone who comes to mind"
          className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
        />
      </div>
      <div>
        <label className="block text-sm text-wwjd-soft mb-2">Their mobile number</label>
        <Input
          data-testid={`${testidPrefix}-recipient-phone`}
          type="tel"
          value={form.recipient_phone}
          onChange={(e) => setForm({ ...form, recipient_phone: e.target.value })}
          placeholder="(555) 123-4567"
          className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
        />
        <p className="text-xs text-wwjd-muted mt-1.5">
          After checkout you'll get a link to text them. They'll open it and set up their own login.
        </p>
      </div>
      <div>
        <label className="block text-sm text-wwjd-soft mb-2">Their email (optional)</label>
        <Input
          data-testid={`${testidPrefix}-recipient-email`}
          type="email"
          value={form.recipient_email}
          onChange={(e) => setForm({ ...form, recipient_email: e.target.value })}
          placeholder="name@email.com"
          className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
        />
      </div>
      <div>
        <label className="block text-sm text-wwjd-soft mb-2">A short note (optional)</label>
        <Textarea
          data-testid={`${testidPrefix}-message`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="I've been thinking of you…"
          rows={3}
          className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        data-testid={`${testidPrefix}-submit`}
        className="w-full py-4 rounded-full bg-wwjd-terracotta text-white font-medium tracking-wide hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Heart size={18} />}
        Give one month · $1
      </button>
      <p className="text-center text-xs text-wwjd-muted leading-relaxed">
        Every dollar goes to help free people still trapped in the grip of addiction.
      </p>
    </form>
  );
}

export default GiftForm;
