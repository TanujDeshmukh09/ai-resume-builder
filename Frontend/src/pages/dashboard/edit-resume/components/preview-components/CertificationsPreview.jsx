import React from "react";
import { normalizeToHtmlBullets } from "@/lib/resumeContentUtils";

function CertificationsPreview({ resumeInfo }) {
  return (
    <div className="my-3">
      {resumeInfo?.certifications?.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{ color: resumeInfo?.themeColor }}
          >
            Certifications
          </h2>
          <hr style={{ borderColor: resumeInfo?.themeColor }} />
        </div>
      )}

      {resumeInfo?.certifications?.map((certification, index) => (
        <div key={index} className="my-2">
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {certification?.certificateName}
            {certification?.issuer ? ` — ${certification.issuer}` : ""}
          </h2>

          {certification?.issueDate && (
            <h2 className="text-xs text-gray-700">
              Issued: {certification.issueDate}
            </h2>
          )}

          {certification?.credentialURL && (
            <a
              href={certification.credentialURL}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-500 hover:underline block mb-1"
            >
              Credential: {certification.credentialURL}
            </a>
          )}

          {/* ✅ Normalised bullet list for description */}
          {certification?.description && (
            <div
              className="text-xs my-1 resume-bullets"
              dangerouslySetInnerHTML={{
                __html: normalizeToHtmlBullets(certification.description, 4, 350),
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CertificationsPreview;
