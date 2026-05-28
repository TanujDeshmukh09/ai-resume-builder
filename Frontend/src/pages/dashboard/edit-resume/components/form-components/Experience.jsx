import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};
function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const { resume_id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
    } catch (error) {
      console.log("error in experience context update", error.message);
    }
  }, [experienceList]);

  const addExperience = () => {
    if (!experienceList) {
      setExperienceList([formFields]);
      return;
    }
    setExperienceList([...experienceList, formFields]);
  };

  const removeExperience = (index) => {
    const list = [...experienceList];
    const newList = list.filter((item, i) => {
      if (i !== index) return true;
    });
    setExperienceList(newList);
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setExperienceList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        experience: experienceList,
      },
    };
    if (resume_id) {
      console.log("Started Updating Experience");
      updateThisResume(resume_id, data)
        .then((data) => {
          toast.success("Experience saved successfully!");
        })
        .catch((error) => {
          toast.error(`Error saving experience: ${error.message}`);
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5 shadow-lg rounded-lg border-t-purple-500 border-t-4 mt-10">
        <h2 className="font-bold text-lg">Experience</h2>
        <p>Add Your Previous Job Experience</p>
        <div>
          {experienceList?.map((experience, index) => (
            <div key={index}>
              <div className="flex justify-between my-2">
                <h3 className="font-bold text-lg">Experience {index + 1}</h3>
                <Button
                  variant="outline"
                  onClick={() => removeExperience(index)}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50 flex gap-2"
                >
                  <Trash2 /> Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={experience?.title}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    type="text"
                    name="companyName"
                    value={experience?.companyName}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={experience?.city}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input
                    type="text"
                    name="state"
                    value={experience?.state}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs">StartDate</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={experience?.startDate}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={experience?.endDate}
                    onChange={(e) => {
                      handleChange(e, index);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <RichTextEditor
                    index={index}
                    defaultValue={experience?.workSummary}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditor(event, "workSummary", index)
                    }
                    resumeInfo={resumeInfo}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-2">
          <Button
            onClick={addExperience}
            variant="outline"
            className="text-purple-600 border-purple-300 hover:bg-purple-50 flex gap-2"
          >
            + Add More Experience
          </Button>
          <Button disabled={loading} onClick={onSave} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-sm">
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default Experience;
