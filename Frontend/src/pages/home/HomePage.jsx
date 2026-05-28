import Header from "@/components/custom/Header";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Hero3D from "@/components/custom/Hero3D";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";
import { Sparkles, Zap, CheckCircle2, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles className="w-7 h-7 text-purple-600" />,
    bg: "bg-purple-50",
    title: "AI-Powered Content",
    desc: "Our AI writes compelling bullet points and summaries tailored to your target job.",
  },
  {
    icon: <Zap className="w-7 h-7 text-blue-500" />,
    bg: "bg-blue-50",
    title: "Lightning Fast",
    desc: "Go from blank to a complete professional resume in under 10 minutes.",
  },
  {
    icon: <CheckCircle2 className="w-7 h-7 text-emerald-500" />,
    bg: "bg-emerald-50",
    title: "ATS Optimized",
    desc: "Every resume is structured to pass applicant tracking systems with ease.",
  },
];

const STEPS = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds." },
  { num: "02", title: "Fill Your Details", desc: "Add your experience, education, skills — AI helps along the way." },
  { num: "03", title: "Download & Share", desc: "Export a polished PDF and share your unique resume link." },
];

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGithubClick = () => {
    window.open("https://github.com/TanujDeshmukh09/ai-resume-builder", "_blank");
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log("Error from Home Page ->", error.message);
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, [dispatch]);

  const handleGetStartedClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/sign-in");
    }
  };

  return (
    <div className="bg-white dark:bg-background">
      <Header user={user} />

      {/* ── HERO ── */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Resume Builder
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white mb-6">
              Start building a{" "}
              <span className="gradient-text">Resume powered by AI</span>{" "}
              for your next Job
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Build. Refine. Shine. — Create a professional, ATS-optimized resume in minutes with the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleGetStartedClick} className="btn-primary text-base gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={handleGithubClick} className="btn-secondary text-base gap-2">
                <FaGithub className="w-4 h-4" /> View on GitHub
              </button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-16 max-w-5xl mx-auto relative z-10"
          >
            {/* Soft decorative glow behind the 3D scene */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 blur-3xl -z-10 rounded-full" />
            
            {/* Render the actual interactive 3D WebGL scene */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-transparent">
              <Hero3D />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/30 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">Why Choose AI Resume Builder?</h2>
            <p className="section-subtitle">Everything you need to land your dream job — in one tool.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-md card-hover"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-xl flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to a job-winning resume.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center relative"
              >
                {/* Connector line on desktop */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-purple-200 to-indigo-200" />
                )}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-extrabold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-200">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-10 sm:p-16 text-center shadow-2xl shadow-purple-200"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-white/80 text-lg mb-9 max-w-xl mx-auto">
              Join thousands of job seekers who built their standout resume with AI Resume Builder.
            </p>
            <button
              onClick={handleGetStartedClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-lg active:scale-95"
            >
              Start Building Free <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-background">
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </p>
          <Button variant="secondary" size="sm" onClick={handleGithubClick}>
            <FaGithub className="w-4 h-4 mr-2" /> GitHub
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
