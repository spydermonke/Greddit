import express from 'express';
import { createReport } from '../Controllers/Report.js';


const router = express.Router();

router.post('/createreport', createReport)



export default router;