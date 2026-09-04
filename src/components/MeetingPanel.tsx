"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { useMeetingEngine } from "@/lib/meeting/meeting-engine";
import { validateMeetingForm } from "@/lib/meeting/meeting-validator";
import type { MeetingFormData } from "@/lib/meeting/meeting-types";

interface MeetingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string;
}

// ── Timezones & country codes ─────────────────────────────────────────────────
const TIMEZONES = [
  "Asia/Kolkata","Asia/Dubai","Asia/Singapore","Asia/Tokyo",
  "Europe/London","Europe/Paris","Europe/Berlin","Europe/Moscow",
  "America/New_York","America/Chicago","America/Denver","America/Los_Angeles",
  "America/Toronto","America/Sao_Paulo",
  "Africa/Cairo","Africa/Nairobi",
  "Australia/Sydney","Pacific/Auckland",
];
const COUNTRY_CODES = [
  "+91 India","+1 USA/Canada","+44 UK","+61 Australia","+65 Singapore",
  "+971 UAE","+81 Japan","+49 Germany","+33 France","+7 Russia",
  "+55 Brazil","+27 South Africa","+234 Nigeria","+64 New Zealand",
  "+86 China","+82 South Korea","+92 Pakistan","+880 Bangladesh",
];

// ── Reusable Field wrapper ────────────────────────────────────────────────────
function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-white/55 uppercase tracking-[0.1em]">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="text-[10px] text-rose-400 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-xl px-3 py-2 text-xs sm:text-sm text-white/90 placeholder-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-colors";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };

