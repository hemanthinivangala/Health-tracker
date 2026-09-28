import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
  compact?: boolean;
}

export const MedicalDisclaimerBanner: React.FC<MedicalDisclaimerBannerProps> = ({ compact = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && compact) return null;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 text-xs text-teal-900 bg-teal-50/80 border border-teal-200/60 rounded-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>
            <strong>Wellness & Habit Monitor:</strong> For personal health tracking and habit building only. Not intended to diagnose, treat, cure, or replace clinical medical advice.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-teal-600 hover:text-teal-900 p-0.5 rounded transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-teal-50/90 border border-teal-200/70 rounded-2xl text-slate-700 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-teal-100/80 rounded-xl text-teal-800 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-semibold text-teal-950 flex items-center gap-1.5">
            Health & Wellness Information Disclaimer
          </p>
          <p className="text-slate-600 leading-relaxed">
            HealthTrack is designed exclusively for lifestyle, fitness, and daily habit tracking. This platform does not provide medical diagnoses, treatment plans, clinical prognosis, or emergency services. Always consult a licensed healthcare professional for medical questions, physical symptoms, or treatment decisions.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-teal-800">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Private On-Device Data Storage
            </span>
            <span aria-hidden="true">·</span>
            <span>No Automated Medical Judgments</span>
            <span aria-hidden="true">·</span>
            <span>User Controlled Data Deletion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
