import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  KeyRound,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile } from '../types/health';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: (jsonText: string) => boolean;
  onResetData: () => void;
  onClearAllData: () => void;
  privacyMaskActive: boolean;
  onTogglePrivacyMask: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onExportJson,
  onExportCsv,
  onImportJson,
  onResetData,
  onClearAllData,
  privacyMaskActive,
  onTogglePrivacyMask,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportJson(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
        } else {
          setImportStatus('Failed to parse backup JSON file.');
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Account & Confidentiality</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Profile & Privacy Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your personal baseline, habit targets, and private data retention.
          </p>
        </div>

        {/* Quick privacy shield button */}
        <button
          onClick={onTogglePrivacyMask}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors self-start sm:self-auto ${
            privacyMaskActive
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Mask or unmask sensitive numbers when viewing screen in public"
        >
          {privacyMaskActive ? (
            <>
              <EyeOff className="w-4 h-4 text-amber-700" />
              <span>Privacy Shield: Active (Hidden)</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Enable Privacy Shield</span>
            </>
          )}
        </button>
      </div>

      {/* Safety & Medical Disclaimer Callout */}
      <MedicalDisclaimerBanner />

      {/* Main Profile & Goals Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Basic Health Profile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your physiological details remain strictly local in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Age
            </label>
            <input
              type="number"
              min="1"
              max="125"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gender / Sex
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 bg-white"
            >
              <option value="non-binary">Non-binary</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Height (cm)
            </label>
            <input
              type="number"
              step="1"
              value={formData.height}
              onChange={(e) => handleChange('height', parseFloat(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              required
            />
          </div>
        </div>

        {/* Customizable Daily Targets */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Customizable Daily Habit Targets
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust your goals anytime as your wellness routines evolve.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Step Target
              </label>
              <input
                type="number"
                step="500"
                value={formData.dailyStepGoal}
                onChange={(e) => handleChange('dailyStepGoal', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Recommended: 7,000 - 10,000</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Water Target (ml)
              </label>
              <input
                type="number"
                step="100"
                value={formData.dailyWaterGoal}
                onChange={(e) => handleChange('dailyWaterGoal', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Recommended: 2,000 - 3,000 ml</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sleep Target (hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.dailySleepGoal}
                onChange={(e) => handleChange('dailySleepGoal', parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Recommended: 7.0 - 9.0 hrs</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exercise Target (min)
              </label>
              <input
                type="number"
                step="5"
                value={formData.dailyExerciseGoal}
                onChange={(e) => handleChange('dailyExerciseGoal', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Recommended: 20 - 45 min</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully.
              </span>
            ) : (
              'Changes update your daily dashboard thresholds immediately.'
            )}
          </span>

          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all"
          >
            Save Profile & Targets
          </button>
        </div>
      </form>

      {/* Privacy, Storage, and Data Sovereignty Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Data Sovereignty & Privacy Controls
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            HealthTrack is structured to guarantee that your personal wellness records remain entirely under your control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* JSON Export */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <FileCode className="w-4 h-4 text-teal-700" />
                <span>Export Full Backup (JSON)</span>
              </div>
              <p className="text-xs text-slate-600">
                Download your complete profile, journals, reminders, and goals in open JSON format.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportJson}
              className="mt-4 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* CSV Export */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Export Spreadsheet (CSV)</span>
              </div>
              <p className="text-xs text-slate-600">
                Generate a clean CSV spreadsheet with all dates, steps, water, sleep, and vitals.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportCsv}
              className="mt-4 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                <Upload className="w-4 h-4 text-sky-700" />
                <span>Restore Backup File</span>
              </div>
              <p className="text-xs text-slate-600">
                Upload a previously saved HealthTrack JSON file to restore your historical entries.
              </p>
            </div>
            <label className="mt-4 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs font-semibold text-teal-900">
            {importStatus}
          </div>
        )}

        {/* Architecture & Backend Ready Note */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-teal-700" />
            <span>Extensible Architecture for Cloud Authentication & Database</span>
          </div>
          <p>
            HealthTrack is structured with an isolated repository pattern (`storageService`). Cloud authentication (such as Google OAuth or Firebase Auth) and remote database sync (Firestore or PostgreSQL) can be activated seamlessly without rewriting UI state logic.
          </p>
        </div>

        {/* Danger Zone: Reset & Clear Data */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Reset or Purge Data
            </h4>
            <p className="text-xs text-slate-500">
              Restore default sample datasets or permanently delete all recorded entries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetData}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Data</span>
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Modal for Clearing All Data */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Permanently Delete All Health Data?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                This action will wipe all your recorded logs, goals, check-ins, and reminders from this browser. This cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                Keep My Data
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAllData();
                  setShowClearModal(false);
                }}
                className="px-4 py-2 text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
