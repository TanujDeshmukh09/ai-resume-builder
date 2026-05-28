import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Resume from "../models/resume.model.js";

const start = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Welcome to Resume Builder API"));
};

const createResume = async (req, res) => {
  const { title, themeColor } = req.body;

  // Validate that the title and themeColor are provided
  if (!title || !themeColor) {
    return res
      .status(400)
      .json(new ApiError(400, "Title and themeColor are required."));
  }

  try {
    // Create a new resume with empty fields for other attributes
    const resume = await Resume.create({
      title,
      themeColor,
      user: req.user._id, // Set the user ID from the authenticated user
      firstName: "",
      lastName: "",
      email: "",
      summary: "",
      jobTitle: "",
      phone: "",
      address: "",
      experience: [],
      education: [], // Initialize as an empty array
      skills: [],
      projects: [],
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { resume }, "Resume created successfully"));
  } catch (error) {
    console.error("Error creating resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

const getALLResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user });
    return res
      .status(200)
      .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const getResume = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json(new ApiError(400, "Resume ID is required."));
    }

    // Find the resume by ID
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json(new ApiError(404, "Resume not found."));
    }

    // Check if the resume belongs to the current user
    if (resume.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, "You are not authorized to access this resume.")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, resume, "Resume fetched successfully"));
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const updateResume = async (req, res) => {
  console.log("Resume update request received:");
  const id = req.query.id;

  try {
    // Find and update the resume with the provided ID and user ID
    console.log("Database update request started");
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body, $currentDate: { updatedAt: true } }, // Set updatedAt to current date
      { new: true } // Return the modified document
    );

    if (!updatedResume) {
      console.log("Resume not found or unauthorized");
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Resume not found or unauthorized"));
    }

    console.log("Resume updated successfully:");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
  } catch (error) {
    console.error("Error updating resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }

  // return res.status(200).json({ message: "Hello World" });
};

const removeResume = async (req, res) => {
  const id = req.query.id;

  try {
    // Check if the resume exists and belongs to the current user
    const resume = await Resume.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            "Resume not found or not authorized to delete this resume"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Resume deleted successfully"));
  } catch (error) {
    console.error("Error while deleting resume:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

const analyzeResume = async (req, res) => {
  // Note: This endpoint is standalone analysis and doesn't explicitly require DB hits
  // as it expects the resume JSON body to be passed from the front-end directly.
  const {
    skills = [],
    projects = [],
    certifications = [],
    experience = []
  } = req.body;

  let atsScore = 0;
  const analysis = {
    skills: "Needs Improvement",
    projects: "Needs Improvement",
    certifications: "Needs Improvement",
    experience: "Needs Improvement"
  };
  const suggestions = [];

  // --- 1. Skills Scoring (Max 25) ---
  if (skills.length >= 7) {
    atsScore += 25;
    analysis.skills = "Strong";
  } else if (skills.length >= 4) {
    atsScore += 18;
    analysis.skills = "Good";
    suggestions.push("Consider adding more relevant skills (7+) to boost search visibility.");
  } else if (skills.length >= 1) {
    atsScore += 10;
    suggestions.push("Your skills section is extremely brief. Target at least 5-7 core competencies.");
  } else {
    suggestions.push("You must include a Skills section to pass through ATS filters.");
  }

  // --- 2. Projects Scoring (Max 25 Base + 5 Bonus) ---
  if (projects.length >= 4) {
    atsScore += 25;
    analysis.projects = "Excellent";
  } else if (projects.length >= 2) {
    atsScore += 18;
    analysis.projects = "Good";
  } else if (projects.length === 1) {
    atsScore += 10;
    suggestions.push("Consider listing at least 2-3 projects to demonstrate broader experience.");
  } else {
    suggestions.push("Add personal or academic projects to showcase practical application of your skills.");
  }

  // Project Authenticity Bonus (Max 5)
  let githubLinks = 0;
  let liveDemoLinks = 0;
  projects.forEach(p => {
    if (p.githubURL && p.githubURL.trim() !== "") githubLinks++;
    if (p.liveDemoURL && p.liveDemoURL.trim() !== "") liveDemoLinks++;
  });

  let projectBonus = (githubLinks * 2) + (liveDemoLinks * 3);
  projectBonus = Math.min(5, projectBonus); // Cap bonus at 5
  atsScore += projectBonus;

  if (projects.length > 0 && projectBonus === 0) {
    suggestions.push("Add GitHub repositories or Live Demo URLs to your projects to dramatically improve verification credibility.");
  }
  if (projectBonus > 0 && projectBonus < 5) {
    analysis.projects = "Verified - Good";
  }
  if (projectBonus === 5) {
    analysis.projects = "Verified - Excellent";
  }

  // --- 3. Certifications Scoring (Max 20 Base) ---
  if (certifications.length >= 4) {
    atsScore += 20;
  } else if (certifications.length >= 2) {
    atsScore += 15;
  } else if (certifications.length === 1) {
    atsScore += 10;
  } else {
    suggestions.push("Including industry-standard certifications can help you stand out to recruiters.");
  }

  // Certification Credibility Bonus (Max 15)
  let totalCredibility = 0;
  let certsWithScores = 0;

  certifications.forEach(cert => {
    if (cert.credibilityScore !== undefined && cert.credibilityScore !== null) {
      totalCredibility += cert.credibilityScore;
      certsWithScores++;
    }
  });

  if (certsWithScores > 0) {
    const averageCredibility = totalCredibility / certsWithScores; // 0 to 10
    // Scale 10 max credibility to 15 max bonus points
    const credScore = (averageCredibility / 10) * 15;
    atsScore += credScore;

    if (averageCredibility >= 7) {
      analysis.certifications = "Trusted & Verified";
    } else if (averageCredibility >= 4) {
      analysis.certifications = "Acceptable";
      suggestions.push("Some of your certificates are from unknown issuers. Try prioritizing well-known platforms (e.g. Coursera, AWS).");
    } else {
      suggestions.push("Your certificates scored very low on credibility. Ensure you are providing legitimate Credential URLs for verification.");
    }
  } else if (certifications.length > 0) {
    suggestions.push("Click 'Analyze Credibility' on your certifications to verify their authenticity and boost your ATS score.");
  }

  // --- 4. Experience Scoring (Max 10) ---
  if (experience.length > 0) {
    atsScore += 10;
    analysis.experience = "Included";
  } else {
    analysis.experience = "Optional Improvement";
    suggestions.push("Consider internships, open-source contributions, or freelance work if you lack formal experience.");
  }

  // Clamp limits
  atsScore = Math.round(atsScore);
  atsScore = Math.max(0, Math.min(100, atsScore));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        atsScore,
        analysis,
        suggestions
      },
      "Resume analyzed successfully."
    )
  );
};

export {
  start,
  createResume,
  getALLResume,
  getResume,
  updateResume,
  removeResume,
  analyzeResume,
};
