import express from 'express';
import { UserList , JoiningRequest, AcceptJoiningRequest, RejectJoiningRequest, ReportedPosts} from '../Controllers/Moderator.js';
import { deleteReportedPost } from '../Controllers/Moderator.js'
import { blockReportedPost } from '../Controllers/Moderator.js'
import { stats} from '../Controllers/Moderator.js'
import { ignoreReportedPost } from '../Controllers/Moderator.js'
import { unignoreReportedPost } from '../Controllers/Moderator.js'

const router = express.Router();

router.post('/user_list', UserList);
router.post('/joining_request', JoiningRequest);
router.post('/accept_joining_request', AcceptJoiningRequest);
router.post('/reject_joining_request', RejectJoiningRequest);
router.post('/reported_posts', ReportedPosts);
router.post('/deletereportedpost', deleteReportedPost)
router.post('/blockreportedpost', blockReportedPost)
router.post('/ignorereportedpost', ignoreReportedPost )
router.post('/unignorereportedpost', unignoreReportedPost)
router.post('/stats', stats)


export default router;