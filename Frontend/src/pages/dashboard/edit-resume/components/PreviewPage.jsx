import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PersonalDeatailPreview from "./preview-components/PersonalDeatailPreview";
import SummeryPreview from "./preview-components/SummaryPreview";
import ExperiencePreview from "./preview-components/ExperiencePreview";
import EducationalPreview from "./preview-components/EducationalPreview";
import SkillsPreview from "./preview-components/SkillsPreview";
import ProjectPreview from "./preview-components/ProjectPreview";
import ResearchPapersPreview from "./preview-components/ResearchPapersPreview";
import CertificationsPreview from "./preview-components/CertificationsPreview";

function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  const ref = useRef(null);

  // 3D Tilt Effect Setup (Framer Motion)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  // Adjust output ranges to control max tilt angle (e.g. 8 is 8 degrees)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: "1500px" }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="shadow-2xl bg-white w-full h-auto min-h-[900px] p-8 border-t-[20px] transition-shadow duration-300 hover:shadow-purple-500/20"
        style={{
          borderColor: resumeData?.themeColor ? resumeData.themeColor : "#000000",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Anti-alias hack for 3D transforms */}
        <div style={{ transform: "translateZ(0)" }}>
          <PersonalDeatailPreview resumeInfo={resumeData} />
          <SummeryPreview resumeInfo={resumeData} />
          {resumeData?.experience && <ExperiencePreview resumeInfo={resumeData} />}
          {resumeData?.projects && <ProjectPreview resumeInfo={resumeData} />}
          {resumeData?.researchPapers && <ResearchPapersPreview resumeInfo={resumeData} />}
          {resumeData?.education && <EducationalPreview resumeInfo={resumeData} />}
          {resumeData?.skills && <SkillsPreview resumeInfo={resumeData} />}
          {resumeData?.certifications && <CertificationsPreview resumeInfo={resumeData} />}
        </div>
      </motion.div>
    </div>
  );
}

export default PreviewPage;
