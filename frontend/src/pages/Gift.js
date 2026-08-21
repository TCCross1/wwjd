import React from "react";
import { Logo } from "@/components/Logo";
import { GiftForm } from "@/components/GiftForm";

export default function Gift() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 animate-fade" data-testid="gift-page">
      <div className="flex flex-col items-center text-center mb-10">
        <Logo size="lg" />
        <h1 className="font-serif-display text-3xl sm:text-4xl text-wwjd-text mt-8">Give this gift</h1>
        <p className="mt-4 text-wwjd-soft max-w-md leading-relaxed">
          Give someone a place to bring whatever is weighing on them and receive counsel drawn from
          the life and words of Jesus. One month is just $1.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-wwjd-line p-7 sm:p-9">
        <GiftForm testidPrefix="gift" />
      </div>

      <p className="text-center text-sm text-wwjd-muted mt-8 leading-relaxed">
        All proceeds support people in addiction recovery. You'll receive an activation code to pass
        along after checkout.
      </p>
    </div>
  );
}
