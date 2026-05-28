import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null);
  const { resume_id } = useParams();
  const suggestionsRef = useRef(null);
  const textareaRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // ✅ Max characters for the profile summary
  const SUMMARY_MAX_CHARS = 250;

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    // ✅ Hard cap: do not exceed max character limit
    const raw = e.target.value;
    const capped = raw.slice(0, SUMMARY_MAX_CHARS);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: capped,
      })
    );
    setSummary(capped);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Started Saving Summary");
    const data = {
      data: { summary },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => {
          toast.success("Summary saved successfully!");
        })
        .catch((error) => {
          toast.error(`Error saving summary: ${error.message}`);
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const setSummery = (newSummary) => {
    // ✅ Also cap AI-applied summaries
    const capped = (newSummary || "").slice(0, SUMMARY_MAX_CHARS);
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: capped,
      })
    );
    setSummary(capped);
  };

  // 🔁 Retry wrapper for AI calls
  const callAI = async (prompt, retries = 2) => {
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const text = await result.response.text();
      return text;
    } catch (err) {
      if (retries > 0) {
        return await callAI(prompt, retries - 1);
      }
      throw err;
    }
  };

  const GenerateSummeryFromAI = async () => {
    setLoading(true);

    if (!resumeInfo?.jobTitle) {
      toast.warning("Please add your Job Title in Personal Details first!");
      setLoading(false);
      return;
    }

    const userDraft = summary || resumeInfo?.summary || "";

    if (!userDraft.trim()) {
      toast.warning("Please write something in the summary box first, then click Generate!");
      setLoading(false);
      return;
    }

    // Hint to AI to focus on specifics, not generic phrases
    const enhancedDraft = `${userDraft}
Focus on skills, projects, or technologies mentioned. Avoid generic statements.`;

    const PROMPT = `You are an expert professional resume writer. Rewrite the user's draft into 3 polished resume summaries.

RULES:
- Do NOT invent experience, companies, or achievements not in the draft
- Fix grammar, spelling, and make it professional
- Each version must be a complete paragraph (no bullet points)
- You MUST output all 3 versions — do not stop after 1

Job Title: ${resumeInfo?.jobTitle || "Not specified"}
User Draft: "${userDraft}"

Output EXACTLY this JSON array with 3 items:
[
  { "summary": "<2-3 concise sentences, max 230 characters, professional and ATS-friendly>", "experience_level": "Professional" },
  { "summary": "<2-3 concise sentences, max 230 characters, modern and energetic tone>", "experience_level": "Impactful" },
  { "summary": "<1-2 concise sentences, max 200 characters, clean and punchy>", "experience_level": "Standard" }
]

Return ONLY the JSON array. No markdown, no explanation.`;

    try {
      const responseText = await callAI(PROMPT);

      // Clean response
      const cleanedText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedData = JSON.parse(cleanedText);

      // Handle wrapped API formats
      if (!Array.isArray(parsedData)) {
        parsedData =
          parsedData.summaries ||
          parsedData.data ||
          parsedData.results ||
          Object.values(parsedData)[0];
      }

      // Weak output detection — only flag truly empty/generic responses
      const isWeak = cleanedText.toLowerCase() === "hardworking";

      if (isWeak) {
        throw new Error("AI output was too generic. Please try again.");
      }

      setAiGenerateSummeryList(parsedData);
      toast.success("✅ Suggestions ready! Click one below to apply it.");
      // Scroll down to show the suggestions
      setTimeout(() => suggestionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error(error);
      toast.error(`Error generating AI summary: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5 shadow-lg rounded-lg border-t-purple-500 border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-medium">Add Summary</label>
            <Button
              variant="outline"
              onClick={() => GenerateSummeryFromAI()}
              type="button"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50 flex gap-2"
            >
              <Sparkles className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            ref={textareaRef}
            name="summary"
            className="mt-2 min-h-[100px]"
            required
            maxLength={SUMMARY_MAX_CHARS}
            value={summary ? summary : resumeInfo?.summary}
            onChange={handleInputChange}
            placeholder="Write a short professional summary (max 250 characters). Click 'Generate with AI' to improve it!"
          />
          {/* ✅ Live character counter */}
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs font-medium ${
                (summary || resumeInfo?.summary || "").length >= SUMMARY_MAX_CHARS
                  ? "text-red-500"
                  : (summary || resumeInfo?.summary || "").length >= SUMMARY_MAX_CHARS * 0.85
                  ? "text-orange-500"
                  : "text-gray-400"
              }`}
            >
              {(summary || resumeInfo?.summary || "").length} / {SUMMARY_MAX_CHARS}
            </span>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-sm"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
        <div ref={suggestionsRef} className="my-5">
          <h2 className="font-bold text-lg">Suggestions <span className="text-sm font-normal text-gray-500">(Click one to apply)</span></h2>
          {Array.isArray(aiGeneratedSummeryList) && aiGeneratedSummeryList?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                setSummery(item?.summary);
                enanbledNext(true);
                enanbledPrev(true);
                toast.success("✅ Summary applied! Click Save to keep it.");
              }}
              className={`p-5 shadow-lg my-4 rounded-lg cursor-pointer border-2 transition-all ${
                selectedIndex === index
                  ? "border-purple-500 bg-purple-50"
                  : "border-transparent hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <h2 className={`font-bold my-1 ${ selectedIndex === index ? "text-purple-600" : "text-primary"}`}>
                {item?.experience_level} {selectedIndex === index && "✔"}
              </h2>
              <p className="text-gray-700">{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Summary;
