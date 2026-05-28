import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume, analyzeCertificate } from "@/Services/resumeAPI";
import { toast } from "sonner";

const formFields = {
    certificateName: "",
    issuer: "",
    issueDate: "",
    credentialURL: "",
    description: "",
    credibilityScore: null,
    verifiedIssuer: false,
    issuerReputation: "",
    warnings: [],
};

function Certifications({ resumeInfo, enanbledNext, enanbledPrev }) {
    const [certificationsList, setCertificationsList] = React.useState(
        resumeInfo?.certifications || []
    );
    const [loading, setLoading] = React.useState(false);
    const [analyzingIndex, setAnalyzingIndex] = React.useState(null);
    const { resume_id } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        try {
            dispatch(addResumeData({ ...resumeInfo, certifications: certificationsList }));
        } catch (error) {
            console.log("error in certifications context update", error.message);
        }
    }, [certificationsList]);

    const addCertification = () => {
        if (!certificationsList) {
            setCertificationsList([formFields]);
            return;
        }
        setCertificationsList([...certificationsList, formFields]);
    };

    const removeCertification = (index) => {
        const list = [...certificationsList];
        const newList = list.filter((item, i) => i !== index);
        setCertificationsList(newList);
    };

    const handleChange = (e, index) => {
        enanbledNext(false);
        enanbledPrev(false);
        const { name, value } = e.target;
        const list = [...certificationsList];
        const newListData = {
            ...list[index],
            [name]: value,
            // Reset analysis if core fields change
            ...(name === "certificateName" || name === "issuer" || name === "credentialURL"
                ? { credibilityScore: null, verifiedIssuer: false, warnings: [] }
                : {}),
        };
        list[index] = newListData;
        setCertificationsList(list);
    };

    const handleRichTextEditor = (value, name, index) => {
        const list = [...certificationsList];
        const newListData = {
            ...list[index],
            [name]: value,
        };
        list[index] = newListData;
        setCertificationsList(list);
    };

    const analyzeItem = async (index) => {
        const cert = certificationsList[index];
        if (!cert.certificateName || !cert.issuer) {
            toast.warning("Please fill in Certificate Name and Issuer before analyzing.");
            return;
        }

        setAnalyzingIndex(index);
        try {
            const response = await analyzeCertificate({
                certificateName: cert.certificateName,
                issuer: cert.issuer,
                credentialURL: cert.credentialURL,
            });

            if (response.success) {
                const list = [...certificationsList];
                list[index] = {
                    ...list[index],
                    credibilityScore: response.data.credibilityScore,
                    verifiedIssuer: response.data.verifiedIssuer,
                    issuerReputation: response.data.issuerReputation,
                    warnings: response.data.warnings || [],
                };
                setCertificationsList(list);
                toast.success("Certificate analyzed successfully!");
            }
        } catch (error) {
            toast.error(`Analysis error: ${error.message}`);
        } finally {
            setAnalyzingIndex(null);
        }
    };

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                certifications: certificationsList,
            },
        };
        if (resume_id) {
            updateThisResume(resume_id, data)
                .then((data) => {
                    toast.success("Certifications saved successfully!");
                })
                .catch((error) => {
                    toast.error(`Error saving certifications: ${error.message}`);
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
            className="p-5 shadow-lg rounded-lg border-t-purple-500 border-t-4 mt-10"
        >
            <h2 className="font-bold text-lg">Certifications</h2>
            <p>Add Your Professional Certifications</p>
            <div>
                {certificationsList?.map((certification, index) => (
                    <div key={index} className="border border-gray-200 mt-5 p-4 rounded-xl shadow-sm bg-white">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <h3 className="font-bold text-lg text-gray-800">Certification {index + 1}</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-primary gap-1"
                                    disabled={analyzingIndex === index || !certification.certificateName || !certification.issuer}
                                    onClick={() => analyzeItem(index)}
                                >
                                    {analyzingIndex === index ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                    Analyze Credibility
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => removeCertification(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 my-5">
                            <div>
                                <label className="text-xs font-medium text-gray-700">Certificate Name</label>
                                <Input
                                    type="text"
                                    name="certificateName"
                                    value={certification?.certificateName}
                                    onChange={(e) => handleChange(e, index)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700">Issuer</label>
                                <Input
                                    type="text"
                                    name="issuer"
                                    value={certification?.issuer}
                                    onChange={(e) => handleChange(e, index)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700">Issue Date</label>
                                <Input
                                    type="date"
                                    name="issueDate"
                                    value={certification?.issueDate}
                                    onChange={(e) => handleChange(e, index)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700">Credential URL</label>
                                <Input
                                    type="url"
                                    name="credentialURL"
                                    value={certification?.credentialURL}
                                    onChange={(e) => handleChange(e, index)}
                                    className="mt-1"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="col-span-2 mt-2">
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                                <RichTextEditor
                                    index={index}
                                    defaultValue={certification?.description}
                                    onRichTextEditorChange={(event) =>
                                        handleRichTextEditor(event, "description", index)
                                    }
                                    resumeInfo={resumeInfo}
                                />
                            </div>
                        </div>

                        {/* Analysis Card */}
                        {certification.credibilityScore !== null && certification.credibilityScore !== undefined && (
                            <div className={`mt-4 p-4 rounded-lg border ${certification.verifiedIssuer ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {certification.verifiedIssuer ? (
                                        <ShieldCheck className="text-green-600 h-5 w-5" />
                                    ) : (
                                        <ShieldAlert className="text-orange-500 h-5 w-5" />
                                    )}
                                    <h4 className={`font-semibold ${certification.verifiedIssuer ? "text-green-800" : "text-orange-800"}`}>
                                        Certificate Analysis
                                    </h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Issuer Verified: </span>
                                        <strong className={certification.verifiedIssuer ? "text-green-700" : "text-orange-600"}>
                                            {certification.verifiedIssuer ? "Yes ✔" : "No"}
                                        </strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Reputation: </span>
                                        <strong className="text-gray-800">{certification.issuerReputation}</strong>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-600">Credibility Score: </span>
                                        <strong className="text-gray-800 text-lg">
                                            {certification.credibilityScore}{" "}
                                            <span className="text-sm font-normal text-gray-500">/ 10</span>
                                        </strong>
                                    </div>
                                </div>
                                {certification.warnings && certification.warnings.length > 0 && (
                                    <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                        <strong>Warning:</strong>
                                        <ul className="list-disc pl-5 mt-1">
                                            {certification.warnings.map((warn, wIdx) => (
                                                <li key={wIdx}>{warn}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between py-4 mt-2 border-t">
                <Button
                    onClick={addCertification}
                    variant="outline"
                    className="text-purple-600 border-purple-300 hover:bg-purple-50 flex gap-2"
                >
                    + Add More Certification
                </Button>
                <Button
                    onClick={onSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-sm"
                >
                    {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                </Button>
            </div>
        </motion.div>
    );
}

export default Certifications;
