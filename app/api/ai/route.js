import { NextResponse } from "next/server";
import axios from "axios";

import OpenAI from "openai";

export async function POST(request) {
    const { link } = await request.json();
    if (link == "") return NextResponse.json({ result: "" });

    console.log(link);

    const response = await axios.get(link);
    const html = response.data;

    let tagString = "";

    let elements = [];
    let htmlArr = html.split("<");

    for (const i of htmlArr) {
        if (i.includes(">")) {
            const arr = i.split(">");
            if (i[0] !== "/") {
                elements.push(arr[0]);
            }
            tagString += `<${arr[0]}>`;
        }
    }

    console.log(tagString);


    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    /*const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `This is the HTML of a wbsite (without the unnecessary content): \n ${tagString} \n\n From this code, give me a few short suggestions about how this site can be made more accessible. These suggestions  can be about about bad semantics like using too many much of a certain tag as well as other bad html structure practices. Your evaluation of the accecibilty of the HTML should be based on how easy it is to navigate the HTML. Vauge tags would make it less accesible. Give me ONLY 3 suggestions of how the structure of the HTML can be improved. Give me these three suggestions in markdown bullet point form using the - symbol for each point. Also put a newline character in between every point. Start each point with a title that is bolded, and then the information that is needed. This format is very strict please follow it exactly. Each point must only be 2-3 sentences NOT MORE NOT LESS. Keep the suggestions brief.`,
            },
        ],
        model: "gpt-4-0125-preview",
        temperature: 1.0,
    });
    console.log(chatCompletion.choices[0].message.content);*/

    return NextResponse.json({
        result: "balls"/*chatCompletion.choices[0].message.content*/,
    });
}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
