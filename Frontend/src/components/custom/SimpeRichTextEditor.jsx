import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "@/Services/AiModel";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

// Prompt for project-section AI generation — max 3 bullet points
const PROJECT_PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project.
"techStack": A string representing the project tech stack.
"projectSummary": An array of strings, each a bullet point in HTML <li> format for the given project.
projectName-"{projectName}"
techStack-"{techStack}"
RULES:
- The projectSummary array MUST contain exactly 3 bullet points. No more.
- Each bullet must be one concise sentence (max 15 words).
- Start each bullet with a strong action verb.
- Do NOT produce paragraphs or long descriptions.`;

/**
 * SimpeRichTextEditor
 *
 * Props:
 *  - index              {number}   – item index in the parent list
 *  - defaultValue       {string}   – initial HTML content (must be the actual field value)
 *  - onRichTextEditorChange {fn}   – called with the new HTML string whenever content changes
 *  - resumeInfo         {object}   – full resume object (used only for AI generation in project mode)
 *  - sectionType        {string}   – "project" | "researchPaper" | anything else
 *                                    Defaults to "project" for backwards-compat with old callers.
 *                                    Pass "researchPaper" from ResearchPapers to disable AI button.
 */
function SimpeRichTextEditor({
  index,
  defaultValue,
  onRichTextEditorChange,
  resumeInfo,
  sectionType = "project",
}) {
  // ✅ FIX 1: Use `defaultValue` prop as the source of truth, NOT hardcoded projects key.
  //           Each section passes its own field value via `defaultValue`.
  const [value, setValue] = useState(defaultValue || "");
  const [loading, setLoading] = useState(false);

  // Keep local state in sync when the parent updates defaultValue
  // (e.g. when navigating back to a step that already has saved data)
  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  // ✅ FIX 2: Remove the useEffect that blindly called onRichTextEditorChange on mount.
  //           Changes are now only propagated on actual user interaction (see onChange below).

  const GenerateSummaryFromAI = async () => {
    // AI generation only makes sense for project summaries
    if (sectionType !== "project") return;

    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    try {
      const prompt = PROJECT_PROMPT.replace(
        "{projectName}",
        resumeInfo?.projects[index]?.projectName
      ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);

      console.log("Prompt", prompt);
      const result = await AIChatSession.sendMessage(prompt);
      let rawText = result.response.text();

      // Strip markdown code fences if present (```json ... ```)
      rawText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

      // Extract JSON object — model may add preamble text like "Here is the JSON..."
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        rawText = rawText.substring(jsonStart, jsonEnd + 1);
      }

      console.log("AI raw response:", rawText);
      const resp = JSON.parse(rawText);
      console.log("Parsed response keys:", Object.keys(resp));

      // Find the array of bullets — model may use any key name
      let bullets = resp.projectSummary || resp.project_summary || resp.summary;

      // Fallback: find the first array value in the response
      if (!bullets) {
        bullets = Object.values(resp).find((val) => Array.isArray(val));
      }

      if (bullets && Array.isArray(bullets)) {
        // ✅ Hard cap: max 3 bullets for projects
        const capped = bullets.slice(0, 3);
        const newValue = capped.join("");
        setValue(newValue);
        onRichTextEditorChange(newValue);
      } else {
        toast.error("AI returned unexpected format. Please try again.");
        console.error("No array found in response:", resp);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        {/* ✅ Only show the AI button for project sections */}
        {sectionType === "project" && (
          <Button
            variant="outline"
            size="sm"
            onClick={GenerateSummaryFromAI}
            disabled={loading}
            className="flex gap-2 border-primary text-primary"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate from AI
              </>
            )}
          </Button>
        )}
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            // ✅ FIX 3: Use e.target.value (the NEW value) not the stale `value` closure.
            const newValue = e.target.value;
            setValue(newValue);
            onRichTextEditorChange(newValue);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default SimpeRichTextEditor;
