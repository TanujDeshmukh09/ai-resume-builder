import React, { useState } from "react";
import { Plus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createResume = async () => {
    if (!resumetitle.trim()) return;
    setLoading(true);
    const data = {
      data: {
        title: resumetitle,
        themeColor: "#7C3AED",
      },
    };
    createNewResume(data)
      .then((res) => {
        navigate(`/dashboard/edit-resume/${res.data.resume._id}`);
      })
      .finally(() => {
        setLoading(false);
        setResumetitle("");
      });
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDialog(true)}
        className="bg-purple-50/60 dark:bg-purple-900/10 border-2 border-dashed border-purple-200 dark:border-purple-700 rounded-2xl
                   flex flex-col items-center justify-center gap-3 py-16 sm:py-20 cursor-pointer
                   hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20
                   transition-all duration-300 shadow-sm hover:shadow-md min-h-[200px]"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
          <Plus className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Create New Resume</p>
      </motion.div>

      <Dialog open={isDialogOpen}>
        <DialogContent setOpenDialog={setOpenDialog}>
          <DialogHeader>
            <DialogTitle>Create a New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a name to get started
              <Input
                className="my-3 focus:ring-2 focus:ring-purple-300"
                type="text"
                placeholder="Ex: Backend Engineer Resume"
                value={resumetitle}
                onChange={(e) => setResumetitle(e.target.value.trimStart())}
              />
            </DialogDescription>
            <div className="gap-2 flex justify-end pt-1">
              <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={createResume}
                disabled={!resumetitle.trim() || loading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
              >
                {loading ? <Loader className="animate-spin" /> : "Create Resume"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;
