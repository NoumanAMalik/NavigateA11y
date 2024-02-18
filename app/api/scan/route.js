import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
    return NextResponse.json({ result: "Hello World" });
}

// export async function HEAD(request) {}

export async function POST(request) {
    const { link } = await request.json();
    if (link == "") return NextResponse.json({ result: "Empty string" });;

    console.log(link);

    axios.get(link)
        .then(response => {
            const html = response.data;

            let elements = [];
            let htmlArr = html.split('<');

            for (const i of htmlArr) {
                if (i.includes('>')) {
                    const arr = i.split('>');
                    if (i[0] !== '/') {
                        elements.push(arr[0]);
                    }
                }
            }

            let badPts = 0;
            let goodPts = 0;

            const goodSemantics = ["!DOCTYPE", "html", "head", "title", "body", "header", "nav", "main", "section", "article", "aside", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "p", "ol", "ul", "li", "blockquote", "pre", "figure", "figcaption", "a", "strong", "em", "mark", "time", "code", "form", "label", "input", "textarea", "button", "select", "option", "fieldset", "legend", "img", "audio", "video", "canvas", "details", "summary", "label"];
            const badSemantics = ["frame", "frameset", "noframes", "center", "spacer", "marquee", "blink", "font", "basefont", "u", "strike", "big", "small", "tt", "b", "i", "dir", "menu", "isindex", "applet", "acronym", "bgsound", "nobr", "plaintext", "rb", "rtc", "xmp", "listing", "nextid", "noembed", "strike", "basefont", "big", "blink", "center", "font", "marquee", "multicol", "spacer", "tt", "div", "span"
            ];

            let Iflag = false;

            for (const i of elements) {
                if (badSemantics.includes(i)) {
                    badPts += 1;
                }
                if (goodSemantics.includes(i)) {
                    goodPts += 1;
                }
                if (Iflag == false) {
                    Iflag = true;
                } else if (i.includes("iframe")) {
                    badPts += 1;
                }
                if (i.substring(0, 3) === "img") {
                    if (i.includes("alt")) {
                        goodPts += 3;
                    } else {
                        badPts += 3;
                    }
                }
                if (i.includes("aria") || i.includes("placeholder")) {
                    goodPts += 3;
                }
            }

            const accessibilityScore = (goodPts / (goodPts + badPts)) * 100;
            console.log(`This website is ${accessibilityScore.toFixed(2)}% accessible`);
        })
        .catch(error => {
            console.error(`Error fetching data: ${error.message}`);
        });


    return NextResponse.json({ result: "Pass" });
}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
