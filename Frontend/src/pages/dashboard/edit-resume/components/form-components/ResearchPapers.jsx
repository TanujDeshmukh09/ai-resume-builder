import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";

const formFields = {
  paperTitle: "",
  authors: "",
  journal: "",
  publicationDate: "",
  doiURL: "",
  abstract: "",
};

function ResearchPapers({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [papersList, setPapersList] = useState(
    resumeInfo?.researchPapers || []
  );
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, researchPapers: papersList }));
  }, [papersList]);

  const addPaper = () => {
    setPapersList([...papersList, formFields]);
  };

  const removePaper = (index) => {
    const list = [...papersList];
    const newList = list.filter((item, i) => {
      if (i !== index) return true;
    });
    setPapersList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...papersList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setPapersList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...papersList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setPapersList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        researchPapers: papersList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Research Papers");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast.success("Research Papers saved successfully!");
        })
        .catch((error) => {
          toast.error(`Error saving research papers: ${error.message}`);
        })
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 shadow-lg rounded-lg border-t-purple-500 border-t-4 mt-10"
    >
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-5 h-5 text-purple-600" />
        <h2 className="font-bold text-lg">Research Papers</h2>
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
          Optional
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        Add your published research papers. You can skip this section if not applicable.
      </p>

      {papersList?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl my-4 bg-gray-50/50">
          <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm mb-1">No research papers added yet</p>
          <p className="text-gray-400 text-xs">Click the button below to add one, or skip to the next step</p>
        </div>
      )}

      <div>
        {papersList?.map((paper, index) => (
          <div key={index}>
            <div className="flex justify-between my-2">
              <h3 className="font-bold text-lg">Paper {index + 1}</h3>
              <Button
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                onClick={(e) => {
                  removePaper(index);
                }}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label className="text-xs">Paper Title</label>
                <Input
                  type="text"
                  name="paperTitle"
                  value={paper?.paperTitle}
                  placeholder="e.g., A Novel Approach to Machine Learning"
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div>
                <label className="text-xs">Authors</label>
                <Input
                  type="text"
                  name="authors"
                  value={paper?.authors}
                  placeholder="e.g., John Doe, Jane Smith"
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div>
                <label className="text-xs">Journal / Conference</label>
                <Input
                  type="text"
                  name="journal"
                  value={paper?.journal}
                  placeholder="e.g., IEEE, Springer, ACM"
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div>
                <label className="text-xs">Publication Date</label>
                <Input
                  type="date"
                  name="publicationDate"
                  value={paper?.publicationDate}
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div>
                <label className="text-xs">DOI / Paper URL</label>
                <Input
                  type="url"
                  name="doiURL"
                  value={paper?.doiURL}
                  placeholder="https://doi.org/10.xxxx/xxxxx"
                  onChange={(e) => {
                    handleChange(e, index);
                  }}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs mb-1 block">Abstract / Summary</label>
                <SimpeRichTextEditor
                  index={index}
                  defaultValue={paper?.abstract}
                  onRichTextEditorChange={(event) =>
                    handleRichTextEditor(event, "abstract", index)
                  }
                  resumeInfo={resumeInfo}
                  sectionType="researchPaper"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between py-2">
        <Button
          onClick={addPaper}
          variant="outline"
          className="text-purple-600 border-purple-300 hover:bg-purple-50 flex gap-2"
        >
          + Add Research Paper
        </Button>
        <Button
          disabled={loading}
          onClick={onSave}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-sm"
        >
          {loading ? <LoaderCircle className=" animate-spin" /> : "Save"}
        </Button>
      </div>
    </motion.div>
  );
}

export default ResearchPapers;
