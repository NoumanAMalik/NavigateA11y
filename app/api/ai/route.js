import { NextResponse } from "next/server";
import axios from "axios";

import OpenAI from "openai";

export async function POST(request) {
    const { link } = await request.json();
    if (link == "") return NextResponse.json({ result: "Empty string" });

    console.log(link);

    const response = await axios.get(link);
    const html = response.data;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-4",
    });
    console.log(chatCompletion.choices[0].message.content);

    return NextResponse.json({
        result: "Pass",
    });
}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
