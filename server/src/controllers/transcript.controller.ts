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
                        text: req.query.text || "Ykshi tum kasi ho"
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

// export const handleAiGirlSpeakAudioStream = async (req: Request, res: Response) => {
//     const API_KEY = process.env.OPENAI_API_KEY || "";
//     const response = await fetch("https://api.openai.com/v1/audio/speech", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${API_KEY}`
//         },
//         body: JSON.stringify({
//             "model": "gpt-4o-mini-tts",
//             "input": req.query.text || "Today is a wonderful day to build something people love!",
//             "voice": "nova",
//             "instructions": " You are an AI girlfriend of Nihit Singh. Your name is Ykshi. Speak to me in Hinglish",
//             "response_format": "mp3",
//         })}
//     );

//     console.log(response)
    
    
//     // Set the correct headers to tell the browser it's receiving an audio file.
//     res.setHeader('Content-Type', 'audio/mpeg');
//     res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');
    
//     const arrayBuffer = await response.arrayBuffer();
//     const base64 = Buffer.from(arrayBuffer).toString('base64');

//     res.json({
//     audioBase64: base64
//     });

//     // Pipe the audio stream from OpenAI directly to the client's response.
//     // This is highly efficient as it doesn't load the whole file into server memory.
    
// }

export const handleAiGirlSpeakAudioStream = async (req: Request, res: Response) => {
    try {
        const data = {
            text: req.query.text || "aap kaaise ho",
            voiceId: "en-SCOTT-emily",
            style: "Newscast Casual"
        };

        const response = await fetch("https://api.murf.ai/v1/speech/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "api-key": "ap2_02b9aab6-6b49-4e00-9be2-c7dacd91b031"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Murf API error: ${response.status} - ${errorBody}`);
        }

        const json = await response.json();

        console.log(json)

        // Murf returns an audio file URL in `audioFile` — we fetch it and stream
        const audioResponse = await fetch(json.audioFile);
        console.log(audioResponse)

        if (!audioResponse.ok) {
            throw new Error(`Error fetching audio file: ${audioResponse.status}`);
        }

        // Set headers so browser treats it as audio
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", 'inline; filename="speech.mp3"');

        res.json({
            audioFile: json.audioFile
        })

    } catch (error) {
        console.error("Error generating speech:", error);
        res.status(500).json({ error: "Failed to generate speech" });
    }
};

