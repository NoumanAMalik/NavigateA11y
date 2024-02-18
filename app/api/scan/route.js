import { NextResponse } from "next/server";
import axios from "axios";
import goodSemantics from "@/data/goodSemantics";
import badSemantics from "@/data/badSemantics";

// export async function GET(request) {
//     return NextResponse.json({ result: "Hello World" });
// }

// export async function HEAD(request) {}

export async function POST(request) {
    const { link } = await request.json();
    if (link == "") return NextResponse.json({ result: "Empty string" });

    console.log(link);

    axios
        .get(link)
        .then((response) => {
            const html = response.data;

            let elements = [];
            let htmlArr = html.split("<");

            for (const i of htmlArr) {
                if (i.includes(">")) {
                    const arr = i.split(">");
                    if (i[0] !== "/") {
                        elements.push(arr[0]);
                    }
                }
            }

            let badPts = 0;
            let goodPts = 0;

            let Iflag = false;
            let iFrameCounter = 0;
            let altAttributeCounter = 0;
            let ariaCounter = 0;
            let placeholderCounter = 0;

            for (const i of elements) {
                if (badSemantics[i] >= 0) {
                    badSemantics[i] += 1;
                    badPts += 1;
                }
                if (goodSemantics[i] >= 0) {
                    goodSemantics[i] += 1;
                    goodPts += 1;
                }
                if (Iflag == false) {
                    Iflag = true;
                } else if (i.includes("iframe")) {
                    iFrameCounter += 1;
                    badPts += 1;
                }
                if (i.substring(0, 3) === "img") {
                    if (i.includes("alt")) {
                        altAttributeCounter += 1;
                        goodPts += 3;
                    } else {
                        badPts += 3;
                    }
                }
                if (i.includes("aria")) {
                    ariaCounter += 1;
                    goodPts += 3;
                }

                if (i.includes("placeholder")) {
                    placeholderCounter += 1;
                    goodPts += 3;
                }
            }

            const accessibilityScore = (goodPts / (goodPts + badPts)) * 100;
            console.log(
                `This website is ${accessibilityScore.toFixed(2)}% accessible`,
            );
            console.log(goodSemantics);
            console.log(badSemantics);
        })
        .catch((error) => {
            console.error(`Error fetching data: ${error.message}`);
        });

    return NextResponse.json({ result: "Pass" });
}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
