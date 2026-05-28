import mongoose from "mongoose";
import educationSchema from "./education.model.js";
const resumeSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, default: "" },
  title: { type: String, required: true },
  summary: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experience: [
    {
      title: { type: String },
      companyName: { type: String },
      city: { type: String },
      state: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      currentlyWorking: { type: String },
      workSummary: { type: String },
    },
  ],
  education: [
    {
      type: educationSchema,
    },
  ],
  skills: [
    {
      name: { type: String },
      rating: { type: Number },
    },
  ],
  projects: [
    {
      projectName: { type: String },
      techStack: { type: String },
      projectSummary: { type: String },
      githubURL: { type: String },
      liveDemoURL: { type: String }
    },
  ],
  certifications: [
    {
      certificateName: { type: String },
      issuer: { type: String },
      issueDate: { type: String },
      credentialURL: { type: String },
      description: { type: String },
      credibilityScore: { type: Number },
      verifiedIssuer: { type: Boolean },
      issuerReputation: { type: String },
      warnings: [{ type: String }]
    }
  ],
  researchPapers: [
    {
      paperTitle: { type: String },
      authors: { type: String },
      journal: { type: String },
      publicationDate: { type: String },
      doiURL: { type: String },
      abstract: { type: String },
    },
  ],
  themeColor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
