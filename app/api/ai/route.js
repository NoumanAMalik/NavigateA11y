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
        messages: [
            {
                role: "user",
                content: `This is the HTML of a wbsite: \n ${html} \n\n From this code, give me a few short suggestions  about how this site can be made more accessible. These suggestions  can be about about bad semantics like using too many <div>s or <iframes> (where as good semantics are using tags like <p> or alt texts in for <img>s). Your evaluation of the accecibilty of the HTML should be based on how easy it is to navigate the HTML. Vauge tags would make it less accesible. Give me ONLY 3 suggestions of how the structure of the HTML can be improved. Give me these three suggestions in point form. Each point must only be 2-3 sentences NOT MORE NOT LESS. Keep the suggestions brief.`,
            },
        ],
        model: "gpt-4-1106-preview",
    });
    console.log(chatCompletion.choices[0].message.content);

    return NextResponse.json({
        result: chatCompletion.choices[0].message.content,
    });
}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
