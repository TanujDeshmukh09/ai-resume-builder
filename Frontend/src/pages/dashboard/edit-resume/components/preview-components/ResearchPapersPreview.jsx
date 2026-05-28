import React from "react";
import { normalizeToHtmlBullets } from "@/lib/resumeContentUtils";

function ResearchPapersPreview({ resumeInfo }) {
  return (
    <div className="my-3">
      {resumeInfo?.researchPapers?.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{ color: resumeInfo?.themeColor }}
          >
            Research Papers
          </h2>
          <hr style={{ borderColor: resumeInfo?.themeColor }} />
        </div>
      )}

      {resumeInfo?.researchPapers?.map((paper, index) => (
        <div key={index} className="my-2">
          {/* Paper title */}
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {paper?.paperTitle}
          </h2>

          {/* Authors */}
          {paper?.authors && (
            <h2 className="text-xs my-0.5 text-gray-700">
              <span className="font-semibold">Authors: </span>
              {paper.authors}
            </h2>
          )}

          {/* Metadata row */}
          <div className="text-xs flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5 mb-1 text-gray-700">
            {paper?.journal && (
              <span>
                <span className="font-semibold">Published in: </span>
                {paper.journal}
              </span>
            )}
            {paper?.publicationDate && (
              <span>
                <span className="font-semibold">Date: </span>
                {paper.publicationDate}
              </span>
            )}
            {paper?.doiURL && (
              <span>
                <span className="font-semibold">DOI/URL: </span>
                <a
                  href={paper.doiURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {paper.doiURL.replace(/^https?:\/\//, "")}
                </a>
              </span>
            )}
          </div>

          {/* ✅ Normalised bullet list — max 3 bullets or 350 chars */}
          <div
            className="text-xs my-1 resume-bullets"
            dangerouslySetInnerHTML={{
              __html: normalizeToHtmlBullets(paper?.abstract, 3, 350),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ResearchPapersPreview;
