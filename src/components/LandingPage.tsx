import React from 'react';
import {
  HeartPulse,
  Activity,
  Droplets,
  Moon,
  ShieldCheck,
  Lock,
  LineChart,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreMetrics: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreMetrics,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-10">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Everyday Wellness & Habit Tracking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 text-balance leading-[1.15]">
            Understand your health.{' '}
            <span className="text-teal-700 block sm:inline">Build better habits.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            HealthTrack unites your daily steps, sleep quality, hydration, heart rate, and mindful check-ins into one peaceful, private dashboard. Designed for holistic balance, without algorithmic noise or commercial tracking.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreMetrics}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Explore Metrics & Trends
            </button>
          </div>

          {/* Privacy Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              100% Private On-Device Storage
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              No Ad Tracking or Third-Party Resale
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              Non-Diagnostic Wellness Focus
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Live Preview Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Live Interactive Preview
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Today’s Wellness Balance at a Glance
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              Sample snapshot · Updated real-time
            </div>
          </div>

          {/* Mini preview metric grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
              <div className="flex items-center justify-between text-teal-700 mb-2">
                <span className="text-xs font-semibold">Steps</span>
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">8,940</div>
              <div className="text-[11px] text-teal-800 font-medium mt-1">105% of 8,500 daily goal</div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              <div className="flex items-center justify-between text-sky-700 mb-2">
                <span className="text-xs font-semibold">Water Intake</span>
                <Droplets className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">1,800 <span className="text-xs font-normal text-slate-500">ml</span></div>
              <div className="text-[11px] text-sky-800 font-medium mt-1">75% of 2,400 ml goal</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center justify-between text-indigo-700 mb-2">
                <span className="text-xs font-semibold">Sleep Duration</span>
                <Moon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">7.8 <span className="text-xs font-normal text-slate-500">hrs</span></div>
              <div className="text-[11px] text-indigo-800 font-medium mt-1">Restful · Good quality</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center justify-between text-rose-700 mb-2">
                <span className="text-xs font-semibold">Heart Rate</span>
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">68 <span className="text-xs font-normal text-slate-500">bpm</span></div>
              <div className="text-[11px] text-rose-800 font-medium mt-1">Calm resting pace</div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              <strong>Wellness Habit Index: 88%</strong> · 4 of 4 primary habits logged today.
            </span>
            <button
              onClick={onGetStarted}
              className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1 self-start sm:self-auto"
            >
              Open Active Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Everything you need for sustainable wellness
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Built from the ground up to encourage calm consistency rather than burnout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">8 Key Wellness Metrics</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Track weight, height, resting heart rate, blood pressure, sleep, water, steps, and workout minutes with automatic BMI calculations.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Weekly & Monthly Charts</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Visualize longitudinal patterns, spot hydration dips, observe rest cycles, and review 7, 14, and 30-day running averages effortlessly.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Customizable Habit Goals</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Set comfortable targets for daily movement, water bottles, and bedtimes. Celebrate consistency streaks with non-competitive milestone badges.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Daily Mindful Check-in</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Record energy levels, mood states, sleep quality, and personal thoughts to connect emotional wellbeing with physical routines.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Privacy-First Architecture</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your health logs belong to you. Health data never leaves your browser unless you export it as JSON or CSV. No tracking cookies or surveillance.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Safe, Non-Alarmist Guidance</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Clear boundaries distinguishing wellness habit support from medical diagnosis. Built to reassure and motivate without clinical panic.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Medical Disclaimer Section */}
      <section className="max-w-5xl mx-auto px-4">
        <MedicalDisclaimerBanner />
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-teal-800 to-slate-900 text-white shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to track your everyday wellness?
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Begin with your first check-in or explore the pre-loaded sample logs to see how HealthTrack organizes your daily vitality.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
            >
              Open Health Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
