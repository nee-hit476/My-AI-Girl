import express from 'express';
import { handleAiGirlAudioStream } from '../controllers/transcript.controller.js';

const router = express.Router();

router.get('/', handleAiGirlAudioStream);

export default router;