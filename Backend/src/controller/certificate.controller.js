import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const trustedIssuers = [
    "Google",
    "Microsoft",
    "Oracle",
    "Amazon",
    "AWS",
    "Coursera",
    "edX",
    "IBM",
    "Meta",
    "NVIDIA",
    "Stanford Online",
    "Harvard Online",
    "Cisco",
    "Udacity"
];

const knownDomains = [
    "coursera.org",
    "edx.org",
    "aws.amazon.com",
    "oracle.com",
    "google.com",
    "microsoft.com",
    "credly.com",
    "cisco.com",
    "ibm.com"
];

const techKeywords = [
    "ai", "cloud", "data", "machine learning", "deep learning",
    "security", "devops", "kubernetes", "docker", "frontend",
    "backend", "fullstack", "react", "node", "python", "java", "sql"
];

const analyzeCertificate = async (req, res) => {
    const { certificateName, issuer, credentialURL } = req.body;

    if (!certificateName || !issuer) {
        return res.status(400).json(
            new ApiError(400, "Certificate name and issuer are required for analysis.")
        );
    }

    let credibilityScore = 0;
    let verifiedIssuer = false;
    let issuerReputation = "Low";
    let warnings = [];

    // Check Issuer
    const isTrustedIssuer = trustedIssuers.some(
        trusted => trusted.toLowerCase() === issuer.toLowerCase()
    );

    if (isTrustedIssuer) {
        verifiedIssuer = true;
        issuerReputation = "High";
        credibilityScore += 5;
    } else {
        credibilityScore -= 3;
        warnings.push("Issuer not recognized. Please verify the authenticity of this certificate.");
    }

    // Check Credential URL
    if (credentialURL && credentialURL.trim() !== "") {
        credibilityScore += 2;

        try {
            const url = new URL(credentialURL);
            const isKnownDomain = knownDomains.some(domain => url.hostname.includes(domain));

            if (isKnownDomain) {
                credibilityScore += 2;
                if (!verifiedIssuer) {
                    issuerReputation = "Medium"; // Upgrade if recognized domain but not exact issuer match
                }
            }
        } catch (error) {
            warnings.push("Provided credential URL appears invalid.");
        }
    } else {
        warnings.push("No credential URL provided. Certificates with verifiable links hold more weight.");
    }

    // Check Keywords
    const certNameLower = certificateName.toLowerCase();
    const hasTechKeyword = techKeywords.some(keyword => certNameLower.includes(keyword));

    if (hasTechKeyword) {
        credibilityScore += 1;
    }

    // Clamp limits to 0 - 10
    credibilityScore = Math.max(0, Math.min(10, credibilityScore));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                verifiedIssuer,
                issuerReputation,
                credibilityScore,
                warnings
            },
            "Certificate analyzed successfully."
        )
    );
};

export { analyzeCertificate };
