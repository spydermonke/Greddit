import express from 'express';
import { savePost} from '../Controllers/SavePost.js';
import { getSavePost} from '../Controllers/SavePost.js';
import { removesavePost} from '../Controllers/SavePost.js';

const router = express.Router();

router.post('/savespost', savePost)
router.post('/getsavedpost', getSavePost)
router.post('/removesavedpost', removesavePost)

export default router;