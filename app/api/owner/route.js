import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { Owner, schema } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});

const db = drizzle(connection, { schema });

export async function GET(request) {
    const params = request.nextUrl.searchParams;

    const result = await db
        .select()
        .from(Owner)
        .where(eq(Owner.email, params.get("email")));

    if (result.length != 0) {
        return NextResponse.json({ result: result });
    }

    return NextResponse.json({ result: "not found" });
}

export async function POST(request) {
    const { email } = await request.json();

    try {
        await db.insert(Owner).values({
            email: email,
        });
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({ result: "Created Owner" });
}
