import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, Share2, Edit, Trophy, ArrowLeft } from "lucide-react";
import html2pdf from "html2pdf.js";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = React.useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    const response = await getResumeData(resume_id);
    setResumeInfo(response.data);
    dispatch(addResumeData(response.data));
  };

  const HandleDownload = () => {
    const element = document.getElementById("print-area");
    const opt = {
      margin: [-0.1, 0, 0, 0],
      filename: `${resumeInfo?.firstName || "My"}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Back link */}
      <div id="noPrint" className="px-5 sm:px-10 pt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Success Card */}
      <motion.div
        id="noPrint"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-5 sm:mx-auto sm:max-w-2xl mt-6 mb-8 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-8 sm:p-10 text-center shadow-2xl shadow-purple-200"
      >
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Your Resume is Ready!
        </h2>
        <p className="text-white/80 mb-8 text-sm sm:text-base">
          Download your polished PDF, or share a unique link with anyone.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={HandleDownload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <RWebShare
            data={{
              text: "Check out my AI-generated resume!",
              url: (import.meta.env.VITE_BASE_URL || window.location.origin) + "/dashboard/view-resume/" + resume_id,
              title: "My Resume",
            }}
            onClick={() => toast.success("Resume shared successfully!")}
          >
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-xl border border-white/40 hover:bg-white/30 transition-all duration-300 active:scale-95">
              <Share2 className="w-4 h-4" /> Share Resume
            </button>
          </RWebShare>
        </div>
      </motion.div>

      {/* Preview label */}
      <div id="noPrint" className="text-center mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Preview
        </span>
      </div>

      {/* A4 Resume Preview */}
      <div className="flex justify-center px-4 pb-12">
        <div
          className="bg-white rounded-xl shadow-2xl overflow-hidden w-full"
          style={{ maxWidth: "210mm" }}
        >
          <div id="print-area" className="print">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div id="noPrint" className="flex flex-col sm:flex-row justify-center gap-3 pb-16 px-5">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
          className="border-gray-300 text-gray-600 hover:border-purple-300 hover:text-purple-600"
        >
          <Edit className="w-4 h-4 mr-2" /> Edit Resume
        </Button>
        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
        >
          Create New Resume
        </Button>
      </div>
    </div>
  );
}

export default ViewResume;
