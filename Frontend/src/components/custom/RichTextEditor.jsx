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

// ✅ Max 3-4 bullet points — concise, ATS-friendly
const PROMPT = `Create a JSON object with the following fields:
"position_Title": A string representing the job title.
"experience": An array of strings, each representing a bullet point in HTML <li> format describing relevant experience for the given job title.
For the Job Title "{positionTitle}", create a JSON object.
RULES:
- The experience array MUST contain exactly 3 to 4 bullet points. No more.
- Each bullet point must be one concise sentence (max 15 words).
- Start each bullet with a strong action verb.
- Do NOT use paragraphs or long descriptions.`;

/**
 * RichTextEditor — used exclusively for Experience work summaries.
 * Props:
 *  - index                  {number}  – entry index in experienceList
 *  - defaultValue           {string}  – current HTML content for this entry
 *  - onRichTextEditorChange {fn}      – callback(newHtml)
 *  - resumeInfo             {object}  – full resume state (for AI prompt)
 */
function RichTextEditor({ onRichTextEditorChange, index, defaultValue, resumeInfo }) {
  // ✅ Use defaultValue prop — NOT hardcoded resumeInfo.experience[index]
  const [value, setValue] = useState(defaultValue || "");
  const [loading, setLoading] = useState(false);

  // Sync when parent updates defaultValue (e.g. navigating back)
  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    setLoading(true);

    try {
      const prompt = PROMPT.replace(
        "{positionTitle}",
        resumeInfo.experience[index].title
      );
      const result = await AIChatSession.sendMessage(prompt);
      let rawText = result.response.text();

      // Strip markdown code fences
      rawText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

      // Extract JSON object
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        rawText = rawText.substring(jsonStart, jsonEnd + 1);
      }

      console.log("AI raw response:", rawText);
      const resp = JSON.parse(rawText);
      console.log("Parsed response keys:", Object.keys(resp));

      // Find the bullets array — tolerate any key name
      let bullets =
        resp.experience ||
        resp.experience_bullets ||
        resp.bullets ||
        resp.work_experience ||
        resp.responsibilities;

      // Fallback: first array value
      if (!bullets) {
        bullets = Object.values(resp).find((val) => Array.isArray(val));
      }

      if (bullets && Array.isArray(bullets)) {
        // ✅ Hard cap: take at most 4 bullets regardless of what AI returns
        const capped = bullets.slice(0, 4);
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
        <label className="text-xs">Work Summary</label>
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
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            // ✅ Fixed stale closure — use e.target.value directly
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

export default RichTextEditor;
