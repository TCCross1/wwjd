import React from "react";
import { Logo } from "@/components/Logo";
import { GiftForm } from "@/components/GiftForm";

export default function PayForward() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 animate-fade" data-testid="payforward-page">
      <div className="flex flex-col items-center text-center mb-8">
        <Logo size="lg" />
      </div>

      {/* Exact pay-it-forward message — verbatim */}
      <div className="bg-wwjd-beige rounded-2xl border border-wwjd-line p-8 sm:p-10" data-testid="payforward-message">
        <div className="scripture-text not-italic text-lg text-wwjd-text leading-[1.9] space-y-4">
          <p>Someone gave this to you.</p>
          <p>
            They wanted you to have a place where you can bring whatever is weighing on you and
            receive counsel drawn from the life and words of Jesus.
          </p>
          <p>Now you have the chance to do the same for someone else.</p>
          <p className="font-medium">Will you pass this gift forward?</p>
          <p>
            You can give one month of W.W.J.D. to another person for just $1. Every dollar goes to
            help free people still trapped in the grip of addiction.
          </p>
          <p>
            If someone comes to mind right now — a friend, a family member, a coworker, or anyone who
            is struggling — you can send it to them in the next moment.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-wwjd-line p-7 sm:p-9 mt-6">
        <h2 className="font-serif-display text-2xl text-wwjd-text mb-6 text-center">Give this gift to someone</h2>
        <GiftForm testidPrefix="payforward" />
      </div>
    </div>
  );
}
