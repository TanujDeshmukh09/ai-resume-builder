import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { analyzeResumeAts, getResumeData } from "@/Services/resumeAPI";
import { useSelector, useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Button } from "@/components/ui/button";
import { LoaderCircle, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ATSAnalysis() {
    const { resume_id } = useParams();
    const resumeInfo = useSelector((state) => state.editResume.resumeData);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [atsData, setAtsData] = useState(null);
    const [error, setError] = useState(null);

    // Fetch resume from API if Redux store is empty (e.g. on direct URL access or page refresh)
    useEffect(() => {
        const init = async () => {
            let data = resumeInfo;
            if (!resumeInfo || !resumeInfo._id) {
                try {
                    const response = await getResumeData(resume_id);
                    data = response.data;
                    dispatch(addResumeData(data));
                } catch (err) {
                    setError("Failed to load resume data. Please go back and try again.");
                    setLoading(false);
                    return;
                }
            }
            analyzeData(data);
        };
        init();
    }, [resume_id]);

    const analyzeData = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                skills: data?.skills || [],
                projects: data?.projects || [],
                certifications: data?.certifications || [],
                experience: data?.experience || [],
            };
            const response = await analyzeResumeAts(payload);
            if (response.success) {
                setAtsData(response.data);
            } else {
                setError("Analysis failed. Please try again.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const analyze = () => analyzeData(resumeInfo);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <LoaderCircle className="h-10 w-10 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-medium text-gray-700">Analyzing Your Resume for ATS Compatibility...</h2>
                <p className="text-gray-500 mt-2">Checking skills, verifying links, and calculating credibility.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 max-w-2xl mx-auto text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex justify-center gap-3">
                    <Link to={`/dashboard`}>
                        <Button>Return to Dashboard</Button>
                    </Link>
                    <Button variant="outline" onClick={analyze}>Try Again</Button>
                </div>
            </div>
        );
    }

    const { atsScore, analysis, suggestions } = atsData || {};

    // Determine color based on score
    let scoreColor = "#ef4444"; // Red (Below 60)
    if (atsScore >= 80) scoreColor = "#22c55e"; // Green
    else if (atsScore >= 60) scoreColor = "#eab308"; // Yellow

    return (
        <div className="max-w-4xl mx-auto p-5 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">ATS Resume Analysis</h1>
                <Link to={`/dashboard/view-resume/${resume_id}`}>
                    <Button variant="outline" className="gap-2">
                        View Final Resume <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score Column */}
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                    <div className="w-48 h-48 mb-6">
                        <CircularProgressbar
                            value={atsScore}
                            text={`${atsScore}`}
                            strokeWidth={8}
                            styles={buildStyles({
                                textSize: '24px',
                                pathColor: scoreColor,
                                textColor: '#1f2937',
                                trailColor: '#f3f4f6',
                            })}
                        />
                    </div>
                    <h2 className="text-xl font-bold text-gray-700">ATS Score / 100</h2>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        {atsScore >= 80
                            ? "Excellent! Your resume is highly optimized for Applicant Tracking Systems."
                            : atsScore >= 60
                            ? "Good start, but some improvements can dramatically increase your callback rate."
                            : "Needs work. Follow the suggestions to fortify your structural data."}
                    </p>
                </div>

                {/* Analysis Breakdown */}
                <div className="md:col-span-2 space-y-6">
                    {/* Strengths / Analysis Array */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 h-6 w-6" /> Structural Insights
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(analysis || {}).map(([key, value]) => (
                                <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold capitalize tracking-wider">{key}</span>
                                    <span className="text-lg font-medium text-gray-800 mt-1">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions Box */}
                    {suggestions && suggestions.length > 0 && (
                        <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100">
                            <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="text-orange-500 h-6 w-6" /> Areas to Improve
                            </h3>
                            <ul className="space-y-3">
                                {suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-orange-800">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Link to={`/dashboard/edit-resume/${resume_id}`}>
                    <Button variant="ghost" className="text-primary gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Editor
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default ATSAnalysis;
