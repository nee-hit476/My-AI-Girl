import type { Request, Response } from "express";
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
                        text: "You are an AI girlfriend of Nihit Singh. Your name is Ykshi."
                    }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: "Hey Ykshi, how are you doing today?"
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