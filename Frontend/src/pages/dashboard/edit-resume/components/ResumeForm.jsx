import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import ResearchPapers from "./form-components/ResearchPapers";
import Certifications from "./form-components/Certifications";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";
import { updateThisResume, analyzeResumeAts } from "@/Services/resumeAPI";
import { toast } from "sonner";

// ── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { label: "Personal",   shortLabel: "1" },
  { label: "Summary",    shortLabel: "2" },
  { label: "Experience", shortLabel: "3" },
  { label: "Projects",   shortLabel: "4" },
  { label: "Research",   shortLabel: "5" },
  { label: "Education",  shortLabel: "6" },
  { label: "Skills",     shortLabel: "7" },
  { label: "Certs",      shortLabel: "8" },
  { label: "ATS Score",  shortLabel: "9", special: true },
];

const LAST_FORM_STEP = 7; // index of "Certs"
const ATS_STEP       = 8; // index of "ATS Score"

// ── Inline ATS Score Panel ────────────────────────────────────────────────────
function ATSPanel({ resumeInfo, resume_id, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);
  const [error, setError]   = useState(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setAtsData(null);
    try {
      const payload = {
        skills:         resumeInfo?.skills           || [],
        projects:       resumeInfo?.projects          || [],
        researchPapers: resumeInfo?.researchPapers    || [],
        certifications: resumeInfo?.certifications    || [],
        experience:     resumeInfo?.experience        || [],
      };
      const response = await analyzeResumeAts(payload);
      if (response.success) {
        setAtsData(response.data);
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-analyze when this panel mounts
  useEffect(() => { analyze(); }, []);

  const { atsScore, analysis, suggestions } = atsData || {};

  // Colour thresholds
  let scoreColor = "#ef4444";
  let scoreBg    = "from-red-500 to-orange-500";
  let scoreLabel = "Needs Work";
  if (atsScore >= 80) { scoreColor = "#22c55e"; scoreBg = "from-emerald-500 to-teal-500"; scoreLabel = "Excellent!"; }
  else if (atsScore >= 60) { scoreColor = "#eab308"; scoreBg = "from-yellow-400 to-orange-400"; scoreLabel = "Good";  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            ATS Compatibility Score
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            How well your resume passes Applicant Tracking Systems
          </p>
        </div>
        {!loading && (
          <button
            onClick={analyze}
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-7 h-7 text-purple-600" />
          </div>
          <p className="text-gray-500 text-sm animate-pulse">Analyzing your resume for ATS compatibility…</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={analyze}
            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {atsData && !loading && (
        <div className="space-y-5">
          {/* Score card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {/* Circular score */}
            <div className="relative flex-shrink-0">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - atsScore / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-gray-800">{atsScore}</span>
                <span className="text-xs text-gray-400 font-medium">/100</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${scoreBg} mb-2`}>
                {scoreLabel}
              </span>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                {atsScore >= 80
                  ? "Excellent! Your resume is highly optimized and will pass most ATS filters."
                  : atsScore >= 60
                  ? "Good start — a few improvements can significantly boost your callback rate."
                  : "Your resume needs structural improvements to pass ATS systems effectively."}
              </p>
            </div>
          </div>

          {/* Structural Insights */}
          {analysis && Object.keys(analysis).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                <TrendingUp className="w-4 h-4 text-purple-500" /> Structural Insights
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(analysis).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <div className="text-xs text-gray-400 font-semibold capitalize mb-1">{key}</div>
                    <div className="text-base font-bold text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-5 shadow-sm">
              <h3 className="font-extrabold text-orange-700 flex items-center gap-2 mb-4 text-base">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                Areas to Improve
              </h3>
              <ul className="space-y-3">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-orange-200 rounded-xl px-4 py-3 shadow-sm">
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-orange-900 font-medium text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Finish button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onFinish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl
                         bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                         text-white shadow-md hover:shadow-purple-200 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" /> View & Download Resume
            </button>
            <Link
              to={`/dashboard/resume/${resume_id}/ats`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl
                         border border-purple-200 text-purple-600 hover:bg-purple-50 transition-all"
            >
              Full ATS Report
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── ResumeForm ────────────────────────────────────────────────────────────────
function ResumeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const navigate = useNavigate();
  const { resume_id } = useParams();

  useEffect(() => {
    setEnabledPrev(currentIndex > 0);
    setEnabledNext(currentIndex < LAST_FORM_STEP);
  }, [currentIndex]);

  const progress = Math.round(((currentIndex + 1) / STEPS.length) * 100);

  const isLastFormStep = currentIndex === LAST_FORM_STEP;
  const isAtsStep      = currentIndex === ATS_STEP;

  // Save resume & advance to ATS step
  const handleSaveAndAnalyze = () => {
    setIsSaving(true);
    const { _id, user, __v, createdAt, updatedAt, ...restData } = resumeInfo;
    updateThisResume(resume_id, { data: restData })
      .then(() => {
        setCurrentIndex(ATS_STEP);
        toast.success("Resume saved! Running ATS analysis…");
      })
      .catch((error) => toast.error("Error saving resume: " + error.message))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
      {/* ── Top toolbar ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <button
              title="Back to Dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </Link>
          <ThemeColor resumeInfo={resumeInfo} />
        </div>

        {/* Prev / Next / Save & Analyze buttons */}
        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button
              disabled={!enanbledPrev}
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl
                         border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Prev
            </button>
          )}

          {/* ATS step: no Next button */}
          {!isAtsStep && (
            <>
              {isLastFormStep ? (
                // "Save & Get ATS Score" on the Certifications step
                <button
                  disabled={isSaving}
                  onClick={handleSaveAndAnalyze}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl
                             bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700
                             text-white shadow-sm hover:shadow-purple-200 hover:shadow-md
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Save & ATS Score</>
                  )}
                </button>
              ) : (
                // Normal Next
                <button
                  disabled={!enanbledNext}
                  onClick={() => currentIndex < LAST_FORM_STEP && setCurrentIndex(currentIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl
                             bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                             text-white shadow-sm hover:shadow-purple-200 hover:shadow-md
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Step {currentIndex + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-semibold text-purple-600">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── Step pill tabs ── */}
      <div className="px-5 pt-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
        {STEPS.map((step, i) => (
          <button
            key={i}
            onClick={() => i <= currentIndex && setCurrentIndex(i)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              i === currentIndex
                ? step.special
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : i < currentIndex
                ? "bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 cursor-pointer"
                : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-default"
            }`}
          >
            <span className="hidden sm:inline">{step.label}</span>
            <span className="sm:hidden">{step.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* ── Step content ── */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          {currentIndex === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <PersonalDetails resumeInfo={resumeInfo} enanbledNext={setEnabledNext} />
            </motion.div>
          )}
          {currentIndex === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <Summary resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </motion.div>
          )}
          {currentIndex === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <Experience resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </motion.div>
          )}
          {currentIndex === 3 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <Project resumeInfo={resumeInfo} setEnabledNext={setEnabledNext} setEnabledPrev={setEnabledPrev} />
            </motion.div>
          )}
          {currentIndex === 4 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <ResearchPapers resumeInfo={resumeInfo} setEnabledNext={setEnabledNext} setEnabledPrev={setEnabledPrev} />
            </motion.div>
          )}
          {currentIndex === 5 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <Education resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enabledPrev={setEnabledPrev} />
            </motion.div>
          )}
          {currentIndex === 6 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <Skills resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledNext} />
            </motion.div>
          )}
          {currentIndex === 7 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full px-2 pb-6">
              <Certifications resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </motion.div>
          )}
          {currentIndex === 8 && (
            <motion.div key="step9" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="w-full">
              <ATSPanel
                resumeInfo={resumeInfo}
                resume_id={resume_id}
                onFinish={() => navigate(`/dashboard/view-resume/${resume_id}`)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ResumeForm;
