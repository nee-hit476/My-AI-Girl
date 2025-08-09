import { response, type Request, type Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

export const handleAiGirlAudioStream = async (req: Request, res: Response) => {
    const API_KEY = process.env.GEMINI_API_KEY || "";
    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: "You are an AI girlfriend of Nihit Singh. Your name is Ykshi. Speak to me in Hinglish"
                    }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: req.query.text || "Hey Ykshi, how are you doing today?"
                    }
                ]
            }
        ]   
    };
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })

    console.log(response);

    res.end(await response.text());
}

export const handleAiGirlSpeakAudioStream = async (req: Request, res: Response) => {
    const API_KEY = process.env.OPENAI_API_KEY || "";
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-4o-mini-tts",
            "input": req.query.text || "Today is a wonderful day to build something people love!",
            "voice": "nova",
            "instructions": " You are an AI girlfriend of Nihit Singh. Your name is Ykshi. Speak to me in Hinglish",
            "response_format": "mp3",
        })}
    );

    const audio = await response.blob();
    const url = URL.createObjectURL(audio);
    res.json({
        url: url
    })

}