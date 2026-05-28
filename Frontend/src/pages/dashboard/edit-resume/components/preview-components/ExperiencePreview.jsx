import React from "react";
import { normalizeToHtmlBullets } from "@/lib/resumeContentUtils";

function ExperiencePreview({ resumeInfo }) {
  return (
    <div className="my-3">
      {resumeInfo?.experience?.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{ color: resumeInfo?.themeColor }}
          >
            Professional Experience
          </h2>
          <hr style={{ borderColor: resumeInfo?.themeColor }} />
        </div>
      )}

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className="my-2">
          {/* Job title */}
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {experience?.title}
          </h2>

          {/* Company · location · dates */}
          <h2 className="text-xs flex justify-between text-gray-700">
            <span>
              {experience?.companyName}
              {experience?.companyName && experience?.city ? ", " : null}
              {experience?.city}
              {experience?.city && experience?.state ? ", " : null}
              {experience?.state}
            </span>
            <span>
              {experience?.startDate}{" "}
              {experience?.startDate &&
              (experience?.currentlyWorking || experience?.endDate)
                ? "–"
                : null}{" "}
              {experience?.currentlyWorking ? "Present" : experience?.endDate}
            </span>
          </h2>

          {/* ✅ Normalised bullet list — max 4 bullets */}
          <div
            className="text-xs my-1 resume-bullets"
            dangerouslySetInnerHTML={{
              __html: normalizeToHtmlBullets(experience?.workSummary, 4),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
