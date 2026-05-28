import { Router } from "express";
import { analyzeCertificate } from "../controller/certificate.controller.js";

const router = Router();

router.post("/analyze", analyzeCertificate);

export default router;
