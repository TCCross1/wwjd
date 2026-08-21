import React, { useEffect, useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { AngelBadge } from "@/components/AngelBadge";
import { Input } from "@/components/ui/input";
import { Loader2, HandHeart } from "lucide-react";
import { toast } from "sonner";

const PRESETS = [5, 10, 25, 50];

export default function Donate() {
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [angels, setAngels] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get("/angels").then(({ data }) => {
      setAngels(data.angels || []);
      setTotal(data.total || 0);
    }).catch(() => {});
  }, []);

  const effectiveAmount = custom ? parseFloat(custom) : amount;

  const give = async () => {
    const amt = custom ? parseFloat(custom) : amount;
    if (!amt || amt < 1) {
      toast.error("The smallest gift is $1.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/donations/checkout", {
        amount: amt,
        name: name.trim(),
        origin_url: window.location.origin,
      });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 animate-fade" data-testid="donate-page">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="md" />
        <h1 className="font-serif-display text-3xl sm:text-4xl text-wwjd-text mt-6">Help set someone free</h1>
        <p className="mt-4 text-wwjd-soft max-w-md leading-relaxed">
          Give a gift of any size to help people suffering from the stranglehold of addiction. Every
          dollar goes to that work. &ldquo;It is more blessed to give than to receive.&rdquo; (Acts 20:35)
        </p>
      </div>

      <div className="bg-white/90 rounded-2xl border border-wwjd-line p-7 sm:p-9">
        <p className="text-sm text-wwjd-soft mb-3">Choose an amount</p>
        <div className="grid grid-cols-4 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => { setAmount(p); setCustom(""); }}
              data-testid={`donate-preset-${p}`}
              className={`py-4 rounded-xl border font-serif-display text-lg transition-colors ${
                !custom && amount === p
                  ? "border-wwjd-gold bg-wwjd-beige text-wwjd-text"
                  : "border-wwjd-line bg-white text-wwjd-soft hover:border-wwjd-gold"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm text-wwjd-soft mb-2">Or enter your own amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-wwjd-soft">$</span>
            <Input
              data-testid="donate-custom-amount"
              type="number"
              min="1"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Any amount"
              className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12 pl-8"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-wwjd-soft mb-2">Your name (optional — for the wall of angels)</label>
          <Input
            data-testid="donate-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="How you'd like to be remembered"
            className="bg-white border-wwjd-line focus-visible:ring-wwjd-gold h-12"
          />
        </div>

        <button
          onClick={give}
          disabled={loading}
          data-testid="donate-submit"
          className="w-full mt-6 py-4 rounded-full bg-wwjd-terracotta text-white font-medium tracking-wide hover:bg-[#a04e35] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <HandHeart size={18} />}
          Give {effectiveAmount && effectiveAmount >= 1 ? `$${effectiveAmount}` : ""}
        </button>
        <p className="text-center text-xs text-wwjd-muted mt-4">
          Every donor receives a blessing — and a place among the angels below.
        </p>
      </div>

      {/* Wall of angels */}
      <div className="mt-12">
        <div className="text-center mb-6">
          <h2 className="font-serif-display text-2xl text-wwjd-text">Our angels of freedom</h2>
          <p className="text-sm text-wwjd-soft mt-1">
            {total > 0 ? `${total} generous ${total === 1 ? "soul has" : "souls have"} given so far.` : "Be the first to give."}
          </p>
        </div>
        {angels.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6" data-testid="angels-wall">
            {angels.slice(0, 24).map((a, i) => (
              <AngelBadge key={i} size={72} name={a.name} testid={`angel-${i}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
