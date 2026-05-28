import React from "react";

// Truncate plain text to maxChars, appending ellipsis if needed
const truncateText = (text, maxChars = 250) => {
  if (!text) return "";
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + "…";
};

function SummeryPreview({ resumeInfo }) {
  return (
    <p className="text-xs leading-snug text-gray-700 mb-3">
      {truncateText(resumeInfo?.summary, 250)}
    </p>
  );
}

export default SummeryPreview;