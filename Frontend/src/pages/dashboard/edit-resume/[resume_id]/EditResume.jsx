import React, { useEffect, useState } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Eye, EyeOff } from "lucide-react";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    getResumeData(resume_id).then((data) => {
      dispatch(addResumeData(data.data));
    });
  }, [resume_id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Mobile preview toggle */}
      <div className="md:hidden flex justify-end px-4 py-3 border-b border-gray-100 bg-white dark:bg-gray-900">
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          {showPreview ? (
            <><EyeOff className="w-4 h-4" /> Show Form</>
          ) : (
            <><Eye className="w-4 h-4" /> Show Preview</>
          )}
        </button>
      </div>

      {/* Layout: stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 md:p-10">
        {/* Form — hidden on mobile when preview is shown */}
        <div className={`${showPreview ? "hidden md:block" : "block"} overflow-y-auto max-h-[80vh] md:max-h-[calc(100vh-120px)] pr-1`}>
          <ResumeForm />
        </div>

        {/* Preview — hidden on mobile when form is shown */}
        <div className={!showPreview ? "hidden md:block" : "block"}>
          <div className="sticky top-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-3">
              Live Preview
            </p>
            <div className="bg-white rounded-xl shadow-lg overflow-auto max-h-[80vh] md:max-h-[calc(100vh-120px)]">
              <PreviewPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditResume;
