import { FaEye, FaEdit, FaTrashAlt, FaSpinner } from "react-icons/fa";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Stable gradients indexed by position — avoids re-randomizing on re-render
const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-green-400 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
];

function ResumeCard({ resume, index = 0, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteThisResume(resume._id);
      toast.success("Resume deleted");
    } catch (error) {
      console.error("Error deleting resume:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md card-hover border border-gray-100 dark:border-gray-700"
    >
      {/* Gradient top */}
      <div
        className={`h-36 sm:h-44 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}
      >
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <FaEdit className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h3
          className={`text-center font-bold text-sm bg-gradient-to-r ${gradient} bg-clip-text text-transparent truncate px-2`}
        >
          {resume.title}
        </h3>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-around px-2 py-2.5">
        <button
          title="View"
          onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
          className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <FaEye className="w-4 h-4" />
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">View</span>
        </button>
        <button
          title="Edit"
          onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
          className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-500 hover:text-purple-600 transition-colors group"
        >
          <FaEdit className="w-4 h-4" />
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
        </button>
        <button
          title="Delete"
          onClick={() => setOpenAlert(true)}
          className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors group"
        >
          <FaTrashAlt className="w-4 h-4" />
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>
        </button>

        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Your resume will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={loading}>
                {loading ? <FaSpinner className="animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

export default ResumeCard;