function localDateInputValue(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONES.includes(timezone) ? timezone : "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

// ── MeetingPanel ──────────────────────────────────────────────────────────────
export function MeetingPanel({ isOpen, onClose, conversationId }: MeetingPanelProps) {
  const engine = useMeetingEngine(conversationId);
  const [showCancellation, setShowCancellation] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationError, setCancellationError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Open / restore session when panel opens
  useEffect(() => {
    if (isOpen && !engine.session && !engine.activeMeeting) engine.open();
  }, [isOpen, engine.session, engine.activeMeeting, engine.open]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const data = engine.data;
  const validationErrors = validateMeetingForm(data);
  const fieldError = (field: keyof MeetingFormData) => validationErrors.find((error) => error.field === field)?.message;
  const isValid = validationErrors.length === 0;
  const today = localDateInputValue(data.timezone ?? "UTC");

  function inp(field: keyof MeetingFormData) {
    return {
      value: (data[field] as string) ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        engine.setField(field, e.target.value),
    };
  }

  const handleSubmit = async () => {
    const errors = engine.validateCurrentStep();
    if (errors.length > 0) return;
    await engine.submit();
  };

  const handleClose = () => {
    onClose();
  };

  const handleCancellation = async () => {
    if (!cancellationReason.trim()) {
      setCancellationError("Please provide a reason for cancellation.");
      return;
    }
    setCancelling(true);
    setCancellationError(null);
    const result = await engine.cancelConfirmedMeeting(cancellationReason);
    setCancelling(false);
    if (!result.success) {
      setCancellationError(result.error ?? "Could not cancel the meeting.");
      return;
    }
    setShowCancellation(false);
    setCancellationReason("");
  };

  const confirmedMeeting = engine.activeMeeting;
  const showConfirmation = engine.submitSuccess || Boolean(confirmedMeeting);
  const confirmationMeetLink = confirmedMeeting?.meetLink || engine.meetLink;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[1035] bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            role="dialog" aria-label="Schedule a Meeting" aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[1040] inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-20 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-6rem)] flex flex-col"
            style={{
              backdropFilter: "blur(32px) saturate(200%)",
              background: "linear-gradient(160deg, rgba(16,16,36,0.97) 0%, rgba(8,8,22,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.11)",
              borderRadius: "22px",
              boxShadow: "0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.07] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,rgba(120,119,198,0.4),rgba(120,219,255,0.3))", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Calendar size={14} className="text-white/80" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white/95 tracking-tight">Schedule a Meeting</h2>
                  <p className="text-[10px] text-white/35 mt-0.5">with Prabhat Kumar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Progress badge */}
                {engine.completionPercent > 0 && !showConfirmation && (
                  <span className="text-[10px] tabular-nums text-white/40">
                    {engine.completionPercent}%
                  </span>
                )}
                <button onClick={handleClose} aria-label="Close"
                  className="w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Success state */}
            {showConfirmation ? (
              <div className="flex-grow flex flex-col items-center justify-center gap-4 px-5 py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,rgba(52,211,153,0.2),rgba(120,219,255,0.15))", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-white/90 mb-1">Meeting Request Confirmed</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed max-w-xs">
                    Your meeting has been added to the calendar. Check your email for confirmation.
                  </p>
                </div>
                {confirmationMeetLink && (
                  <a
                    href={confirmationMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    style={{ background: "linear-gradient(135deg,rgba(52,211,153,0.3),rgba(120,219,255,0.25))", border: "1px solid rgba(52,211,153,0.3)" }}
                  >
                    <span>🎥</span> Join Google Meet
                  </a>
                )}
                <button onClick={() => setShowCancellation(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-200 hover:text-white hover:bg-rose-500/10 transition-colors border border-rose-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                  Cancel Meeting
                </button>
                <button onClick={handleClose}
                  className="mt-1 px-5 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable form */}
                <div className="overflow-y-auto flex-grow px-5 py-4">
                  {engine.submitError && (
                    <div className="mb-4 rounded-xl px-4 py-3 text-[11px] text-rose-400"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      {engine.submitError}
                    </div>
                  )}
                  {engine.conflictMessage && (
                    <div className="mb-4 rounded-xl px-4 py-3 text-[11px] text-amber-400"
                      style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
                      <span className="font-semibold">Time conflict: </span>{engine.conflictMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="First Name" required error={fieldError("firstName")}>
                      <input className={inputCls} style={inputStyle} placeholder="John" {...inp("firstName")} />
                    </Field>
                    <Field label="Last Name" required error={fieldError("lastName")}>
                      <input className={inputCls} style={inputStyle} placeholder="Smith" {...inp("lastName")} />
                    </Field>
                    <Field label="Email" required error={fieldError("email")}>
                      <input className={inputCls} style={inputStyle} type="email" placeholder="john@company.com" {...inp("email")} />
                    </Field>
                    <Field label="Phone" required error={fieldError("phone") ?? fieldError("countryCode")}>
                      <div className="flex flex-col min-[380px]:flex-row gap-2">
                        <select
                          className="rounded-xl px-2 py-2 text-xs text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-colors flex-shrink-0 w-full min-[380px]:w-28"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                          value={data.countryCode ?? ""}
                          onChange={(e) => engine.setField("countryCode", e.target.value)}
                          aria-label="Country code"
                        >
                          <option value="" disabled>Code</option>
                          {COUNTRY_CODES.map((c) => {
                            const code = c.split(" ")[0];
                            return <option key={c} value={code}>{c}</option>;
                          })}
                        </select>
                        <input className={inputCls + " min-w-0"} style={inputStyle} type="tel" placeholder="9876543210" {...inp("phone")} />
                      </div>
                    </Field>
                    <Field label="Company">
                      <input className={inputCls} style={inputStyle} placeholder="Acme Inc. (optional)" {...inp("company")} />
                    </Field>
                    <Field label="Your Role">
                      <input className={inputCls} style={inputStyle} placeholder="e.g. CTO, Founder (optional)" {...inp("role")} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Reason for Meeting" required error={fieldError("reasonForMeeting")}>
                        <textarea className={inputCls + " resize-none"} style={inputStyle} rows={3}
                          placeholder="Briefly describe what you'd like to discuss..." {...inp("reasonForMeeting")} />
                      </Field>
                    </div>
                    <Field label="Preferred Date" required error={fieldError("preferredDate")}>
                      <input className={inputCls} style={inputStyle} type="date" min={today} {...inp("preferredDate")} />
                    </Field>
                    <Field label="Preferred Time" required error={fieldError("preferredTime")}>
                      <input className={inputCls} style={inputStyle} type="time" {...inp("preferredTime")} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Timezone" required error={fieldError("timezone")}>
                        <select className={inputCls} style={inputStyle}
                          value={data.timezone ?? ""}
                          onChange={(e) => engine.setField("timezone", e.target.value)}>
                          <option value="" disabled>Select timezone</option>
                          {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Additional Notes">
                        <textarea className={inputCls + " resize-none"} style={inputStyle} rows={2}
                          placeholder="Anything else? (optional)" {...inp("additionalNotes")} />
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-white/[0.07] flex-shrink-0 flex items-center justify-between gap-3">
                  <button onClick={() => { engine.cancel(); handleClose(); }}
                    className="text-[11px] text-white/30 hover:text-white/60 transition-colors focus:outline-none focus-visible:underline">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || engine.submitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 flex items-center gap-1.5 disabled:opacity-60"
                    style={{
                      background: isValid
                        ? "linear-gradient(135deg,rgba(120,119,198,0.8),rgba(120,219,255,0.6))"
                        : "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: isValid ? "#fff" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {engine.submitting ? (
                      <><Loader2 size={12} className="animate-spin" />Saving...</>
                    ) : (
                      <><CheckCircle2 size={12} />{isValid ? "Save Request" : "Fill Required Fields"}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {showCancellation && (
            <motion.div
              role="dialog" aria-modal="true" aria-label="Cancel meeting"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="fixed z-[1050] inset-x-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bottom-6 sm:bottom-24 rounded-[22px] px-5 py-5"
              style={{ backdropFilter: "blur(32px) saturate(200%)", background: "linear-gradient(160deg, rgba(16,16,36,0.98), rgba(8,8,22,0.99))", border: "1px solid rgba(255,255,255,0.11)", boxShadow: "0 40px 100px rgba(0,0,0,0.65)" }}
            >
              <h3 className="text-sm font-semibold text-white/90">Cancel this meeting?</h3>
              <p className="mt-1 text-[11px] text-white/45">This removes the event from Google Calendar and notifies both attendees.</p>
              <label className="block mt-4 text-[11px] font-semibold text-white/55 uppercase tracking-[0.1em]">Reason <span className="text-rose-400">*</span></label>
              <textarea value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} rows={3}
                placeholder="e.g. Schedule conflict" className={inputCls + " mt-1 resize-none"} style={inputStyle} />
              {cancellationError && <p role="alert" className="mt-2 text-[11px] text-rose-400">{cancellationError}</p>}
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => { setShowCancellation(false); setCancellationError(null); }} disabled={cancelling}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/75 hover:text-white hover:bg-white/10 border border-white/10">Keep Meeting</button>
                <button onClick={handleCancellation} disabled={cancelling}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-60" style={{ background: "rgba(239,68,68,0.22)", border: "1px solid rgba(248,113,113,0.35)" }}>
                  {cancelling ? "Cancelling…" : "Cancel Meeting"}
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
