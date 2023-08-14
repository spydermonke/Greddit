import express from 'express';
import { register } from '../Controllers/Authentication.js';
import { login }  from '../Controllers/Authentication.js';

const router = express.Router();


router.post('/register', register);
router.post("/login", login);

export default router;