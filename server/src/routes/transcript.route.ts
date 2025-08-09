import express from 'express';
import { handleAiGirlAudioStream, handleAiGirlSpeakAudioStream } from '../controllers/transcript.controller.js';

const router = express.Router();

router.post('/', handleAiGirlAudioStream);
router.post('/speaker', handleAiGirlSpeakAudioStream);

export default router;