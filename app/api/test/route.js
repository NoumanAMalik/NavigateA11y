import { NextResponse } from "next/server";

export async function GET(request) {
    return NextResponse.json({ result: "Hello World" });
}

// export async function HEAD(request) {}

// export async function POST(request) {}

// export async function PUT(request) {}

// export async function DELETE(request) {}

// export async function PATCH(request) {}
