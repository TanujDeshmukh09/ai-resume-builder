import React from "react";
import { normalizeToHtmlBullets } from "@/lib/resumeContentUtils";

function ProjectPreview({ resumeInfo }) {
  return (
    <div className="my-3">
      {resumeInfo?.projects?.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{ color: resumeInfo?.themeColor }}
          >
            Projects
          </h2>
          <hr style={{ borderColor: resumeInfo?.themeColor }} />
        </div>
      )}

      {resumeInfo?.projects?.map((project, index) => (
        <div key={index} className="my-2">
          {/* Project name */}
          <h2
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}
          >
            {project?.projectName}
          </h2>

          {/* Tech stack */}
          {project?.techStack?.length > 0 && (
            <h2 className="text-xs my-0.5 text-gray-700">
              <span>
                {project.techStack
                  .split(",")
                  .map((t) => t.trim())
                  .join(" • ")}
              </span>
            </h2>
          )}

          {/* Links */}
          {(project?.githubURL || project?.liveDemoURL) && (
            <div className="text-xs flex gap-4 mt-0.5 mb-1">
              {project?.githubURL && (
                <div>
                  <span className="font-semibold text-gray-700">GitHub: </span>
                  <a
                    href={project.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.githubURL.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {project?.liveDemoURL && (
                <div>
                  <span className="font-semibold text-gray-700">Demo: </span>
                  <a
                    href={project.liveDemoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.liveDemoURL.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ✅ Normalised bullet list — max 3 bullets */}
          <div
            className="text-xs my-1 resume-bullets"
            dangerouslySetInnerHTML={{
              __html: normalizeToHtmlBullets(project?.projectSummary, 3, 350),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProjectPreview;
