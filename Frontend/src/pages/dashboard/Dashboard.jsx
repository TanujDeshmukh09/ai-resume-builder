import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import { motion } from "framer-motion";
import { FileText, Clock, Share2 } from "lucide-react";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = React.useState([]);

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      setResumeList(resumes.data);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  const firstName = user?.fullName?.split(" ")?.[0] || "there";

  const lastEditedDate = resumeList.length > 0 
    ? new Date(Math.max(...resumeList.map(r => new Date(r.updatedAt)))).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : "None";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-5 sm:px-10 lg:px-16 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-white/80 text-base">
            Manage and create your AI-powered resumes below
          </p>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
              <FileText className="w-4 h-4" />
              {resumeList.length} Resume{resumeList.length !== 1 ? "s" : ""} Created
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              Last edited: {lastEditedDate}
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
              <Share2 className="w-4 h-4" />
              Share your resume
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resume Grid */}
      <div className="px-5 sm:px-10 lg:px-16 py-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Resumes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AddResume />
          {resumeList.length > 0 &&
            resumeList.map((resume, index) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                index={index}
                refreshData={fetchAllResumeData}
              />
            ))}
        </div>

        {/* Empty state */}
        {resumeList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-purple-50 flex items-center justify-center">
              <FileText className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Click the card above to create your first AI-powered resume
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
