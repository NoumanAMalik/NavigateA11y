import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    const { link } = await request.json();
    if (link == "") return NextResponse.json({ result: "Empty string" });

    console.log(link);

    const response = await axios.get(link);
    const html = response.data;

    return NextResponse.json({
        result: "Pass",
    });
}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
